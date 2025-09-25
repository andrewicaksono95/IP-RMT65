import { suggestFruits } from '../services/aiService.js';

export async function getSuggestions(req, res, next) {
  try {
    const limit = req.query.limit ? +req.query.limit : 6;
    const favoriteIds = req.query.favoriteIds ? 
      req.query.favoriteIds.split(',').map(id => parseInt(id, 10)) : 
      [];
    
    console.log('AI Controller - favoriteIds:', favoriteIds, 'limit:', limit);
    const suggestions = await suggestFruits(favoriteIds, limit);
    res.json({ suggestions });
  } catch (e) { next(e); }
}
