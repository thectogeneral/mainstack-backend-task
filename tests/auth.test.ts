import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import server from '../src';
import User from '../src/models/user';
import { connectDB, closeDB } from '../src/config/db';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../src/models/user');

const mockUser = {
  _id: '507f191e810c19729de860ea',
  email: 'test@example.com',
  password: 'hashedpassword123',
};

describe('Auth Controller', () => {

    beforeAll(async () => {
        await connectDB(); // Ensure the database connection is established before tests
    });

    afterAll(async () => {
        await closeDB(); // Ensure the database connection is closed after tests
    });

    describe('POST /signup', () => {
        it('should create a new user and return a token', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null); // Mock no existing user
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword123'); // Mock password hash
            (jwt.sign as jest.Mock).mockReturnValue('mocked_token'); // Mock JWT token
            User.create = jest.fn().mockResolvedValue({ email: 'test@example.com', _id: '123' }); // Mock user creation
            (User.prototype.save as jest.Mock).mockResolvedValue(mockUser); // Mock saving user

            const response = await request(server).post('/signup').send({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body.email).toBe('test@example.com');
            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
        });

        it('should return 400 if user already exists', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(mockUser); // Mock existing user

            const response = await request(server).post('/signup').send({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('User already exists');
        });

        it('should return 500 if there is a server error', async () => {
            (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error')); // Mock error

            const response = await request(server).post('/signup').send({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Signup failed');
        });
    });

    describe('POST /login', () => {
        it('should log in the user and return a token', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(mockUser); // Mock user found
            (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Mock valid password
            (jwt.sign as jest.Mock).mockReturnValue('mocked_token'); // Mock JWT token

            const response = await request(server).post('/login').send({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.email).toBe('test@example.com');
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword123');
        });

        it('should return 400 if the credentials are invalid (no user found)', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null); // Mock no user found

            const response = await request(server).post('/login').send({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid credentials');
        });

        it('should return 400 if the password is incorrect', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(mockUser); // Mock user found
            (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Mock invalid password

            const response = await request(server).post('/login').send({
                email: 'test@example.com',
                password: 'wrongpassword',
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid credentials');
        });

        it('should return 500 if there is a server error during login', async () => {
            (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error')); // Mock error

            const response = await request(server).post('/login').send({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Login failed');
        });
    });
});