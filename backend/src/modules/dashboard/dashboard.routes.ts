import { Router } from 'express';
import * as DashboardController from './dashboard.controller';
import { authenticate, authorize } from '../../common/middlewares/auth.middleware';
import { UserRole } from '../../common/types';

const router = Router();

// Dashboard data is for admin only
router.get('/', authenticate, authorize(UserRole.ADMIN), DashboardController.getDashboardData);

export { router as dashboardRoutes };
