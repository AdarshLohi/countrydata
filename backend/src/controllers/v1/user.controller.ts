import { Request, Response, NextFunction } from 'express';
import { getUserById } from '../../services/user.service';
import logger from '../../utils/logger';


// Mock user data for demonstration purposes
const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
];

// Get a user by ID (public route)
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const user = mockUsers.find(u => u.id === userId);
        
        if (!user) {
            logger.error('User not found');
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        next(error);
    }
};

// Create a new user (private route)
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email } = req.body;

        // Simulate user creation
        const newUser = { id: String(mockUsers.length + 1), name, email };
        mockUsers.push(newUser);

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

// Update an existing user (private route)
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const { name, email } = req.body;

        const user = mockUsers.find(u => u.id === userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Simulate user update
        user.name = name;
        user.email = email;

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Partially update a user (private route)
export const partialUpdateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const { name, email } = req.body;

        const user = mockUsers.find(u => u.id === userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Simulate partial update
        if (name) user.name = name;
        if (email) user.email = email;

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

