import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Extend Express Request interface to include the 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload; // Adjust this type based on your decoded JWT structure
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Use nullish coalescing for clarity

  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user; // Assign the decoded token to req.user
    next(); // Proceed to the next middleware/route handler
  });
};