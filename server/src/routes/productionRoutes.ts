import express from 'express';
import { addProduction, getProductionHistory, getDailyProduction } from '../controllers/productionController';
import { auth } from '../middleware/auth';
import { auditMiddleware } from '../middleware/logger';

const router = express.Router();

router.use(auth);
router.use(auditMiddleware('Production'));

router.post('/', addProduction);
router.get('/history', getProductionHistory);
router.get('/daily', getDailyProduction);

export default router;
