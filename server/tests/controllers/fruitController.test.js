
import { jest } from '@jest/globals';
import * as fruitController from '../../src/controllers/fruitController.js';

jest.unstable_mockModule('../../src/services/fruitService.js', () => ({
  listFruits: jest.fn().mockResolvedValue({
    rows: [
      {
        id: 1,
        name: 'FamFruit',
        family: 'FamX',
        genus: 'Gen',
        order: 'Ord',
        calories: 1,
        sugar: 1,
        protein: 0,
        fat: 0,
        carbohydrates: 1,
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    count: 1,
  }),
  getFruit: jest.fn().mockResolvedValue({
    id: 1,
    name: 'FamFruit',
    family: 'FamX',
    genus: 'Gen',
    order: 'Ord',
    calories: 1,
    sugar: 1,
    protein: 0,
    fat: 0,
    carbohydrates: 1,
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
}));

describe('fruitController', () => {
  let req, res, next;
  beforeEach(() => {
    req = { params: { id: 1 }, query: {}, body: { name: 'Apple' } };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    next = jest.fn();
  });

  it('getFruits returns fruit list', async () => {
    await fruitController.getFruits(req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      rows: expect.any(Array),
      count: expect.any(Number),
    }));
  });

  it('getFruitById returns fruit', async () => {
    await fruitController.getFruitById(req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      name: 'FamFruit',
    }));
  });
});
