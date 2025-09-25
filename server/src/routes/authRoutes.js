import { Router } from 'express';
import { googleLogin, getGoogleAuthUrl, exchangeGoogleCode, verifyToken } from '../controllers/authController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.post('/google', googleLogin); // legacy direct id_token
router.get('/google/url', getGoogleAuthUrl);
router.post('/google/exchange', exchangeGoogleCode);
router.get('/verify', authRequired, verifyToken);
export default router;
