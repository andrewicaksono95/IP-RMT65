import { Router } from 'express';
import { getFruits, getFruitById } from '../controllers/fruitController.js';

const router = Router();
router.get('/', getFruits);
router.get('/:id', getFruitById);
export default router;
