import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getActivities, getMissedActivities } from '../controllers/activity.controller';

const router = Router();

router.use(authenticate);

router.get('/', getActivities);
router.get('/missed', getMissedActivities);

export default router;
