import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getConnection } from '../db/connection';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
    phone?: string;
    role: string;
  };
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    try {
      // Get user from database
      const connection = await getConnection();
      const result = await connection.request()
        .input('userId', decoded.userId)
        .query(`
          SELECT id, email, name, phone, role, avatar_url
          FROM Users
          WHERE id = @userId AND is_active = 1
        `);

      if (result.recordset.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive'
        });
      }

      req.user = result.recordset[0];
    } catch (dbError) {
      console.log('Database unavailable for user lookup, using token data for fallback authentication');

      // Fallback: Use data from JWT token when database is unavailable
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name || `User ${decoded.userId}`,
        phone: null,
        role: decoded.role || 'customer',
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(decoded.name || `User ${decoded.userId}`)}&background=0ea5e9&color=fff&size=150`
      };
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      try {
        const connection = await getConnection();
        const result = await connection.request()
          .input('userId', decoded.userId)
          .query(`
            SELECT id, email, name, phone, role, avatar_url
            FROM Users
            WHERE id = @userId AND is_active = 1
          `);

        if (result.recordset.length > 0) {
          req.user = result.recordset[0];
        }
      } catch (dbError) {
        // Fallback: Use token data when database unavailable
        req.user = {
          id: decoded.userId,
          email: decoded.email,
          name: decoded.name || `User ${decoded.userId}`,
          phone: null,
          role: decoded.role || 'customer',
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(decoded.name || `User ${decoded.userId}`)}&background=0ea5e9&color=fff&size=150`
        };
      }
    }

    next();
  } catch (error) {
    // For optional auth, continue even if token is invalid
    next();
  }
};

export type { AuthenticatedRequest };
