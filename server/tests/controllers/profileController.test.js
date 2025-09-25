
import { jest } from '@jest/globals';

jest.unstable_mockModule('../../src/models/User.js', () => ({
  User: {
    findByPk: jest.fn(),
  },
}));

describe('profileController', () => {
  let req, res, next, User, profileController;
  beforeEach(async () => {
    req = { user: { id: 1 }, body: { fullName: 'Test', nickName: 'Nick', dateOfBirth: '2000-01-01', gender: 'male' }, query: {}, params: {} };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis(), end: jest.fn() };
    next = jest.fn();
    ({ User } = await import('../../src/models/User.js'));
    profileController = await import('../../src/controllers/profileController.js');
    User.findByPk = jest.fn();
    jest.clearAllMocks();
  });

  it('getProfile returns user', async () => {
    User.findByPk.mockResolvedValueOnce({
      id: 1,
      email: 'test@example.com',
      fullName: 'Test',
      nickName: 'Nick',
      dateOfBirth: '2000-01-01',
      gender: 'male',
      save: jest.fn().mockResolvedValue()
    });
    await profileController.getProfile(req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      email: 'test@example.com',
      fullName: 'Test',
      nickName: 'Nick',
      dateOfBirth: '2000-01-01',
      gender: 'male'
    }));
  });

  it('getProfile calls next on error', async () => {
    User.findByPk.mockImplementationOnce(async () => { throw new Error('DB error'); });
    await profileController.getProfile(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('updateProfile returns updated user', async () => {
    User.findByPk.mockResolvedValueOnce({
      id: 1,
      email: 'test@example.com',
      fullName: 'Test',
      nickName: 'Nick',
      dateOfBirth: '2000-01-01',
      gender: 'male',
      save: jest.fn().mockResolvedValue()
    });
    await profileController.updateProfile(req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      email: 'test@example.com',
      fullName: 'Test',
      nickName: 'Nick',
      dateOfBirth: '2000-01-01',
      gender: 'male'
    }));
  });

  it('updateProfile calls next on error', async () => {
    User.findByPk.mockImplementationOnce(async () => { throw new Error('DB error'); });
    await profileController.updateProfile(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
