import request from 'supertest';
import app from '../src/app.js';
import { sequelize } from '../src/config/database.js';
import '../src/models/index.js';
import { Fruit } from '../src/models/Fruit.js';

describe('AI suggestions', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await Fruit.bulkCreate([
      { name: 'Apple', calories: 52, sugar: 10, protein: 0.3 },
      { name: 'Banana', calories: 96, sugar: 12, protein: 1.3 }
    ]);
  });
  it('returns suggestions (may have null explanations)', async () => {
    const res = await request(app).get('/ai/suggestions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.suggestions)).toBe(true);
    expect(res.body.suggestions.length).toBeGreaterThan(0);
  });
});
