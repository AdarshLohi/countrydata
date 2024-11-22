// src/routes/v1/auth.routes.ts
import { Router } from 'express';
import { loginUser } from '../../controllers/v1/auth.controller';
import { validateLogin } from '../../middlewares/validation.middleware';

const router = Router();

// Login route (Public)
router.post('/login', validateLogin, loginUser);

export { router as authRoutes };
