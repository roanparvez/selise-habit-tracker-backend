import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config({ path: 'src/.env' });
connectDB();

import healthRoute from './routes/health.route';

const app = express();

// Middlwares
app.use(express.json());

// Routes
app.use('/api', healthRoute);

export default app;
