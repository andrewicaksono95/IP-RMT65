import { jest } from '@jest/globals';
import { run } from '../src/scripts/seedFruityvice.js';
import { Fruit } from '../src/models/index.js';
import { sequelize } from '../src/config/database.js';
import axios from 'axios';

describe('seedFruityvice run()', () => {
  beforeAll(async () => {
    await sequelize.sync();
  });

  test('upserts fruits from API payload', async () => {
    const spy = jest.spyOn(axios, 'get').mockResolvedValue({ data: [
      { name: 'SeedApple', family: 'Rosaceae', order: 'Rosales', genus: 'Malus', nutritions: { calories: 50, fat: 0.2, sugar: 10, carbohydrates: 14, protein: 0.3 } },
      { name: 'SeedBanana', family: 'Musaceae', order: 'Zingiberales', genus: 'Musa', nutritions: { calories: 80, fat: 0.3, sugar: 12, carbohydrates: 20, protein: 1 } }
    ]});
    await run();
    const a = await Fruit.findOne({ where: { name: 'SeedApple' } });
    const b = await Fruit.findOne({ where: { name: 'SeedBanana' } });
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
    expect(a.calories).toBe(50);
    expect(b.calories).toBe(80);
    spy.mockRestore();
  });
});
