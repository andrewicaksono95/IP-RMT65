import { Router } from 'express';
import { googleLogin, getGoogleAuthUrl, exchangeGoogleCode } from '../controllers/authController.js';

const router = Router();
router.post('/google', googleLogin); // legacy direct id_token
router.get('/google/url', getGoogleAuthUrl);
router.post('/google/exchange', exchangeGoogleCode);
export default router;
