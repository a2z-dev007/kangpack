import { Router } from 'express';
import { TestimonialsController } from './testimonials.controller';
import { authenticate } from '../../common/middlewares/auth.middleware';
import { requireAdminOrStaff } from '../../common/middlewares/role.middleware';
import {
  validateSchema,
  createTestimonialSchema,
  updateTestimonialSchema,
  reorderTestimonialsSchema,
} from './testimonials.validation';

const router = Router();

// Public routes
router.get('/', TestimonialsController.getAllTestimonials);

// Admin routes - specific paths MUST come before parameterized /:id route
router.get('/admin/stats', authenticate, requireAdminOrStaff, TestimonialsController.getTestimonialStats);
router.get('/admin/all', authenticate, requireAdminOrStaff, TestimonialsController.getAllTestimonialsAdmin);
router.post('/reorder', authenticate, requireAdminOrStaff, validateSchema(reorderTestimonialsSchema), TestimonialsController.reorderTestimonials);

// Specific ID routes
router.get('/:id', TestimonialsController.getTestimonialById);
router.post('/', authenticate, requireAdminOrStaff, validateSchema(createTestimonialSchema), TestimonialsController.createTestimonial);
router.put('/:id', authenticate, requireAdminOrStaff, validateSchema(updateTestimonialSchema), TestimonialsController.updateTestimonial);
router.patch('/:id/status', authenticate, requireAdminOrStaff, TestimonialsController.toggleTestimonialStatus);
router.delete('/:id', authenticate, requireAdminOrStaff, TestimonialsController.deleteTestimonial);

export const testimonialsRoutes = router;
