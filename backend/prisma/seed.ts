import { PrismaClient, Role, TaskStatus, TaskPriority } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  await prisma.user.create({
    data: {
      email: 'admin@company.com',
      password: await bcrypt.hash('Admin@123', 10),
      name: 'Admin User',
      role: Role.ADMIN,
    },
  });

  const pm1 = await prisma.user.create({
    data: {
      email: 'pm1@company.com',
      password: await bcrypt.hash('PM@123', 10),
      name: 'Ravi Kumar',
      role: Role.PROJECT_MANAGER,
    },
  });

  const pm2 = await prisma.user.create({
    data: {
      email: 'pm2@company.com',
      password: await bcrypt.hash('PM@123', 10),
      name: 'Priya Sharma',
      role: Role.PROJECT_MANAGER,
    },
  });

  const dev1 = await prisma.user.create({
    data: {
      email: 'dev1@company.com',
      password: await bcrypt.hash('Dev@123', 10),
      name: 'Amit Patel',
      role: Role.DEVELOPER,
    },
  });

  const dev2 = await prisma.user.create({
    data: {
      email: 'dev2@company.com',
      password: await bcrypt.hash('Dev@123', 10),
      name: 'Sneha Reddy',
      role: Role.DEVELOPER,
    },
  });

  const dev3 = await prisma.user.create({
    data: {
      email: 'dev3@company.com',
      password: await bcrypt.hash('Dev@123', 10),
      name: 'Vikram Singh',
      role: Role.DEVELOPER,
    },
  });

  const dev4 = await prisma.user.create({
    data: {
      email: 'dev4@company.com',
      password: await bcrypt.hash('Dev@123', 10),
      name: 'Anjali Gupta',
      role: Role.DEVELOPER,
    },
  });

  console.log('✅ Users created');

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: 'E-Commerce Platform',
      clientName: 'TechMart Solutions',
      description: 'Building a modern e-commerce platform with payment integration',
      createdById: pm1.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile Banking App',
      clientName: 'SecureBank Ltd',
      description: 'iOS and Android banking application with biometric authentication',
      createdById: pm1.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: 'Healthcare Portal',
      clientName: 'MediCare Systems',
      description: 'Patient management system with appointment scheduling',
      createdById: pm2.id,
    },
  });

  console.log('✅ Projects created');

  // Create tasks for Project 1
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const task1 = await prisma.task.create({
    data: {
      title: 'Setup authentication system',
      description: 'Implement JWT-based authentication with refresh tokens',
      status: TaskStatus.DONE,
      priority: TaskPriority.CRITICAL,
      dueDate: twoDaysAgo,
      projectId: project1.id,
      assignedTo: dev1.id,
      isOverdue: false,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Design product catalog UI',
      description: 'Create responsive product listing and detail pages',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: yesterday,
      projectId: project1.id,
      assignedTo: dev2.id,
      isOverdue: true,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Integrate payment gateway',
      description: 'Add Stripe payment integration for checkout',
      status: TaskStatus.TODO,
      priority: TaskPriority.CRITICAL,
      dueDate: tomorrow,
      projectId: project1.id,
      assignedTo: dev1.id,
    },
  });

  const task4 = await prisma.task.create({
    data: {
      title: 'Implement shopping cart',
      description: 'Build cart functionality with local storage persistence',
      status: TaskStatus.IN_REVIEW,
      priority: TaskPriority.HIGH,
      dueDate: nextWeek,
      projectId: project1.id,
      assignedTo: dev3.id,
    },
  });

  const task5 = await prisma.task.create({
    data: {
      title: 'Setup email notifications',
      description: 'Configure SendGrid for order confirmation emails',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: nextWeek,
      projectId: project1.id,
      assignedTo: dev2.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Write API documentation',
      description: 'Document all REST endpoints using Swagger',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      dueDate: nextWeek,
      projectId: project1.id,
      assignedTo: dev4.id,
    },
  });

  // Create tasks for Project 2
  const task7 = await prisma.task.create({
    data: {
      title: 'Implement biometric login',
      description: 'Add fingerprint and face ID authentication',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.CRITICAL,
      dueDate: tomorrow,
      projectId: project2.id,
      assignedTo: dev1.id,
    },
  });

  const task8 = await prisma.task.create({
    data: {
      title: 'Build transaction history',
      description: 'Create transaction list with filtering and search',
      status: TaskStatus.IN_REVIEW,
      priority: TaskPriority.HIGH,
      dueDate: nextWeek,
      projectId: project2.id,
      assignedTo: dev3.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Setup push notifications',
      description: 'Configure FCM for transaction alerts',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: nextWeek,
      projectId: project2.id,
      assignedTo: dev2.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Implement fund transfer',
      description: 'Build secure money transfer between accounts',
      status: TaskStatus.TODO,
      priority: TaskPriority.CRITICAL,
      dueDate: twoDaysAgo,
      projectId: project2.id,
      assignedTo: dev4.id,
      isOverdue: true,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Add QR code scanner',
      description: 'Implement QR-based payment feature',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: nextWeek,
      projectId: project2.id,
      assignedTo: dev1.id,
    },
  });

  // Create tasks for Project 3
  const task12 = await prisma.task.create({
    data: {
      title: 'Design appointment booking flow',
      description: 'Create UI for doctor appointment scheduling',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: tomorrow,
      projectId: project3.id,
      assignedTo: dev2.id,
    },
  });

  const task13 = await prisma.task.create({
    data: {
      title: 'Build patient dashboard',
      description: 'Create patient portal with medical history',
      status: TaskStatus.IN_REVIEW,
      priority: TaskPriority.HIGH,
      dueDate: nextWeek,
      projectId: project3.id,
      assignedTo: dev4.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Implement prescription management',
      description: 'Add digital prescription upload and tracking',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: nextWeek,
      projectId: project3.id,
      assignedTo: dev3.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Setup video consultation',
      description: 'Integrate WebRTC for doctor-patient video calls',
      status: TaskStatus.TODO,
      priority: TaskPriority.CRITICAL,
      dueDate: nextWeek,
      projectId: project3.id,
      assignedTo: dev1.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Add lab report integration',
      description: 'Connect with lab systems for report retrieval',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      dueDate: nextWeek,
      projectId: project3.id,
      assignedTo: dev2.id,
    },
  });

  console.log('✅ Tasks created');

  // Create activity logs
  const activities = [
    {
      action: 'moved task from TODO to IN_PROGRESS',
      taskId: task2.id,
      projectId: project1.id,
      userId: dev2.id,
      metadata: { from: 'TODO', to: 'IN_PROGRESS', taskTitle: task2.title },
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
    {
      action: 'moved task from IN_PROGRESS to DONE',
      taskId: task1.id,
      projectId: project1.id,
      userId: dev1.id,
      metadata: { from: 'IN_PROGRESS', to: 'DONE', taskTitle: task1.title },
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    },
    {
      action: 'moved task from IN_PROGRESS to IN_REVIEW',
      taskId: task4.id,
      projectId: project1.id,
      userId: dev3.id,
      metadata: { from: 'IN_PROGRESS', to: 'IN_REVIEW', taskTitle: task4.title },
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    },
    {
      action: 'created task',
      taskId: task3.id,
      projectId: project1.id,
      userId: pm1.id,
      metadata: { taskTitle: task3.title },
      createdAt: new Date(now.getTime() - 10 * 60 * 60 * 1000),
    },
    {
      action: 'moved task from TODO to IN_PROGRESS',
      taskId: task7.id,
      projectId: project2.id,
      userId: dev1.id,
      metadata: { from: 'TODO', to: 'IN_PROGRESS', taskTitle: task7.title },
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    },
    {
      action: 'moved task from IN_PROGRESS to IN_REVIEW',
      taskId: task8.id,
      projectId: project2.id,
      userId: dev3.id,
      metadata: { from: 'IN_PROGRESS', to: 'IN_REVIEW', taskTitle: task8.title },
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    },
    {
      action: 'moved task from TODO to IN_PROGRESS',
      taskId: task12.id,
      projectId: project3.id,
      userId: dev2.id,
      metadata: { from: 'TODO', to: 'IN_PROGRESS', taskTitle: task12.title },
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    },
    {
      action: 'moved task from IN_PROGRESS to IN_REVIEW',
      taskId: task13.id,
      projectId: project3.id,
      userId: dev4.id,
      metadata: { from: 'IN_PROGRESS', to: 'IN_REVIEW', taskTitle: task13.title },
      createdAt: new Date(now.getTime() - 30 * 60 * 1000),
    },
  ];

  await prisma.activity.createMany({ data: activities });

  console.log('✅ Activities created');

  // Create notifications
  const notifications = [
    {
      userId: dev1.id,
      message: `You have been assigned to task: ${task3.title}`,
      type: 'TASK_ASSIGNED',
      taskId: task3.id,
      isRead: false,
    },
    {
      userId: pm1.id,
      message: `${dev3.name} moved task "${task4.title}" to IN_REVIEW`,
      type: 'TASK_IN_REVIEW',
      taskId: task4.id,
      isRead: false,
    },
    {
      userId: dev2.id,
      message: `You have been assigned to task: ${task5.title}`,
      type: 'TASK_ASSIGNED',
      taskId: task5.id,
      isRead: true,
    },
    {
      userId: pm1.id,
      message: `${dev3.name} moved task "${task8.title}" to IN_REVIEW`,
      type: 'TASK_IN_REVIEW',
      taskId: task8.id,
      isRead: false,
    },
    {
      userId: pm2.id,
      message: `${dev4.name} moved task "${task13.title}" to IN_REVIEW`,
      type: 'TASK_IN_REVIEW',
      taskId: task13.id,
      isRead: false,
    },
  ];

  await prisma.notification.createMany({ data: notifications });

  console.log('✅ Notifications created');

  console.log('🎉 Seed completed successfully!');
  console.log('\n📧 Login credentials:');
  console.log('Admin: admin@company.com / Admin@123');
  console.log('PM1: pm1@company.com / PM@123');
  console.log('PM2: pm2@company.com / PM@123');
  console.log('Dev1: dev1@company.com / Dev@123');
  console.log('Dev2: dev2@company.com / Dev@123');
  console.log('Dev3: dev3@company.com / Dev@123');
  console.log('Dev4: dev4@company.com / Dev@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
