import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { Role } from '@prisma/client';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';

const router = Router();

router.use(authenticate);

router.get('/', authorize(Role.ADMIN), getUsers);
router.post(
  '/',
  authorize(Role.ADMIN),
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required'),
    body('role').isIn(['ADMIN', 'PROJECT_MANAGER', 'DEVELOPER']),
  ],
  createUser
);
router.put('/:id', authorize(Role.ADMIN), updateUser);
router.delete('/:id', authorize(Role.ADMIN), deleteUser);

export default router;
