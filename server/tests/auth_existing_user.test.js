import request from 'supertest';
import app from '../src/app.js';
import { User } from '../src/models/index.js';
import { resetDb } from './resetDb.js';
import { __setOAuthClient } from '../src/controllers/authController.js';

describe('Auth existing user branch', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
    await resetDb();
    // First, create user manually matching payload
    await User.create({ googleSub: 'dupesub', email: 'dup@example.com', fullName: 'Dup User' });
    class FakeClient { async verifyIdToken(){ return { getPayload(){ return { sub:'dupesub', email:'dup@example.com', name:'Dup User' }; } }; } }
    __setOAuthClient(new FakeClient());
  });

  test('login returns existing user without creating duplicate', async () => {
    const before = await User.count();
    const res = await request(app).post('/auth/google').send({ id_token: 'whatever' });
    expect(res.status).toBe(200);
    const after = await User.count();
    expect(after).toBe(before); // no new user created
  });
});
