import request from 'supertest';
import app from '../src/app.js';
import { User, Fruit } from '../src/models/index.js';
import jwt from 'jsonwebtoken';
import { resetDb } from './resetDb.js';

function tokenFor(user){
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

describe('Favorite update 404', () => {
  let user;
  beforeAll(async () => {
  await resetDb();
    user = await User.create({ email: 'fav404@example.com', fullName: 'Fav 404', googleSub: 'sub404' });
    await Fruit.create({ name: 'Grape', family: 'Berry', calories: 60, sugar: 12, protein: 1 });
  });

  test('updating non-existent favorite id returns 404', async () => {
    const token = tokenFor(user);
    const res = await request(app)
      .put('/favorites/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({ note: 'Should fail' });
    expect(res.status).toBe(404);
  });
});
