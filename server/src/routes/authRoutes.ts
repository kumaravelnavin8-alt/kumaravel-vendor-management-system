import express from 'express';
import { register, login, getMe, updateCredentials } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/credentials', auth, updateCredentials);

export default router;
