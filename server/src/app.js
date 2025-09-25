import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import fruitRoutes from './routes/fruitRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import './models/index.js';
import { validate } from './middleware/validate.js';
import { z } from 'zod';

dotenv.config();
const app = express();
// Refined CORS: support comma-separated allowed origins, wildcard fallback, and proper echo for credentials
const rawOrigins = process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split(',').map(o=>o.trim()).filter(Boolean) : ['*'];
const allowAll = rawOrigins.includes('*');
app.use(cors({
	origin: (origin, callback) => {
		if (!origin) return callback(null, allowAll ? true : rawOrigins[0]); // non-browser or same-origin
		if (allowAll) return callback(null, true);
		if (rawOrigins.includes(origin)) return callback(null, true);
		return callback(new Error('CORS not allowed for origin: ' + origin));
	},
	credentials: true
}));
app.use(express.json());

app.get('/health', (req,res)=> res.json({ status: 'ok' }));
app.use('/auth', authRoutes);
app.use('/fruits', fruitRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/profile', profileRoutes);
app.use('/ai', aiRoutes);

// test-only route for params/query validation branch coverage
if (process.env.NODE_ENV === 'test') {
	const paramsSchema = z.object({ params: z.object({ id: z.string().uuid('Invalid UUID') }), query: z.object({ page: z.string().regex(/^\d+$/,'page must be number') }).partial(), body: z.any() });
	app.get('/_test/validate/:id', validate(paramsSchema), (req,res)=> res.json({ ok: true }));
}

app.use(errorHandler);

export default app;
