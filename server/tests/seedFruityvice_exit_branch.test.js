import { jest } from '@jest/globals';
import { run } from '../src/scripts/seedFruityvice.js';
import axios from 'axios';
import { sequelize } from '../src/config/database.js';

describe('seedFruityvice exit branch', () => {
  beforeAll(async () => {
    await sequelize.sync();
  });

  test('invokes process.exit when exit flag true', async () => {
    const origExit = process.exit;
    const spyExit = jest.fn();
    // @ts-ignore
    process.exit = spyExit;
    const getSpy = jest.spyOn(axios, 'get').mockResolvedValue({ data: [] });
    await run({ exit: true });
    expect(spyExit).toHaveBeenCalledWith(0);
    getSpy.mockRestore();
    process.exit = origExit;
  });
});
