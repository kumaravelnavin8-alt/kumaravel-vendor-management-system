import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { getProductionReport, getPaymentReport } from '../controllers/reportController';
import { auth, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/stats', auth, getDashboardStats);
router.get('/production', auth, authorize('Admin'), getProductionReport);
router.get('/payments', auth, authorize('Admin'), getPaymentReport);

export default router;
