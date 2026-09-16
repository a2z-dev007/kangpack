import { Router } from 'express';
import { CategoriesController } from './categories.controller';
import { authenticate, optionalAuth } from '../../common/middlewares/auth.middleware';
import { requireAdminOrStaff } from '../../common/middlewares/role.middleware';

const router = Router();

// Public routes (with optional auth for admin recognition)
router.get('/', optionalAuth, CategoriesController.getCategories);
router.get('/tree', optionalAuth, CategoriesController.getCategoryTree);
router.get('/slug/:slug', optionalAuth, CategoriesController.getCategoryBySlug);
router.get('/:id', optionalAuth, CategoriesController.getCategoryById);

// Admin/Staff routes
router.get('/admin/stats', authenticate, requireAdminOrStaff, CategoriesController.getCategoryStats);
router.post('/', authenticate, requireAdminOrStaff, CategoriesController.createCategory);
router.put('/:id', authenticate, requireAdminOrStaff, CategoriesController.updateCategory);
router.delete('/:id', authenticate, requireAdminOrStaff, CategoriesController.deleteCategory);
router.post('/reorder', authenticate, requireAdminOrStaff, CategoriesController.reorderCategories);

export { router as categoriesRoutes };