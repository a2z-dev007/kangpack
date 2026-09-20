import { Router } from 'express';
import { FaqsController } from './faqs.controller';
import { authenticate } from '../../common/middlewares/auth.middleware';
import { requireAdminOrStaff } from '../../common/middlewares/role.middleware';
import { validateSchema, createFaqSchema, updateFaqSchema, reorderFaqsSchema } from './faqs.validation';

const router = Router();

// Public routes
router.get('/', FaqsController.getAllFaqs);

// Admin routes - specific paths MUST come before parameterized /:id route
router.get('/admin/stats', authenticate, requireAdminOrStaff, FaqsController.getFaqStats);
router.get('/admin/all', authenticate, requireAdminOrStaff, FaqsController.getAllFaqsAdmin);
router.post('/reorder', authenticate, requireAdminOrStaff, validateSchema(reorderFaqsSchema), FaqsController.reorderFaqs);

// Specific ID routes
router.get('/:id', FaqsController.getFaqById);
router.post('/', authenticate, requireAdminOrStaff, validateSchema(createFaqSchema), FaqsController.createFaq);
router.put('/:id', authenticate, requireAdminOrStaff, validateSchema(updateFaqSchema), FaqsController.updateFaq);
router.patch('/:id/status', authenticate, requireAdminOrStaff, FaqsController.toggleFaqStatus);
router.delete('/:id', authenticate, requireAdminOrStaff, FaqsController.deleteFaq);

export const faqsRoutes = router;
