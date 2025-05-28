import { Router } from 'express';
import {
  checkAuthStatus,
  login,
  logout,
  register,
} from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { LoginSchema, RegisterSchema } from '../validators/auth.schema';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.route('/register').post(validate(RegisterSchema), register);
router.route('/login').post(validate(LoginSchema), login);
router.route('/logout').post(logout);
router.route('/status').get(authenticate, checkAuthStatus);

export default router;
