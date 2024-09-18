import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { body } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateProductInput = [
  body('name').optional().notEmpty().withMessage('Product name is required'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),
  body('description').optional().notEmpty().withMessage('Product description is required'),
  body('quantity').optional().notEmpty().withMessage('Quantity is required'),
];

export const validateAuthInput = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];