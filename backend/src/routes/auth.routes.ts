import { Router } from 'express';
import { body } from 'express-validator';
import { login, refresh, logout } from '../controllers/auth.controller';

const router = Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
