import request from 'supertest';
import app from '../src/app.js';
import '../src/models/index.js';
import { resetDb } from './resetDb.js';
import { User } from '../src/models/User.js';
import jwt from 'jsonwebtoken';

let validToken;

beforeAll(async () => {
  await resetDb();
  const user = await User.create({ googleSub: 'neg-sub', email: 'neg@example.com' });
  validToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

describe('Auth middleware negatives', () => {
  test('missing Authorization header', async () => {
    const res = await request(app).get('/profile');
    expect(res.status).toBe(401);
  });

  test('malformed Authorization header (no Bearer)', async () => {
    const res = await request(app).get('/profile').set('Authorization', 'Token ' + validToken);
    expect(res.status).toBe(401);
  });

  test('invalid token signature', async () => {
    const bad = validToken.slice(0, -1) + (validToken.slice(-1) === 'a' ? 'b' : 'a');
    const res = await request(app).get('/profile').set('Authorization', 'Bearer ' + bad);
    expect(res.status).toBe(401);
  });

  test('expired token', async () => {
    const expired = jwt.sign({ id: 999, email: 'x@y.com' }, process.env.JWT_SECRET, { expiresIn: -10 });
    const res = await request(app).get('/profile').set('Authorization', 'Bearer ' + expired);
    expect(res.status).toBe(401);
  });
});
