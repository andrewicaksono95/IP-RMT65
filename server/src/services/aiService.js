import { Fruit } from '../models/index.js';
import OpenAI from 'openai';

const nutrientFields = ['calories','fat','sugar','carbohydrates','protein'];
let OpenAIClass = OpenAI;
export function __setOpenAI(cls){ OpenAIClass = cls; }

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s,v)=>s+v*v,0));
  const magB = Math.sqrt(b.reduce((s,v)=>s+v*v,0));
  if (magA===0||magB===0) return 0;
  return dot/(magA*magB);
}

export async function suggestFruits(limit = 5) {
  const fruits = await Fruit.findAll();
  if (!fruits.length) return [];
  const vectors = fruits.map(f=> nutrientFields.map(n=> f[n] || 0));
  const centroid = vectors[0].map((_,i)=> vectors.reduce((s,v)=> s+v[i],0)/vectors.length);
  const scored = fruits.map((f,i)=> ({ fruit: f, score: cosineSimilarity(centroid, vectors[i]) }));
  scored.sort((a,b)=> b.score - a.score);
  const top = scored.slice(0, limit).map(s=> ({ id: s.fruit.id, name: s.fruit.name, score: +s.score.toFixed(4) }));

  let explanations = [];
  if (process.env.OPENAI_API_KEY) {
  const client = new OpenAIClass({ apiKey: process.env.OPENAI_API_KEY });
    const names = top.map(t=> t.name).join(', ');
    const prompt = `Explain briefly (one sentence each) why these fruits are nutritionally notable: ${names}.`;
    try {
      const resp = await client.chat.completions.create({
        model: 'gpt-4-1106-nano',
        messages: [ { role: 'user', content: prompt } ],
        max_tokens: 150,
        temperature: 0.7
      });
      const text = resp.choices?.[0]?.message?.content || '';
      explanations = text.split(/\n|\d+\.\s/).map(l=> l.trim()).filter(Boolean).slice(0, top.length);
    } catch (e) {
      console.error('AI suggestion error', e.message);
    }
  }
  return top.map((t,i)=> ({ ...t, explanation: explanations[i] || null }));
}
