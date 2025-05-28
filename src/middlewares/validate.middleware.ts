// src/middleware/validate.middleware.ts
import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        errors: err.errors.map((e) => ({
          path: e.path[0],
          message: e.message,
        })),
      });
    }
  };
