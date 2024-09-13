import express from 'express';
import { body } from 'express-validator';
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from '../controllers/product';
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

productRouter.get('/products/:id', authenticateToken, getProduct);

productRouter.put(
  '/products/:id',
  [
    body('name').optional().notEmpty().withMessage('Product name is required'),
    body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),
    body('description').optional().notEmpty().withMessage('Product description is required'),
    body('category').optional().notEmpty().withMessage('Category is required'),
  ],
  validateRequest,
  updateProduct,
  authenticateToken,
);

productRouter.delete('/products/:id', authenticateToken, deleteProduct);

export default productRouter;