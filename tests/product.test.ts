import request from 'supertest';
import server, { closeServer } from '../src';
import Product from '../src/models/product';
import jwt from 'jsonwebtoken';
import { closeDB } from '../src/config/db';

jest.mock('../src/models/product');

const mockProductData = {
  _id: '507f191e810c19729de860ea',
  name: 'Test Product',
  price: 50.99,
  description: 'This is a test product',
  quantity: 3,
};

const generateAuthToken = () => {
  const mockUserPayload = { id: 'user123', email: 'test@example.com' };
  return jwt.sign(mockUserPayload, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

describe('Product API with Mock Data', () => {
  let token: string;

  beforeAll(async () => {
    token = generateAuthToken();
  });

  afterAll(async () => {
    await closeDB();
    await closeServer();
  }, 10000);


  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const mockSave = jest.fn().mockResolvedValue(mockProductData);
      (Product.prototype.save as jest.Mock) = mockSave;

      const response = await request(server)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(mockProductData);

      console.log

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(mockProductData.name);
    });

    it('should fail if product data is invalid', async () => {
      const invalidData = {
        name: '',
        price: -1,
        description: '',
        quantity: '',
      };

      const response = await request(server)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  // Test for retrieving all products
  describe('GET /api/products', () => {
    it('should get all products', async () => {
      const mockFind = jest.fn().mockResolvedValue([mockProductData]);
      (Product.find as jest.Mock) = mockFind;

      const response = await request(server).get('/api/products').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('_id');
      expect(mockFind).toHaveBeenCalled();
    });
  });

  // Test for retrieving a product by ID
  describe('GET /api/products/:id', () => {
    it('should return a product by ID', async () => {
      const mockFindById = jest.fn().mockResolvedValue(mockProductData);
      (Product.findById as jest.Mock) = mockFindById;

      const response = await request(server).get(`/api/products/${mockProductData._id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', mockProductData._id);
      expect(mockFindById).toHaveBeenCalledWith(mockProductData._id);
    });

    it('should return 404 if product does not exist', async () => {
      const mockFindById = jest.fn().mockResolvedValue(null);
      (Product.findById as jest.Mock) = mockFindById;

      const response = await request(server).get('/api/products/507f191e810c19729de860ff').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found');
    });
  });

  // Test for updating a product by ID
  describe('PUT /api/products/:id', () => {
    it('should update a product', async () => {
      const updatedData = { name: 'Updated Product', price: 35.0 };
      const mockFindByIdAndUpdate = jest.fn().mockResolvedValue({ ...mockProductData, ...updatedData });
      (Product.findByIdAndUpdate as jest.Mock) = mockFindByIdAndUpdate;

      const response = await request(server)
        .put(`/api/products/${mockProductData._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedData.name);
      expect(response.body.price).toBe(updatedData.price);
      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(mockProductData._id, updatedData, { new: true, "runValidators": true, });
    });

    it('should return 404 if product does not exist', async () => {
      const mockFindByIdAndUpdate = jest.fn().mockResolvedValue(null);
      (Product.findByIdAndUpdate as jest.Mock) = mockFindByIdAndUpdate;

      const response = await request(server).put('/api/products/507f191e810c19729de860ff').set('Authorization', `Bearer ${token}`).send({ name: 'Non-existent' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found');
    });
  });

  // Test for deleting a product
  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      const mockFindByIdAndDelete = jest.fn().mockResolvedValue(mockProductData);
      (Product.findByIdAndDelete as jest.Mock) = mockFindByIdAndDelete;

      const response = await request(server).delete(`/api/products/${mockProductData._id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product deleted successfully');
      expect(mockFindByIdAndDelete).toHaveBeenCalledWith(mockProductData._id);
    });

    it('should return 404 if product does not exist', async () => {
      const mockFindByIdAndDelete = jest.fn().mockResolvedValue(null);
      (Product.findByIdAndDelete as jest.Mock) = mockFindByIdAndDelete;

      const response = await request(server).delete('/api/products/507f191e810c19729de860ff').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found');
    });
  });
});