import request from 'supertest';
import app from '../src/app.js';
import '../src/models/index.js';
import { resetDb } from './resetDb.js';
import { User } from '../src/models/User.js';
import jwt from 'jsonwebtoken';

let token;

beforeAll(async () => {
  await resetDb();
  const user = await User.create({ googleSub: 'prof-inv', email: 'pi@example.com' });
  token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
});

describe('Profile invalid payloads', () => {
  test('empty body triggers refine error', async () => {
    const res = await request(app).put('/profile').set('Authorization','Bearer '+token).send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation error');
  });

  test('invalid gender', async () => {
    const res = await request(app).put('/profile').set('Authorization','Bearer '+token).send({ gender: 'invalid' });
    expect(res.status).toBe(400);
  });

  test('nickName too long', async () => {
    const res = await request(app).put('/profile').set('Authorization','Bearer '+token).send({ nickName: 'x'.repeat(41) });
    expect(res.status).toBe(400);
  });
});
