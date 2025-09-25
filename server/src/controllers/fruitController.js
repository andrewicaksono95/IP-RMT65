import { listFruits, getFruit } from '../services/fruitService.js';

export async function getFruits(req, res, next) {
  try {
    const { search, sort, order, family, limit, offset, forceError } = req.query;
    if (forceError) throw new Error('Forced error');
    const data = await listFruits({ search, sort, order, family, limit: +limit || 20, offset: +offset || 0 });
    res.json(data);
  } catch (e) { next(e); }
}

export async function getFruitById(req, res, next) {
  try {
    const fruit = await getFruit(req.params.id);
    if (!fruit) return res.status(404).json({ message: 'Not found' });
    res.json(fruit);
  } catch (e) { next(e); }
}
