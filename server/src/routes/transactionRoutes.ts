import express from 'express';
import { createTransaction, getTransactions } from '../controllers/transactionController';
import { auth, authorize } from '../middleware/auth';
import { auditMiddleware } from '../middleware/logger';

const router = express.Router();

router.use(auth);
router.use(auditMiddleware('Transaction'));

router.post('/', authorize('Admin'), createTransaction);
router.get('/', getTransactions);

export default router;
