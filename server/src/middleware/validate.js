import { ZodError } from 'zod';

export function validate(schema) {
  return (req, res, next) => {
    try {
      const data = schema.parse({ body: req.body, query: req.query, params: req.params });
      req.validated = data;
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: e.errors });
      }
      next(e);
    }
  }
}
