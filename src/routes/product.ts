import express from 'express';
import { body } from 'express-validator';
import { createProduct, getProducts } from '../controllers/product';
import { validateRequest } from '../middlewares/validation'; 
import { authenticateToken } from '../middlewares/auth';

const productRouter = express.Router();

productRouter.post(
  '/products',
  [
    body('name').notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),
    body('description').notEmpty().withMessage('Product description is required'),
    body('quantity').notEmpty().withMessage('Quantity is required'),
  ],
  validateRequest, 
  authenticateToken,
  createProduct
);

productRouter.get('/products', authenticateToken, getProducts);

export default productRouter;