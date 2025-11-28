import { Router } from 'express';
import { getCategories, getCategoriesByType } from '../controllers/categoryController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getCategories);
router.get('/:type', getCategoriesByType);

export default router;