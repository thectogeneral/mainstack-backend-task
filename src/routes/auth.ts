// src/routes/auth.ts
import express from 'express';
import { signup, login } from '../controllers/auth';
import { validateAuthInput, validateRequest } from '../middlewares/validation';

const userRouter = express.Router();

// Signup route
userRouter.post(
  '/signup',
  validateAuthInput,
  validateRequest,
  signup
);

// Login route
userRouter.post(
  '/login',
  validateAuthInput,
  validateRequest,
  login
);

export default userRouter;