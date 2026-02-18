import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';
import { asyncHandler } from '../../common/middlewares/error.middleware';

const dashboardService = new DashboardService();

export const getDashboardData = asyncHandler(async (req: Request, res: Response) => {
  const stats = await dashboardService.getStats();
  const activity = await dashboardService.getActivity();

  res.status(200).json({
    success: true,
    data: {
      stats,
      activity
    }
  });
});
