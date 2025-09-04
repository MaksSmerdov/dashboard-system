import express from 'express';
import { register, login, getMe, refreshToken } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.post('/refresh-token', refreshToken);

export default router;