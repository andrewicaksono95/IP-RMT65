import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { authRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { profileUpdateSchema } from '../validation/schemas.js';

const router = Router();
router.use(authRequired);
router.get('/', getProfile);
router.put('/', validate(profileUpdateSchema), updateProfile);
export default router;
