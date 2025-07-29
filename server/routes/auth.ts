import { RequestHandler } from "express";
import { AuthService } from "../services/auth";

export const googleAuth: RequestHandler = async (req, res) => {
  try {
    // Check if request body exists
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body'
      });
    }

    const { token, userInfo } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google token is required'
      });
    }

    console.log('Google authentication request received');

    const authResult = await AuthService.authenticateWithGoogle(token, userInfo);

    console.log('Google authentication successful for user:', authResult.user.email);

    res.json({
      success: true,
      data: authResult,
      message: 'Google authentication successful'
    });
  } catch (error) {
    console.error('Google auth error:', error);

    // Handle specific error types
    if (error instanceof Error && error.message.includes('Database error')) {
      return res.status(503).json({
        success: false,
        message: 'Service temporarily unavailable. Please try again.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Google authentication failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const appleAuth: RequestHandler = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Apple token is required'
      });
    }

    const authResult = await AuthService.authenticateWithApple(token);
    
    res.json({
      success: true,
      data: authResult,
      message: 'Apple authentication successful'
    });
  } catch (error) {
    console.error('Apple auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Apple authentication failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const emailAuth: RequestHandler = async (req, res) => {
  try {
    // Check if request body exists
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body'
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const authResult = await AuthService.authenticateWithEmail(email.toLowerCase().trim(), password);

    res.json({
      success: true,
      data: authResult,
      message: 'Email authentication successful'
    });
  } catch (error) {
    console.error('Email auth error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Invalid email or password')) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
      if (error.message.includes('Database error')) {
        return res.status(503).json({
          success: false,
          message: 'Service temporarily unavailable. Please try again.'
        });
      }
    }

    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const register: RequestHandler = async (req, res) => {
  try {
    // Check if request body exists
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body'
      });
    }

    const { email, password, name, phone, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const user = await AuthService.createUser({
      email: email.toLowerCase().trim(),
      name: name.trim(),
      phone: phone?.trim(),
      provider: 'email',
      role: role || 'customer',
      password
    });

    const token = AuthService.generateToken(user);

    res.status(201).json({
      success: true,
      data: { token, user },
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }
      if (error.message.includes('Database error') || error.message.includes('connection')) {
        return res.status(503).json({
          success: false,
          message: 'Service temporarily unavailable. Please try again.'
        });
      }
    }

    res.status(400).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const verifyToken: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = AuthService.verifyToken(token);
    const user = await AuthService.findUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user },
      message: 'Token is valid'
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const logout: RequestHandler = async (req, res) => {
  try {
    // For JWT tokens, we just need to tell the client to delete the token
    // In a more advanced implementation, we might maintain a blacklist of tokens
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
