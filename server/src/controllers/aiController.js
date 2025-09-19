import { suggestFruits } from '../services/aiService.js';

export async function getSuggestions(req, res, next) {
  try {
    const limit = req.query.limit ? +req.query.limit : 5;
    const suggestions = await suggestFruits(limit);
    res.json({ suggestions });
  } catch (e) { next(e); }
}
