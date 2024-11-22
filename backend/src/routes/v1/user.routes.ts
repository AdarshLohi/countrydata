

// src/routes/v1/user.routes.ts
import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validateLogin } from '../../middlewares/validation.middleware';
import { getUser, createUser, updateUser, partialUpdateUser } from '../../controllers/v1/user.controller';

const router = Router();

// Public routes
router.get('/:id', getUser);

// Private routes (protected by JWT authentication)
router.post('/', [authenticate, validateLogin], createUser);
router.put('/:id', [authenticate, validateLogin], updateUser);
router.patch('/:id', [authenticate, validateLogin], partialUpdateUser);

export { router as userRoutes };

