
import { jest } from '@jest/globals';
import * as aiController from '../../src/controllers/aiController.js';

jest.unstable_mockModule('../../src/services/aiService.js', () => ({
  suggestFruits: jest.fn().mockResolvedValue(['Apple', 'Banana', 'Orange']),
}));

describe('aiController', () => {
  let req, res, next;
  beforeEach(() => {
    req = { body: { prompt: 'Suggest fruits' }, user: { id: 1 }, query: {}, params: {} };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis(), end: jest.fn() };
    next = jest.fn();
  });

  it('getSuggestions returns suggestions', async () => {
    await aiController.getSuggestions(req, res, next);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ suggestions: expect.any(Array) }));
  });

    it('getSuggestions returns 400 if favoriteIds missing', async () => {
      req.body = {};
      await aiController.getSuggestions(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
    });

    it('getSuggestions returns 500 if service throws', async () => {
      // Mock aiService to throw
      jest.unstable_mockModule('../../src/services/aiService.js', () => ({
        suggestFruits: jest.fn(() => { throw new Error('AI error'); })
      }));
      // Re-import controller to use new mock
      const { getSuggestions } = await import('../../src/controllers/aiController.js');
      await getSuggestions(req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
    });
});
