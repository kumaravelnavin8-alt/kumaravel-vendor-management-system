import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController';
import { auth, authorize } from '../middleware/auth';
import { auditMiddleware } from '../middleware/logger';

const router = express.Router();

router.use(auth);
router.use(auditMiddleware('Order'));

router.post('/', authorize('Admin'), createOrder);
router.get('/', getOrders);
router.patch('/:id/status', authorize('Admin'), updateOrderStatus);

export default router;
