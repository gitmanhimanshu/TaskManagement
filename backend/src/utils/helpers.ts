import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateActivityParams {
  action: string;
  taskId?: number;
  projectId: number;
  userId: number;
  metadata?: any;
}

export const createActivity = async (params: CreateActivityParams) => {
  return await prisma.activity.create({
    data: {
      action: params.action,
      taskId: params.taskId,
      projectId: params.projectId,
      userId: params.userId,
      metadata: params.metadata,
    },
  });
};

interface CreateNotificationParams {
  userId: number;
  message: string;
  type: string;
  taskId?: number;
}

export const createNotification = async (params: CreateNotificationParams) => {
  return await prisma.notification.create({
    data: {
      userId: params.userId,
      message: params.message,
      type: params.type,
      taskId: params.taskId,
    },
  });
};
