import { jest } from '@jest/globals';

// Mock external dependencies
jest.unstable_mockModule('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation((apiKey) => ({
    getGenerativeModel: jest.fn((opts) => {
      const generateContent = jest.fn();
      generateContent.mockResolvedValue = jest.fn();
      generateContent.mockRejectedValue = jest.fn();
      return {
        generateContent,
        model: (opts && opts.model) ? opts.model : 'mock-model',
      };
    }),
  })),
}));

jest.unstable_mockModule('../../src/models/index.js', () => ({
  Fruit: {
    findAll: jest.fn(),
  },
  Favorite: {
    findAll: jest.fn(),
  },
}));

describe('AI Service', () => {
  let genAI, model, Fruit, Favorite;
  beforeEach(async () => {
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-key';
    const googleModule = await import('@google/generative-ai');
  genAI = new googleModule.GoogleGenerativeAI();
  model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    ({ Fruit, Favorite } = await import('../../src/models/index.js'));
    // Reset all model methods to jest.fn()
  model.generateContent = jest.fn();
    Fruit.findAll = jest.fn();
    Favorite.findAll = jest.fn();
  });

  describe('suggestFruits', () => {
  it('should return nutritionally similar fruits when no favorites are provided', async () => {
    // Mock fruits with different nutritional profiles
    const mockFruits = [
      { id: 1, name: 'Apple', family: 'Rosaceae', genus: 'Malus', order: 'Rosales', calories: 52, fat: 0.2, sugar: 10, carbohydrates: 14, protein: 0.3 },
      { id: 2, name: 'Banana', family: 'Musaceae', genus: 'Musa', order: 'Zingiberales', calories: 89, fat: 0.3, sugar: 12, carbohydrates: 23, protein: 1.1 },
      { id: 3, name: 'Cherry', family: 'Rosaceae', genus: 'Prunus', order: 'Rosales', calories: 50, fat: 0.2, sugar: 8, carbohydrates: 12, protein: 1.0 },
    ];
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const { Fruit } = await import('../../src/models/index.js');
    const { suggestFruits } = await import('../../src/services/aiService.js');
    const genAI = new GoogleGenerativeAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    Fruit.findAll = jest.fn(() => Promise.resolve(mockFruits));
    model.generateContent = jest.fn(); // Should not be called in this branch

    const suggestions = await suggestFruits([], 2);
    expect(suggestions.length).toBe(2);
    expect(suggestions[0]).toHaveProperty('name');
    expect(suggestions[0]).toHaveProperty('reason');
    expect(suggestions[0].reason).toMatch(/Nutritionally similar/);
    expect(model.generateContent).not.toHaveBeenCalled();
  });
    it('should handle error thrown by GoogleGenerativeAI', async () => {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const { Fruit } = await import('../../src/models/index.js');
      const { suggestFruits } = await import('../../src/services/aiService.js');
      const genAI = new GoogleGenerativeAI();
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      Fruit.findAll = jest.fn(() => Promise.resolve([
        { id: 1, name: 'Apple', family: 'Rosaceae', genus: 'Malus', order: 'Rosales', calories: 52 },
        { id: 2, name: 'Banana', family: 'Musaceae', genus: 'Musa', order: 'Zingiberales', calories: 89 }
      ]));
      model.generateContent = jest.fn(() => { throw new Error('Gemini error'); });
      // Should not throw, should return empty array or error handled
      const suggestions = await suggestFruits([1,2], 2);
      expect(Array.isArray(suggestions)).toBe(true);
    });
  it('should return AI-suggested fruits based on favorites', async () => {
  const favoriteIds = [1, 2];
   // Provide mock fruits so candidateFruits is not empty and triggers AI branch
  const mockFruits = [
    { id: 1, name: 'Apple', family: 'Rosaceae', genus: 'Malus', order: 'Rosales', calories: 52, imageUrl: '', sugar: 10, fat: 0.2, carbohydrates: 14, protein: 0.3 },
    { id: 2, name: 'Banana', family: 'Musaceae', genus: 'Musa', order: 'Zingiberales', calories: 89, imageUrl: '', sugar: 12, fat: 0.3, carbohydrates: 23, protein: 1.1 },
    { id: 3, name: 'Cherry', family: 'Rosaceae', genus: 'Prunus', order: 'Rosales', calories: 50, imageUrl: '', sugar: 8, fat: 0.2, carbohydrates: 12, protein: 1.0 },
    { id: 4, name: 'Date', family: 'Rosaceae', genus: 'Phoenix', order: 'Rosales', calories: 277, imageUrl: '', sugar: 63, fat: 0.2, carbohydrates: 75, protein: 1.8 },
  ];
  const aiResponse = {
    response: {
      text: () => '["Cherry", "Date"]',
    },
  };

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const { Fruit, Favorite } = await import('../../src/models/index.js');
  const { suggestFruits } = await import('../../src/services/aiService.js');
  const genAI = new GoogleGenerativeAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  Fruit.findAll = jest.fn((args) => {
    if (!args) return Promise.resolve(mockFruits);
    if (args && args.where && args.where.id) {
      return Promise.resolve(mockFruits.filter(f => args.where.id.includes(f.id)));
    }
    return Promise.resolve([]);
  });
  Favorite.findAll = jest.fn((args) => {
    if (!args) return Promise.resolve([]);
    if (args.where && args.where.userId && args.attributes && args.attributes.includes('fruitId')) {
      return Promise.resolve([{ fruitId: 1 }, { fruitId: 2 }]);
    }
    return Promise.resolve([]);
  });
  const mockGenerateContent = jest.fn().mockResolvedValue(aiResponse);
  model.generateContent = mockGenerateContent;
   const suggestions = await suggestFruits(favoriteIds, 2);

  expect(Favorite.findAll).not.toHaveBeenCalled();
  expect(Fruit.findAll).toHaveBeenCalled();
  expect(Fruit.findAll).toHaveBeenCalled();
  expect(suggestions.length).toBe(2);
  expect(suggestions[0]).toEqual(expect.objectContaining({ name: 'Cherry', reason: expect.any(String) }));
  expect(suggestions[1]).toEqual(expect.objectContaining({ name: 'Date', reason: expect.any(String) }));
});

it('should handle cases with no explicit favorite IDs', async () => {
  const mockFavorites = [{ fruitId: 1 }];
  // Ensure both fruits have calories so nutritional similarity branch is triggered
  const mockFruits = [
    { id: 1, name: 'Apple', family: 'Rosaceae', genus: 'Malus', order: 'Rosales', calories: 52, fat: 0.2, sugar: 10, carbohydrates: 14, protein: 0.3 },
    { id: 2, name: 'Blueberry', family: 'Ericaceae', genus: 'Vaccinium', order: 'Ericales', calories: 57, fat: 0.1, sugar: 9, carbohydrates: 14, protein: 0.7 },
  ];
  const aiResponse = {
    response: {
      text: () => '["Blueberry"]',
    },
  };

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const { Fruit, Favorite } = await import('../../src/models/index.js');
  const { suggestFruits } = await import('../../src/services/aiService.js');
  const genAI = new GoogleGenerativeAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  Favorite.findAll = jest.fn((args) => {
    if (!args) return Promise.resolve([]);
    if (args.where && args.where.userId && args.attributes && args.attributes.includes('fruitId')) {
      return Promise.resolve(mockFavorites);
    }
    return Promise.resolve([]);
  });
  Fruit.findAll = jest.fn((args) => {
    if (!args) return Promise.resolve(mockFruits);
    if (args && args.where && args.where.id) {
      return Promise.resolve(mockFruits.filter(f => args.where.id.includes(f.id)));
    }
    return Promise.resolve([]);
  });
  const mockGenerateContent = jest.fn().mockResolvedValue(aiResponse);
  model.generateContent = mockGenerateContent;
  const suggestions = await suggestFruits(1, [], 3);

  expect(suggestions).toEqual([]);
});

  it('should return an empty array if AI gives an invalid response', async () => {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const { Fruit, Favorite } = await import('../../src/models/index.js');
  const { suggestFruits } = await import('../../src/services/aiService.js');
  const genAI = new GoogleGenerativeAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const mockFruits = [{ dataValues: { name: 'Apple' } }];
  Favorite.findAll.mockResolvedValue([]);
  Fruit.findAll.mockResolvedValue(mockFruits);
  model.generateContent = jest.fn().mockResolvedValue({
    response: { text: () => 'invalid-json' },
  });

  const suggestions = await suggestFruits(1, [], 3);
  expect(suggestions).toEqual([]);
});

it('should handle errors during AI content generation', async () => {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const { Fruit, Favorite } = await import('../../src/models/index.js');
  const { suggestFruits } = await import('../../src/services/aiService.js');
  const genAI = new GoogleGenerativeAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const mockFruits = [{ dataValues: { name: 'Apple' } }];
  Favorite.findAll.mockResolvedValue([]);
  Fruit.findAll.mockResolvedValue(mockFruits);
  model.generateContent = jest.fn().mockRejectedValue(new Error('AI error'));

  const suggestions = await suggestFruits(1, [], 3);
  expect(suggestions).toEqual([]);
});

it('should return empty array when no fruits are in database', async () => {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const { Fruit, Favorite } = await import('../../src/models/index.js');
  const { suggestFruits } = await import('../../src/services/aiService.js');
  const genAI = new GoogleGenerativeAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  Favorite.findAll.mockResolvedValue([]);
  Fruit.findAll.mockResolvedValue([]);

  const suggestions = await suggestFruits(1, [], 3);
  expect(suggestions).toEqual([]);
});
  });
});
