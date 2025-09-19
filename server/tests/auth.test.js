import request from 'supertest';
import app from '../src/app.js';

describe('Auth placeholder (Google requires real token)', () => {
  it('should reject without id_token', async () => {
    const res = await request(app).post('/auth/google').send({});
    expect(res.status).toBe(400);
  });
});
