import { Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getActivities = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { projectId } = req.query;

    const where: any = {};

    // Role-based filtering
    if (user.role === Role.ADMIN) {
      // Admin sees all activities
      if (projectId) where.projectId = parseInt(projectId as string);
    } else if (user.role === Role.PROJECT_MANAGER) {
      // PM sees activities from their projects
      where.project = { createdById: user.id };
      if (projectId) where.projectId = parseInt(projectId as string);
    } else {
      // Developer sees activities from tasks assigned to them
      where.task = { assignedTo: user.id };
      if (projectId) where.projectId = parseInt(projectId as string);
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        task: {
          select: { id: true, title: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json(activities);
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMissedActivities = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { since } = req.query;

    if (!since) {
      return res.status(400).json({ error: 'since parameter is required' });
    }

    const sinceDate = new Date(since as string);

    const where: any = {
      createdAt: { gt: sinceDate },
    };

    // Role-based filtering
    if (user.role === Role.PROJECT_MANAGER) {
      where.project = { createdById: user.id };
    } else if (user.role === Role.DEVELOPER) {
      where.task = { assignedTo: user.id };
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        task: {
          select: { id: true, title: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json(activities);
  } catch (error) {
    console.error('Get missed activities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
