import request from 'supertest';
import app from '../src/app.js';
import '../src/models/index.js';
import { User } from '../src/models/User.js';
import { resetDb } from './resetDb.js';
import jwt from 'jsonwebtoken';

let token;

describe('Profile', () => {
  beforeAll(async () => {
    await resetDb();
    const user = await User.create({ googleSub:'x', email:'a@b.com' });
  token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
  });
  it('gets profile', async ()=> {
    const res = await request(app).get('/profile').set('Authorization','Bearer '+token);
    expect(res.status).toBe(200);
  });
  it('updates profile', async ()=> {
    const res = await request(app).put('/profile').set('Authorization','Bearer '+token).send({ fullName:'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.fullName).toBe('Updated');
  });
});
