import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import User from '../models/user.model';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.token;
  if (!token) res.status(401).json({ message: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    if (!user) res.status(401).json({ message: 'Unauthorized' });

    req.user = user;
    next();
  } catch (error: unknown) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
