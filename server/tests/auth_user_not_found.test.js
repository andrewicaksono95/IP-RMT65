import request from 'supertest';
import { User } from '../src/models/index.js';
import { resetDb } from './resetDb.js';
import app from '../src/app.js';
import { __setOAuthClient } from '../src/controllers/authController.js';

describe('Auth google user creation branch', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
    await resetDb();
    class FakeClient { async verifyIdToken(){ return { getPayload(){ return { sub:'newsub123', email:'newuser@example.com', name:'New User' }; } }; } }
    __setOAuthClient(new FakeClient());
  });
  test('creates user when not found', async () => {
    const res = await request(app).post('/auth/google').send({ id_token: 'anytokenvalue' });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('newuser@example.com');
    const user = await User.findOne({ where: { googleSub: 'newsub123' } });
    expect(user).toBeTruthy();
  });
});
