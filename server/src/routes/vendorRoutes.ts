import express from 'express';
import { createVendor, getVendors, updateVendor, deleteVendor } from '../controllers/vendorController';
import { auth, authorize } from '../middleware/auth';
import { auditMiddleware } from '../middleware/logger';

const router = express.Router();

router.use(auth);
router.use(auditMiddleware('Vendor'));

router.post('/', authorize('Admin'), createVendor);
router.get('/', getVendors);
router.put('/:id', authorize('Admin'), updateVendor);
router.delete('/:id', authorize('Admin'), deleteVendor);

export default router;
