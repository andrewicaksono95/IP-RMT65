import request from 'supertest';
import app from '../src/app.js';

describe('Validation params/query', () => {
  test('invalid uuid param triggers validation 400', async () => {
    const res = await request(app).get('/_test/validate/not-a-uuid');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation error');
  });

  test('valid uuid but bad page query triggers validation 400', async () => {
    const fakeUuid = '123e4567-e89b-12d3-a456-426614174000';
    const res = await request(app).get(`/_test/validate/${fakeUuid}?page=abc`);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation error');
  });
});
