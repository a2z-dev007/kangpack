import { Router } from 'express';
import { BulkInquiryController } from './bulk-inquiry.controller';
import {
  validateSchema,
  submitBulkInquirySchema,
  updateBulkInquiryStatusSchema,
} from './bulk-inquiry.validation';
import { generalRateLimit } from '../../common/middlewares/rateLimit.middleware';
import { authenticate } from '../../common/middlewares/auth.middleware';
import { requireAdminOrStaff } from '../../common/middlewares/role.middleware';

const router = Router();

// Public submission route with rate limiting
router.post(
  '/',
  generalRateLimit,
  validateSchema(submitBulkInquirySchema),
  BulkInquiryController.submitInquiry
);

// Admin / Staff protected endpoints
router.get(
  '/stats',
  authenticate,
  requireAdminOrStaff,
  BulkInquiryController.getInquiryStats
);

router.get(
  '/',
  authenticate,
  requireAdminOrStaff,
  BulkInquiryController.getAllInquiries
);

router.get(
  '/:id',
  authenticate,
  requireAdminOrStaff,
  BulkInquiryController.getInquiryById
);

router.patch(
  '/:id',
  authenticate,
  requireAdminOrStaff,
  validateSchema(updateBulkInquiryStatusSchema),
  BulkInquiryController.updateInquiryStatus
);

router.delete(
  '/:id',
  authenticate,
  requireAdminOrStaff,
  BulkInquiryController.deleteInquiry
);

export { router as bulkInquiryRoutes };
