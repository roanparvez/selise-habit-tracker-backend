import { Request, Response } from 'express';

export const healthCheck = (req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    message: 'Server is Healthy!',
    timestamp: new Date().toISOString(),
  });
};
