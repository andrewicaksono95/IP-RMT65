import request from 'supertest';
import app from '../src/app.js';

// Simulate google token failure by sending no credential (controller should 400/401)

describe('Auth google failure path', () => {
  test('missing credential returns 400', async () => {
    const res = await request(app).post('/auth/google').send({});
    expect([400,401]).toContain(res.status);
  });
});
