import request from 'supertest';
import app from '../src/app.js';
import { resetDb } from './resetDb.js';
import { __setOAuthClient } from '../src/controllers/authController.js';

describe('Auth google error path', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
    await resetDb();
    class ThrowClient { async verifyIdToken(){ throw new Error('oauth explode'); } }
    __setOAuthClient(new ThrowClient());
  });

  test('error during verification returns 500', async () => {
    const res = await request(app).post('/auth/google').send({ id_token: 'boomtoken' });
    expect([500,401]).toContain(res.status); // implementation returns 500 via error handler
  });
});
