// src/routes/user.routes.ts
import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getProfile, updateProfile } from '../controllers/user.controller';

const router = express.Router();

router.use(authenticate);

router.get('/', getProfile);
router.put('/edit', updateProfile);

export default router;
