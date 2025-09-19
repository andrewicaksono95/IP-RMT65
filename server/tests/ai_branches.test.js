import request from 'supertest';
import app from '../src/app.js';
import '../src/models/index.js';
import { Fruit } from '../src/models/Fruit.js';
import { resetDb } from './resetDb.js';

// We deliberately do NOT set OPENAI_API_KEY so explanation branch is skipped gracefully.

describe('AI service branches', () => {
  test('returns empty array when no fruits', async () => {
    await resetDb();
    const res = await request(app).get('/ai/suggestions');
    expect(res.status).toBe(200);
    expect(res.body.suggestions).toEqual([]);
  });

  test('returns scored suggestions with centroid similarity ordering', async () => {
    await resetDb();
    await Fruit.bulkCreate([
      { name: 'HighCal', calories: 200, sugar: 30, protein: 5 },
      { name: 'MidCal', calories: 100, sugar: 15, protein: 3 },
      { name: 'LowCal', calories: 50, sugar: 5, protein: 1 },
    ]);
    const res = await request(app).get('/ai/suggestions?limit=2');
    expect(res.status).toBe(200);
    const { suggestions } = res.body;
    expect(suggestions.length).toBe(2);
    // Scores should be numeric and ordered descending
    const scores = suggestions.map(s=> s.score);
    expect([...scores].sort((a,b)=> b-a)).toEqual(scores);
    suggestions.forEach(s=> expect(s).toHaveProperty('explanation'));
  });
});
