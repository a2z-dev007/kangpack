import { Router } from 'express';
import { ContactController } from './contact.controller';
import { validateSchema, contactSchema } from './contact.validation';
import { generalRateLimit } from '../../common/middlewares/rateLimit.middleware';
import { authenticate } from '../../common/middlewares/auth.middleware';
import { requireAdminOrStaff } from '../../common/middlewares/role.middleware';

const router = Router();

// Public submission route
router.post(
  '/',
  generalRateLimit,
  validateSchema(contactSchema),
  ContactController.submitContactForm
);

// Admin / Staff routes
router.get(
  '/stats',
  authenticate,
  requireAdminOrStaff,
  ContactController.getContactStats
);

router.get(
  '/',
  authenticate,
  requireAdminOrStaff,
  ContactController.getAllContacts
);

router.get(
  '/:id',
  authenticate,
  requireAdminOrStaff,
  ContactController.getContactById
);

router.patch(
  '/:id',
  authenticate,
  requireAdminOrStaff,
  ContactController.updateContactStatus
);

router.delete(
  '/:id',
  authenticate,
  requireAdminOrStaff,
  ContactController.deleteContact
);

export { router as contactRoutes };
