import { z } from 'zod';

export const favoriteCreateSchema = z.object({
  body: z.object({
    fruitId: z.number({ required_error: 'fruitId required' }).int().positive(),
    note: z.string().max(255).optional()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const favoriteUpdateSchema = z.object({
  body: z.object({
    note: z.string().max(255).optional()
  }).refine(data => Object.keys(data).length > 0, { message: 'At least one field required' }),
  params: z.object({ id: z.string().regex(/^\d+$/) }),
  query: z.object({}).optional()
});

export const profileUpdateSchema = z.object({
  body: z.object({
    fullName: z.string().min(1).max(120).optional(),
    nickName: z.string().min(1).max(40).optional(),
    gender: z.enum(['male','female','other']).optional(),
    dateOfBirth: z.string().optional(),
  }).refine(data => Object.keys(data).length > 0, { message: 'At least one field required' }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});
