
import { jest } from '@jest/globals';
let favoriteController;

jest.unstable_mockModule('../../src/models/index.js', () => {
  const Favorite = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };
  return {
    Favorite,
    Fruit: {
      findByPk: jest.fn().mockResolvedValue({ id: 1, name: 'Apple', toJSON: jest.fn().mockReturnValue({ id: 1, name: 'Apple' }) }),
    },
  };
});

describe('favoriteController', () => {
  let req, res, next, Favorite;
  beforeEach(async () => {
    req = { user: { id: 1 }, body: { fruitId: 1, note: 'Yum' }, params: { id: 1 }, query: {} };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis(), end: jest.fn() };
    next = jest.fn();
    favoriteController = await import('../../src/controllers/favoriteController.js');
    ({ Favorite } = await import('../../src/models/index.js'));
  // Reassign all Favorite methods to jest.fn()
  Favorite.findAll = jest.fn();
  Favorite.findOne = jest.fn();
  Favorite.create = jest.fn();
  });

  it('listFavorites returns favorites', async () => {
    Favorite.findAll.mockResolvedValueOnce([
      { id: 1, fruitId: 1, note: 'Yum', userId: 1 }
    ]);
  await favoriteController.listFavorites(req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ id: 1, fruitId: 1 })
    ]));
  });

  it('listFavorites calls next on error', async () => {
    Favorite.findAll.mockImplementationOnce(async () => { throw new Error('DB error'); });
  await favoriteController.listFavorites(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('addFavorite returns new favorite', async () => {
    Favorite.findOne.mockResolvedValueOnce(null);
    Favorite.create.mockResolvedValueOnce({ id: 2, fruitId: 2, note: 'Yum', userId: 1 });
  await favoriteController.addFavorite(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 2, fruitId: 2 }));
  });

  it('addFavorite returns 409 if already favorited', async () => {
    Favorite.findOne.mockResolvedValueOnce({ id: 1, fruitId: 1, userId: 1 });
  await favoriteController.addFavorite(req, res, next);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Already favorited' }));
  });

  it('addFavorite calls next on error', async () => {
    Favorite.findOne.mockImplementationOnce(async () => { throw new Error('DB error'); });
  await favoriteController.addFavorite(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('updateFavorite returns updated favorite', async () => {
    Favorite.findOne.mockResolvedValueOnce({ id: 1, fruitId: 1, userId: 1, note: 'Old', save: jest.fn().mockResolvedValue() });
    req.body.note = 'Updated';
  await favoriteController.updateFavorite(req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1, fruitId: 1, userId: 1, note: 'Updated' }));
  });

  it('updateFavorite returns 404 if not found', async () => {
    Favorite.findOne.mockResolvedValueOnce(null);
  await favoriteController.updateFavorite(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not found' }));
  });

  it('updateFavorite calls next on error', async () => {
    Favorite.findOne.mockImplementationOnce(async () => { throw new Error('DB error'); });
  await favoriteController.updateFavorite(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('deleteFavorite returns 204 on success', async () => {
    Favorite.findOne.mockResolvedValueOnce({ id: 1, fruitId: 1, userId: 1, destroy: jest.fn().mockResolvedValue() });
  await favoriteController.deleteFavorite(req, res, next);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  it('deleteFavorite returns 404 if not found', async () => {
    Favorite.findOne.mockResolvedValueOnce(null);
  await favoriteController.deleteFavorite(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not found' }));
  });

  it('deleteFavorite calls next on error', async () => {
    Favorite.findOne.mockImplementationOnce(async () => { throw new Error('DB error'); });
  await favoriteController.deleteFavorite(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
