import request from 'supertest';
import app from '../src/app.js';
import '../src/models/index.js';
import { resetDb } from './resetDb.js';
describe('Controller error path', () => {
  test('fruit list controller propagates forced 500', async () => {
    await resetDb();
    const res = await request(app).get('/fruits?forceError=1');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Forced error');
  });
});
