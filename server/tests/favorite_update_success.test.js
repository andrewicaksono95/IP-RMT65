import request from 'supertest';
import app from '../src/app.js';
import '../src/models/index.js';
import { resetDb } from './resetDb.js';
import { User } from '../src/models/User.js';
import { Fruit } from '../src/models/Fruit.js';
import jwt from 'jsonwebtoken';

let token; let favId; let fruitId;

beforeAll(async () => {
  await resetDb();
  const user = await User.create({ googleSub: 'fav-upd2', email: 'fus@example.com' });
  token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
  const fruit = await Fruit.create({ name: 'Mango', calories: 99 });
  fruitId = fruit.id;
  const fav = await request(app).post('/favorites').set('Authorization','Bearer '+token).send({ fruitId, note: 'orig' });
  favId = fav.body.id;
});

describe('Favorite update success path', () => {
  test('updates note successfully', async () => {
    const res = await request(app).put('/favorites/'+favId).set('Authorization','Bearer '+token).send({ note: 'updated note' });
    expect(res.status).toBe(200);
    expect(res.body.note).toBe('updated note');
  });
});
