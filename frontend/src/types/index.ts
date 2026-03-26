export enum Role {
  ADMIN = 'ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  DEVELOPER = 'DEVELOPER',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
}

export interface Project {
  id: number;
  name: string;
  clientName: string;
  description?: string;
  createdById: number;
  createdBy?: User;
  createdAt: string;
  tasks?: Task[];
  _count?: {
    tasks: number;
  };
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  isOverdue: boolean;
  projectId: number;
  assignedTo?: number;
  project?: Project;
  assignedUser?: User;
  createdAt: string;
  activities?: Activity[];
}

export interface Activity {
  id: number;
  action: string;
  taskId?: number;
  projectId: number;
  userId: number;
  metadata?: any;
  createdAt: string;
  user?: User;
  task?: { id: number; title: string };
  project?: { id: number; name: string };
}

export interface Notification {
  id: number;
  userId: number;
  message: string;
  type: string;
  taskId?: number;
  isRead: boolean;
  createdAt: string;
  task?: { id: number; title: string };
}

export interface DashboardStats {
  totalProjects?: number;
  totalTasks: number;
  tasksByStatus: {
    TODO: number;
    IN_PROGRESS: number;
    IN_REVIEW: number;
    DONE: number;
  };
  tasksByPriority?: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
  };
  overdueTasks?: number;
  upcomingDueDates?: number;
  tasks?: Task[];
}
