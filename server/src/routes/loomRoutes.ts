import express from 'express';
import { createLoom, getLooms, updateLoom } from '../controllers/loomController';
import { auth, authorize } from '../middleware/auth';
import { auditMiddleware } from '../middleware/logger';

const router = express.Router();

router.use(auth);
router.use(auditMiddleware('Loom'));

router.post('/', authorize('Admin'), createLoom);
router.get('/', getLooms);
router.put('/:id', authorize('Admin'), updateLoom);

export default router;
