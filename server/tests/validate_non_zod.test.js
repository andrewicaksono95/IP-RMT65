import request from 'supertest';
import express from 'express';
import { validate } from '../src/middleware/validate.js';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const badSchema = { parse: () => { throw new Error('NonZod'); } };
app.post('/bad-validate', validate(badSchema), (req,res)=> res.json({ ok:true }));

// Use error handler from project
import { errorHandler } from '../src/middleware/errorHandler.js';
app.use(errorHandler);

describe('Validate non-Zod error path', () => {
  test('returns 500 for non-Zod thrown error', async () => {
    const res = await request(app).post('/bad-validate').send({});
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('NonZod');
  });
});
