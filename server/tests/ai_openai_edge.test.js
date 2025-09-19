import { Fruit } from '../src/models/index.js';
import { suggestFruits, __setOpenAI } from '../src/services/aiService.js';
import { resetDb } from './resetDb.js';

describe('AI OpenAI edge cases', () => {
  beforeAll(async () => {
    process.env.OPENAI_API_KEY = 'x';
    await resetDb();
    await Fruit.bulkCreate([
      { name: 'EdgeA', calories: 10, fat: 1, sugar: 2, carbohydrates: 3, protein: 1 },
      { name: 'EdgeB', calories: 20, fat: 2, sugar: 4, carbohydrates: 6, protein: 2 },
      { name: 'EdgeC', calories: 30, fat: 3, sugar: 6, carbohydrates: 9, protein: 3 }
    ]);
  });

  test('no choices returned yields null explanations', async () => {
    class NoChoicesClient { constructor(){ } chat = { completions: { create: async ()=> ({ choices: [] }) } }; }
    __setOpenAI(NoChoicesClient);
    const res = await suggestFruits(2);
    expect(res).toHaveLength(2);
    expect(res.every(r=> r.explanation === null)).toBe(true);
  });

  test('error thrown during completion logs and still returns results', async () => {
    let sawError = false;
    const origErr = console.error;
    console.error = (...args)=> { sawError = true; origErr(...args); };
    class ThrowClient { constructor(){} chat = { completions: { create: async ()=> { throw new Error('boom'); } } }; }
    __setOpenAI(ThrowClient);
    const res = await suggestFruits(2);
    console.error = origErr;
    expect(res).toHaveLength(2);
    expect(sawError).toBe(true);
    expect(res.every(r=> r.explanation === null)).toBe(true);
  });
});
