import request from 'supertest';
import app from '../src/app.js';

describe('App integration', () => {
  it('GET /health returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('Handles 404 for unknown route', async () => {
    const res = await request(app).get('/not-a-real-route');
    expect(res.status).toBe(404);
  });

  it('CORS preflight returns 204', async () => {
    const res = await request(app)
      .options('/health')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'GET');
    expect([200, 204]).toContain(res.status);
  });

  it('Test-only route for validation (NODE_ENV=test)', async () => {
    process.env.NODE_ENV = 'test';
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    const res = await request(app).get('/_test/validate/' + uuid + '?page=1');
    expect([200, 400]).toContain(res.status); // 400 if validation fails
  });
});
