import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/jwt';
import logger from '../../utils/logger';

const mockUser = {
    id: '1',
    email: 'john@example.com',
    passwordHash: bcrypt.hashSync('password123', 10) // Hashed password
};

// Login user and return a JWT token
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Find user by email (mock example)
        if (email !== mockUser.email) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = bcrypt.compareSync(password, mockUser.passwordHash);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        logger.error( email ,password);
        // Generate JWT token
        const token = generateToken(mockUser.id);

        // Send token to the client
        res.json({ token });
    } catch (error) {
        next(error);
    }
};
