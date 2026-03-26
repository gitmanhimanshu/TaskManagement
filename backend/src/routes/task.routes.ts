import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../controllers/task.controller';

const router = Router();

router.use(authenticate);

router.get('/', getTasks);
router.get('/:id', getTask);
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Task title is required'),
    body('projectId').isInt().withMessage('Valid project ID is required'),
    body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  ],
  createTask
);
router.put('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;
