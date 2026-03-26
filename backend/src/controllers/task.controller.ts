import { Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient, Role } from '@prisma/client';
import { AuthRequest } from '../types';
import { io } from '../server';
import { createActivity, createNotification } from '../utils/helpers';

const prisma = new PrismaClient();

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { status, priority, projectId, startDate, endDate } = req.query;

    const where: any = {};

    // Role-based filtering
    if (user.role === Role.DEVELOPER) {
      where.assignedTo = user.id;
    } else if (user.role === Role.PROJECT_MANAGER) {
      where.project = { createdById: user.id };
    }

    // Additional filters
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (projectId) where.projectId = parseInt(projectId as string);
    if (startDate || endDate) {
      where.dueDate = {};
      if (startDate) where.dueDate.gte = new Date(startDate as string);
      if (endDate) where.dueDate.lte = new Date(endDate as string);
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: {
          select: { id: true, name: true, clientName: true },
        },
        assignedUser: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: {
        project: {
          include: {
            createdBy: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        assignedUser: {
          select: { id: true, name: true, email: true },
        },
        activities: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check access
    if (user.role === Role.DEVELOPER && task.assignedTo !== user.id) {
      return res.status(403).json({ error: 'Access denied' });
    } else if (
      user.role === Role.PROJECT_MANAGER &&
      task.project.createdById !== user.id
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user!;
    const { title, description, projectId, assignedTo, status, priority, dueDate } =
      req.body;

    // Check project access
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (
      user.role === Role.PROJECT_MANAGER &&
      project.createdById !== user.id
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assignedTo,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        project: true,
        assignedUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Create activity
    await createActivity({
      action: 'created task',
      taskId: task.id,
      projectId: task.projectId,
      userId: user.id,
      metadata: { taskTitle: task.title },
    });

    // Create notification for assigned user
    if (assignedTo) {
      await createNotification({
        userId: assignedTo,
        message: `You have been assigned to task: ${task.title}`,
        type: 'TASK_ASSIGNED',
        taskId: task.id,
      });

      // Emit real-time notification
      io.to(`user:${assignedTo}`).emit('notification:new', {
        message: `You have been assigned to task: ${task.title}`,
        type: 'TASK_ASSIGNED',
        taskId: task.id,
      });
    }

    // Emit activity to project room
    io.to(`project:${task.projectId}`).emit('activity:new', {
      action: `${user.name || user.email} created task "${task.title}"`,
      taskId: task.id,
      projectId: task.projectId,
      createdAt: new Date(),
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const { title, description, assignedTo, priority, dueDate } = req.body;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: { project: true },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check access
    if (user.role === Role.DEVELOPER && task.assignedTo !== user.id) {
      return res.status(403).json({ error: 'Access denied' });
    } else if (
      user.role === Role.PROJECT_MANAGER &&
      task.project.createdById !== user.id
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const oldAssignedTo = task.assignedTo;

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        assignedTo,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
      include: {
        project: true,
        assignedUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // If assignee changed, create notification
    if (assignedTo && assignedTo !== oldAssignedTo) {
      await createNotification({
        userId: assignedTo,
        message: `You have been assigned to task: ${updatedTask.title}`,
        type: 'TASK_ASSIGNED',
        taskId: updatedTask.id,
      });

      io.to(`user:${assignedTo}`).emit('notification:new', {
        message: `You have been assigned to task: ${updatedTask.title}`,
        type: 'TASK_ASSIGNED',
        taskId: updatedTask.id,
      });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user!;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: { project: true },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check access
    if (user.role === Role.DEVELOPER && task.assignedTo !== user.id) {
      return res.status(403).json({ error: 'Access denied' });
    } else if (
      user.role === Role.PROJECT_MANAGER &&
      task.project.createdById !== user.id
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const oldStatus = task.status;

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        project: true,
        assignedUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Create activity
    await createActivity({
      action: `moved task from ${oldStatus} to ${status}`,
      taskId: updatedTask.id,
      projectId: updatedTask.projectId,
      userId: user.id,
      metadata: {
        from: oldStatus,
        to: status,
        taskTitle: updatedTask.title,
      },
    });

    // Notify PM if task moved to IN_REVIEW
    if (status === 'IN_REVIEW' && task.project.createdById !== user.id) {
      await createNotification({
        userId: task.project.createdById,
        message: `${user.name || user.email} moved task "${updatedTask.title}" to IN_REVIEW`,
        type: 'TASK_IN_REVIEW',
        taskId: updatedTask.id,
      });

      io.to(`user:${task.project.createdById}`).emit('notification:new', {
        message: `${user.name || user.email} moved task "${updatedTask.title}" to IN_REVIEW`,
        type: 'TASK_IN_REVIEW',
        taskId: updatedTask.id,
      });
    }

    // Emit real-time update
    io.to(`project:${updatedTask.projectId}`).emit('task:updated', {
      task: updatedTask,
      oldStatus,
      newStatus: status,
    });

    io.to(`project:${updatedTask.projectId}`).emit('activity:new', {
      action: `${user.name || user.email} moved task "${updatedTask.title}" from ${oldStatus} to ${status}`,
      taskId: updatedTask.id,
      projectId: updatedTask.projectId,
      userId: user.id,
      createdAt: new Date(),
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: { project: true },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Only Admin and PM can delete
    if (user.role === Role.DEVELOPER) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (
      user.role === Role.PROJECT_MANAGER &&
      task.project.createdById !== user.id
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.task.delete({ where: { id: parseInt(id) } });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
