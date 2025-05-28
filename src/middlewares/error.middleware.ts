import { Request, Response } from 'express';

export const errorHandler = (
  err: Error & { statusCode?: number },
  req: Request,
  res: Response
) => {
  console.error(err.stack || err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
