import { PrismaClient, TaskStatus } from '@prisma/client';
import { Server } from 'socket.io';

const prisma = new PrismaClient();

export const checkOverdueTasks = async (io: Server) => {
  try {
    const now = new Date();

    // Find tasks that are overdue but not marked as such
    const overdueTasks = await prisma.task.findMany({
      where: {
        dueDate: {
          lt: now,
        },
        isOverdue: false,
        status: {
          not: TaskStatus.DONE,
        },
      },
      include: {
        project: true,
      },
    });

    if (overdueTasks.length === 0) {
      console.log('No new overdue tasks found');
      return;
    }

    // Update tasks to mark as overdue
    const taskIds = overdueTasks.map((task) => task.id);
    await prisma.task.updateMany({
      where: {
        id: {
          in: taskIds,
        },
      },
      data: {
        isOverdue: true,
      },
    });

    console.log(`Marked ${overdueTasks.length} tasks as overdue`);

    // Emit real-time updates for each project
    overdueTasks.forEach((task) => {
      io.to(`project:${task.projectId}`).emit('task:updated', {
        task: { ...task, isOverdue: true },
        type: 'overdue',
      });
    });
  } catch (error) {
    console.error('Overdue task check error:', error);
  }
};
