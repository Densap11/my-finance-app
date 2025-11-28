import { Router } from 'express';
import { 
  createTransaction, 
  getTransactions, 
  getTransaction, 
  updateTransaction, 
  deleteTransaction 
} from '../controllers/transactionController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware); // Все роуты требуют аутентификации

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/:id', getTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;