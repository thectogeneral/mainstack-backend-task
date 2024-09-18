import express from 'express';
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from '../controllers/product';
import { validateRequest, validateProductInput } from '../middlewares/validation'; 
import { authenticateToken } from '../middlewares/auth';

const productRouter = express.Router();

productRouter.post(
  '/products',
  validateProductInput,
  validateRequest, 
  authenticateToken,
  createProduct
);

productRouter.get('/products', authenticateToken, getProducts);

productRouter.get('/products/:id', authenticateToken, getProduct);

productRouter.put(
  '/products/:id',
  validateProductInput,
  validateRequest,
  updateProduct,
  authenticateToken,
);

productRouter.delete('/products/:id', authenticateToken, deleteProduct);

export default productRouter;