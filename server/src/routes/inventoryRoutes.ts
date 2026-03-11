import express from 'express';
import { addYarnStock, getYarnInventory, updateYarnStock } from '../controllers/inventoryController';
import { auth, authorize } from '../middleware/auth';
import { auditMiddleware } from '../middleware/logger';

const router = express.Router();

router.use(auth);
router.use(auditMiddleware('Inventory'));

router.post('/', authorize('Admin'), addYarnStock);
router.get('/', getYarnInventory);
router.put('/:id', authorize('Admin'), updateYarnStock);

export default router;
