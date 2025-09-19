import request from 'supertest';
import app from '../src/app.js';
import '../src/models/index.js';
import { Fruit } from '../src/models/Fruit.js';
import { User } from '../src/models/User.js';
import { resetDb } from './resetDb.js';
import jwt from 'jsonwebtoken';

const token = jwt.sign({ id:1, email:'t@e.com' }, process.env.JWT_SECRET);

describe('Favorites', () => {
  beforeAll(async ()=> {
    await resetDb();
    await User.create({ id:1, googleSub:'sub1', email:'t@e.com' });
    await Fruit.create({ id: 10, name: 'Pear', calories: 40 });
  });
  it('requires auth', async () => {
    const res = await request(app).get('/favorites');
    expect(res.status).toBe(401);
  });
  it('adds favorite', async () => {
    const res = await request(app).post('/favorites').set('Authorization','Bearer '+token).send({ fruitId: 10 });
    expect(res.status).toBe(201);
  });
});
