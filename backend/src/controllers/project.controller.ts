import { Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient, Role } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    let projects;

    if (user.role === Role.ADMIN) {
      // Admin sees all projects
      projects = await prisma.project.findMany({
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { tasks: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else if (user.role === Role.PROJECT_MANAGER) {
      // PM sees only their projects
      projects = await prisma.project.findMany({
        where: { createdById: user.id },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { tasks: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Developer sees projects with tasks assigned to them
      projects = await prisma.project.findMany({
        where: {
          tasks: {
            some: { assignedTo: user.id },
          },
        },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { tasks: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        tasks: {
          include: {
            assignedUser: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check access
    if (user.role === Role.DEVELOPER) {
      const hasAccess = project.tasks.some((task) => task.assignedTo === user.id);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (user.role === Role.PROJECT_MANAGER) {
      if (project.createdById !== user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, clientName, description } = req.body;
    const user = req.user!;

    const project = await prisma.project.create({
      data: {
        name,
        clientName,
        description,
        createdById: user.id,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, clientName, description } = req.body;
    const user = req.user!;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check ownership for PM
    if (user.role === Role.PROJECT_MANAGER && project.createdById !== user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: { name, clientName, description },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check ownership for PM
    if (user.role === Role.PROJECT_MANAGER && project.createdById !== user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.project.delete({ where: { id: parseInt(id) } });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
