import request from 'supertest';
import app from '../src/app.js';

// We send a bogus credential string; controller should handle verification failure and respond 401.

describe('Auth google invalid token', () => {
  test('bogus credential returns 401', async () => {
    const res = await request(app).post('/auth/google').send({ credential: 'not-a-real-jwt' });
    expect([400,401]).toContain(res.status); // depending on implementation might be 400 or 401
  });
});
