import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { Role } from '@prisma/client';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller';

const router = Router();

router.use(authenticate);

router.get('/', getProjects);
router.get('/:id', getProject);
router.post(
  '/',
  authorize(Role.ADMIN, Role.PROJECT_MANAGER),
  [
    body('name').notEmpty().withMessage('Project name is required'),
    body('clientName').notEmpty().withMessage('Client name is required'),
  ],
  createProject
);
router.put('/:id', authorize(Role.ADMIN, Role.PROJECT_MANAGER), updateProject);
router.delete('/:id', authorize(Role.ADMIN, Role.PROJECT_MANAGER), deleteProject);

export default router;
