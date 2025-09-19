import request from 'supertest';
import app from '../src/app.js';
import '../src/models/index.js';
import { resetDb } from './resetDb.js';
import { User } from '../src/models/User.js';
import { Fruit } from '../src/models/Fruit.js';
import jwt from 'jsonwebtoken';

let token;
let fruitId;
let otherUserToken;
let favoriteId;

beforeAll(async () => {
  await resetDb();
  const user = await User.create({ googleSub: 'fav-neg-1', email: 'one@example.com' });
  token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
  const other = await User.create({ googleSub: 'fav-neg-2', email: 'two@example.com' });
  otherUserToken = jwt.sign({ id: other.id, email: other.email }, process.env.JWT_SECRET);
  const fruit = await Fruit.create({ name: 'Pear', calories: 57 });
  fruitId = fruit.id;
});

describe('Favorites negative flows', () => {
  test('duplicate favorite returns 409', async () => {
    const first = await request(app).post('/favorites').set('Authorization','Bearer '+token).send({ fruitId });
    expect(first.status).toBe(201);
    favoriteId = first.body.id;
    const dup = await request(app).post('/favorites').set('Authorization','Bearer '+token).send({ fruitId });
    expect(dup.status).toBe(409);
  });

  test('delete non-existent favorite returns 404', async () => {
    const res = await request(app).delete('/favorites/99999').set('Authorization','Bearer '+token);
    expect(res.status).toBe(404);
  });

  test('update favorite not owned returns 404 (scoped find)', async () => {
    const res = await request(app).put('/favorites/'+favoriteId).set('Authorization','Bearer '+otherUserToken).send({ note: 'hack' });
    expect(res.status).toBe(404);
  });
});
