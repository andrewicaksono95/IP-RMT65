import { Favorite, Fruit } from '../models/index.js';

export async function listFavorites(req, res, next) {
  try {
    const favs = await Favorite.findAll({ where: { userId: req.user.id }, include: [Fruit] });
    res.json(favs);
  } catch (e) { next(e); }
}
export async function addFavorite(req, res, next) {
  try {
    const { fruitId, note } = req.body;
    const existing = await Favorite.findOne({ where: { userId: req.user.id, fruitId } });
    if (existing) return res.status(409).json({ message: 'Already favorited' });
    const fav = await Favorite.create({ userId: req.user.id, fruitId, note });
    res.status(201).json(fav);
  } catch (e) { next(e); }
}
export async function updateFavorite(req, res, next) {
  try {
    const { note } = req.body;
    const fav = await Favorite.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!fav) return res.status(404).json({ message: 'Not found' });
    fav.note = note;
    await fav.save();
    res.json(fav);
  } catch (e) { next(e); }
}
export async function deleteFavorite(req, res, next) {
  try {
    const fav = await Favorite.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!fav) return res.status(404).json({ message: 'Not found' });
    await fav.destroy();
    res.status(204).end();
  } catch (e) { next(e); }
}
