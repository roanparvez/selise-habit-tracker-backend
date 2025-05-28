import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db';
import healthRoute from './routes/health.route';
import { ENV } from './config/env';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import habitRoutes from './routes/habit.route';

const app = express();

connectDB();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Middlwares
app.use(express.json());
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(cookieParser());
app.use('/api/', limiter);

if (ENV.NODE_ENV !== 'production') {
  app.use(morgan('dev')); // Log requests in development mode
}

// Routes
app.use('/api', healthRoute);
app.use('/api/auth', authRoutes);
app.use('/api/profile', userRoutes);
app.use('/api/habits', habitRoutes);

// Place after all routes and middlewares
app.use(errorHandler);

export default app;
