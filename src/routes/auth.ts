// src/routes/auth.ts
import express from 'express';
import { body } from 'express-validator';
import { signup, login } from '../controllers/auth';
import { validateRequest } from '../middlewares/validation';

const userRouter = express.Router();

// Signup route
userRouter.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  validateRequest,
  signup
);

// Login route
userRouter.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  login
);

export default userRouter;