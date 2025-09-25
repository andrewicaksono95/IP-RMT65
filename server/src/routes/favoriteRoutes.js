import { Router } from 'express';
import { listFavorites, addFavorite, updateFavorite, deleteFavorite } from '../controllers/favoriteController.js';
import { authRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { favoriteCreateSchema, favoriteUpdateSchema } from '../validation/schemas.js';

const router = Router();
router.use(authRequired);
router.get('/', listFavorites);
router.post('/', validate(favoriteCreateSchema), addFavorite);
router.put('/:id', validate(favoriteUpdateSchema), updateFavorite);
router.delete('/:id', deleteFavorite);
export default router;
