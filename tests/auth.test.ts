import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import server, {closeServer} from '../src';
import User from '../src/models/user';
import { closeDB } from '../src/config/db';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../src/models/user');

const mockUser = {
  _id: '507f191e810c19729de860ea',
  email: 'test@example.com',
  password: 'hashedpassword123',
};

describe('Auth Controller', () => {
    afterAll(async () => {
        await closeDB();
        await closeServer();
    }, 10000);

    beforeAll(() => {
        process.env.JWT_SECRET = 'mock_secret';
    });

    it('should create a new user and return a JWT token', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword123'); 
        (jwt.sign as jest.Mock).mockReturnValue('mocked_token'); 
        (User.prototype.save as jest.Mock).mockResolvedValue(mockUser);

        const response = await request(server).post('/signup').send({
            email: 'test@example.com',
            password: 'password123',
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token', 'mocked_token');
        expect(response.body).toHaveProperty('email', 'test@example.com');
        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: '123', email: 'test@example.com' },
            'mock_secret',
            { expiresIn: '1h' }
            );
        });

        it('should return 400 if user already exists', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(mockUser); 
            const response = await request(server).post('/signup').send({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('User already exists');
        });

        it('should return 500 if there is a server error', async () => {
            (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error')); 

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
            (User.findOne as jest.Mock).mockResolvedValue(mockUser); 
            (bcrypt.compare as jest.Mock).mockResolvedValue(true); 
            (jwt.sign as jest.Mock).mockReturnValue('mocked_token');

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
            (User.findOne as jest.Mock).mockResolvedValue(null);

            const response = await request(server).post('/login').send({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid credentials');
        });

        it('should return 400 if the password is incorrect', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(mockUser); 
            (bcrypt.compare as jest.Mock).mockResolvedValue(false); 

            const response = await request(server).post('/login').send({
                email: 'test@example.com',
                password: 'wrongpassword',
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid credentials');
        });

        it('should return 500 if there is a server error during login', async () => {
            (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

            const response = await request(server).post('/login').send({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Login failed');
        });
});