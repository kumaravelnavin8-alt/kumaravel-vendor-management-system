import express from 'express';
import { getAuditLogs } from '../controllers/auditController';
import { auth, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, authorize('Admin'), getAuditLogs);

export default router;
