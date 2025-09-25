import { jest } from '@jest/globals';

// Mock the models
jest.unstable_mockModule('../../src/models/index.js', () => ({
  Fruit: {
    findByPk: jest.fn(),
  },
}));

// Dynamically import the service and models
const { getFruit } = await import('../../src/services/fruitService.js');
const { Fruit } = await import('../../src/models/index.js');

describe('Fruit Service', () => {
  describe('listFruits', () => {
    let mockResult;
    beforeEach(() => {
      mockResult = { count: 1, rows: [{ id: 1, name: 'Apple' }] };
      Fruit.findAndCountAll = jest.fn().mockResolvedValue(mockResult);
    });

    it('should call findAndCountAll with default params', async () => {
      const { listFruits } = await import('../../src/services/fruitService.js');
      const result = await listFruits({});
      expect(Fruit.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        order: [['name', 'ASC']],
        limit: 20,
        offset: 0
      });
      expect(result).toEqual(mockResult);
    });

    it('should handle search param', async () => {
      const { listFruits } = await import('../../src/services/fruitService.js');
      await listFruits({ search: 'app' });
      expect(Fruit.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ name: expect.any(Object) })
      }));
    });

    it('should handle family param', async () => {
      const { listFruits } = await import('../../src/services/fruitService.js');
      await listFruits({ family: 'Rosaceae' });
      expect(Fruit.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ family: 'Rosaceae' })
      }));
    });

    it('should use valid sort param', async () => {
      const { listFruits } = await import('../../src/services/fruitService.js');
      await listFruits({ sort: 'calories' });
      expect(Fruit.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
        order: [['calories', 'ASC']]
      }));
    });

    it('should fallback to name for invalid sort param', async () => {
      const { listFruits } = await import('../../src/services/fruitService.js');
      await listFruits({ sort: 'invalid' });
      expect(Fruit.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
        order: [['name', 'ASC']]
      }));
    });

    it('should propagate errors from findAndCountAll', async () => {
      const { listFruits } = await import('../../src/services/fruitService.js');
      Fruit.findAndCountAll.mockRejectedValue(new Error('DB Error'));
      await expect(listFruits({})).rejects.toThrow('DB Error');
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFruit', () => {
    it('should return a fruit when found', async () => {
      const mockFruit = { id: 1, name: 'Apple' };
      Fruit.findByPk.mockResolvedValue(mockFruit);

      const fruit = await getFruit(1);

      expect(Fruit.findByPk).toHaveBeenCalledWith(1);
      expect(fruit).toEqual(mockFruit);
    });

    it('should return null if fruit is not found', async () => {
      Fruit.findByPk.mockResolvedValue(null);
      const fruit = await getFruit(999);
      expect(fruit).toBeNull();
    });

    it('should propagate database errors', async () => {
      const dbError = new Error('DB Error');
      Fruit.findByPk.mockRejectedValue(dbError);

      await expect(getFruit(1)).rejects.toThrow('DB Error');
    });

      it('should handle invalid id gracefully', async () => {
        // Simulate invalid id (e.g., undefined/null)
        Fruit.findByPk.mockResolvedValue(null);
        const fruit = await getFruit(undefined);
        expect(fruit).toBeNull();
      });
  });
});
