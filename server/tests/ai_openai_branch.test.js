import request from 'supertest';
import app from '../src/app.js';
import '../src/models/index.js';
import { Fruit } from '../src/models/Fruit.js';
import { resetDb } from './resetDb.js';
import { __setOpenAI } from '../src/services/aiService.js';

class MockOpenAI {
  constructor() {}
  chat = { completions: { create: async () => ({ choices: [ { message: { content: '1. HighCal: energy dense\n2. LowCal: light' } } ] }) } };
}

describe('AI OpenAI explanation branch', () => {
  const OLD_KEY = process.env.OPENAI_API_KEY;
  beforeAll(async ()=> {
    process.env.OPENAI_API_KEY = 'test-key';
    __setOpenAI(MockOpenAI);
  });
  afterAll(()=> { process.env.OPENAI_API_KEY = OLD_KEY; });

  test('returns explanations from mocked OpenAI', async () => {
    await resetDb();
    await Fruit.bulkCreate([
      { name: 'HighCal', calories: 200, sugar: 30, protein: 5 },
      { name: 'LowCal', calories: 50, sugar: 5, protein: 1 }
    ]);
    const res = await request(app).get('/ai/suggestions?limit=2');
    expect(res.status).toBe(200);
    const { suggestions } = res.body;
    expect(suggestions.length).toBe(2);
    expect(suggestions.every(s=> s.explanation)).toBe(true);
  });
});
