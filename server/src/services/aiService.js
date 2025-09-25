import { Fruit } from '../models/index.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const nutrientFields = ['calories','fat','sugar','carbohydrates','protein'];

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s,v)=>s+v*v,0));
  const magB = Math.sqrt(b.reduce((s,v)=>s+v*v,0));
  if (magA===0||magB===0) return 0;
  return dot/(magA*magB);
}

export async function suggestFruits(favoriteIds = [], limit = 6) {
  console.log('suggestFruits called with favoriteIds:', favoriteIds);
  
  const allFruits = await Fruit.findAll();
  if (!allFruits.length) return [];

  let suggestedFruits = [];
  
  if (favoriteIds.length > 0) {
    // Get favorite fruits details
    const favoriteFruits = await Fruit.findAll({
      where: { id: favoriteIds }
    });
    
    console.log('Found favorite fruits:', favoriteFruits.map(f => f.name));
    
    // Get unique orders and families from favorites
    const favoriteOrders = [...new Set(favoriteFruits.map(f => f.order).filter(Boolean))];
    const favoriteFamilies = [...new Set(favoriteFruits.map(f => f.family).filter(Boolean))];
    
    console.log('Favorite orders:', favoriteOrders);
    console.log('Favorite families:', favoriteFamilies);
    
    // Find fruits from same orders and families, excluding favorites
    const candidateFruits = allFruits.filter(fruit => {
      const isNotFavorite = !favoriteIds.includes(fruit.id);
      const matchesOrder = favoriteOrders.includes(fruit.order);
      const matchesFamily = favoriteFamilies.includes(fruit.family);
      return isNotFavorite && (matchesOrder || matchesFamily);
    });
    
    console.log('Candidate fruits found:', candidateFruits.length);
    
    // Randomize and limit suggestions
    const shuffled = candidateFruits.sort(() => 0.5 - Math.random());
    suggestedFruits = shuffled.slice(0, limit);
  } else {
    // If no favorites, use nutritional similarity approach
    const vectors = allFruits.map(f=> nutrientFields.map(n=> f[n] || 0));
    const centroid = vectors[0].map((_,i)=> vectors.reduce((s,v)=> s+v[i],0)/vectors.length);
    const scored = allFruits.map((f,i)=> ({ fruit: f, score: cosineSimilarity(centroid, vectors[i]) }));
    scored.sort((a,b)=> b.score - a.score);
    suggestedFruits = scored.slice(0, limit).map(s => s.fruit);
  }

  // Generate explanations using Gemini
  let explanations = [];
  if (process.env.GEMINI_API_KEY && suggestedFruits.length > 0) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const names = suggestedFruits.map(f => f.name).join(', ');
      const favoriteNames = favoriteIds.length > 0 ? 
        (await Fruit.findAll({ where: { id: favoriteIds } })).map(f => f.name).join(', ') : 
        'none';
      
      const prompt = `Based on favorite fruits: ${favoriteNames}
      
Suggest why these fruits would be good recommendations: ${names}

For each fruit, provide a brief explanation (one sentence) focusing on:
- Similar botanical family or order  
- Complementary nutritional profile
- Flavor or texture similarities

IMPORTANT RULES:
- Do NOT include the fruit name at the beginning of each explanation
- When mentioning favorite fruits (${favoriteNames}), wrap them with **bold** formatting
- Start directly with the explanation
- Keep explanations concise and informative

Format as numbered list without fruit names:`;

      const result = await model.generateContent(prompt);
      const text = result.response.text() || '';
      let rawExplanations = text.split(/\n\d+\.\s/).map(l => l.trim()).filter(Boolean).slice(1, suggestedFruits.length + 1);
      
      // Clean up any remaining fruit name prefixes and process bold formatting
      explanations = rawExplanations.map((explanation, index) => {
        const fruitName = suggestedFruits[index]?.name;
        // Remove any fruit name prefix patterns
        let cleaned = explanation.replace(new RegExp(`^\\*\\*${fruitName}\\*\\*:?\\s*`, 'i'), '');
        cleaned = cleaned.replace(new RegExp(`^${fruitName}:?\\s*`, 'i'), '');
        cleaned = cleaned.replace(/^\*\*[^*]+\*\*:?\s*/, '');
        
        return cleaned.trim();
      });
      
      console.log('Generated explanations:', explanations);
    } catch (e) {
      console.error('Gemini AI suggestion error:', e.message);
    }
  }

  const result = suggestedFruits.map((fruit, i) => ({
    id: fruit.id,
    name: fruit.name,
    imageUrl: fruit.imageUrl,
    order: fruit.order,
    family: fruit.family,
    genus: fruit.genus,
    calories: fruit.calories,
    reason: explanations[i] || `Nutritionally similar to your favorite fruits`,
    nutritionalHighlight: fruit.calories ? `${fruit.calories} calories` : null
  }));
  
  console.log('Final suggestions result:', result.map(r => r.name));
  return result;
}
