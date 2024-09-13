// src/controllers/auth.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

// User signup
export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    res.status(201).json({ userId: newUser._id, email: newUser.email, token });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error });
  }
};

// User login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    res.status(200).json({ userId: user._id, email: user.email, token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};