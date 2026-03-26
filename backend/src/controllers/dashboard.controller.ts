import { Response } from 'express';
import { PrismaClient, Role, TaskStatus } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    if (user.role === Role.ADMIN) {
      // Admin dashboard
      const totalProjects = await prisma.project.count();
      const totalTasks = await prisma.task.count();
      const tasksByStatus = await prisma.task.groupBy({
        by: ['status'],
        _count: true,
      });
      const overdueTasks = await prisma.task.count({
        where: { isOverdue: true },
      });

      const statusCounts = {
        TODO: 0,
        IN_PROGRESS: 0,
        IN_REVIEW: 0,
        DONE: 0,
      };

      tasksByStatus.forEach((item) => {
        statusCounts[item.status] = item._count;
      });

      res.json({
        totalProjects,
        totalTasks,
        tasksByStatus: statusCounts,
        overdueTasks,
      });
    } else if (user.role === Role.PROJECT_MANAGER) {
      // PM dashboard
      const projects = await prisma.project.findMany({
        where: { createdById: user.id },
        include: {
          tasks: true,
        },
      });

      const totalProjects = projects.length;
      const allTasks = projects.flatMap((p) => p.tasks);

      const tasksByPriority = {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
        CRITICAL: 0,
      };

      const tasksByStatus = {
        TODO: 0,
        IN_PROGRESS: 0,
        IN_REVIEW: 0,
        DONE: 0,
      };

      allTasks.forEach((task) => {
        tasksByPriority[task.priority]++;
        tasksByStatus[task.status]++;
      });

      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const upcomingDueDates = allTasks.filter(
        (task) =>
          task.dueDate &&
          task.dueDate >= now &&
          task.dueDate <= nextWeek &&
          task.status !== TaskStatus.DONE
      );

      res.json({
        totalProjects,
        totalTasks: allTasks.length,
        tasksByPriority,
        tasksByStatus,
        upcomingDueDates: upcomingDueDates.length,
      });
    } else {
      // Developer dashboard
      const tasks = await prisma.task.findMany({
        where: { assignedTo: user.id },
        include: {
          project: {
            select: { id: true, name: true },
          },
        },
        orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
      });

      const tasksByStatus = {
        TODO: 0,
        IN_PROGRESS: 0,
        IN_REVIEW: 0,
        DONE: 0,
      };

      tasks.forEach((task) => {
        tasksByStatus[task.status]++;
      });

      const overdueTasks = tasks.filter((task) => task.isOverdue).length;

      res.json({
        totalTasks: tasks.length,
        tasksByStatus,
        overdueTasks,
        tasks: tasks.slice(0, 10), // Top 10 tasks
      });
    }
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
