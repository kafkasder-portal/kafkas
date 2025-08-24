/**
 * Authentication middleware for Express.js
 * Provides JWT token validation and user context
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/database';

// Extend Express Request interface to include user
declare global {
  interface Express {
    Request: {
      user?: {
        id: string;
        email: string;
        role: string;
        name?: string;
      };
    };
  }
}

/**
 * Verify JWT token and set user context
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required',
    });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret'
    ) as any;

    // Get user from database to ensure user still exists and is active
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, role, name, active')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found',
      });
    }

    if (!user.active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    // Set user context for downstream middleware/routes
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token provided
 * But validates token if present
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(); // Continue without authentication
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret'
    ) as any;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, role, name, active')
      .eq('id', decoded.userId)
      .single();

    if (!error && user && user.active) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      };
    }
  } catch (error) {
    // Silently fail for optional auth
  }

  next();
};

/**
 * Role-based authorization middleware
 */
export const requireRole = (requiredRoles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const roles = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles];

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

/**
 * Permission-based authorization middleware
 */
export const requirePermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    try {
      // Check user permissions from database
      const { data: userPermissions, error } = await supabase
        .from('user_permissions')
        .select('permission')
        .eq('user_id', req.user.id)
        .eq('permission', permission)
        .single();

      if (error || !userPermissions) {
        return res.status(403).json({
          success: false,
          message: 'Permission denied',
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking permissions',
      });
    }
  };
};

/**
 * Rate limiting per user
 */
export const rateLimitPerUser = (
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000
) => {
  const userRequests = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id || req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old requests
    if (userRequests.has(userId)) {
      const requests = userRequests.get(userId)!;
      const validRequests = requests.filter(time => time > windowStart);
      userRequests.set(userId, validRequests);
    } else {
      userRequests.set(userId, []);
    }

    const currentRequests = userRequests.get(userId)!;

    if (currentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests',
        retryAfter: Math.ceil(windowMs / 1000),
      });
    }

    // Add current request
    currentRequests.push(now);
    userRequests.set(userId, currentRequests);

    next();
  };
};

/**
 * Generate JWT token for user
 */
export const generateToken = (user: {
  id: string;
  email: string;
  role: string;
}) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || 'fallback-secret',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

/**
 * Security headers middleware
 */
export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'");

  next();
};
