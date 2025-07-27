import { RequestHandler } from "express";
import { AuthService } from "../services/auth";

export const googleAuth: RequestHandler = async (req, res) => {
  try {
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
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const authResult = await AuthService.authenticateWithEmail(email, password);
    
    res.json({
      success: true,
      data: authResult,
      message: 'Email authentication successful'
    });
  } catch (error) {
    console.error('Email auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const register: RequestHandler = async (req, res) => {
  try {
    const { email, password, name, phone, role } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      });
    }

    const user = await AuthService.createUser({
      email,
      name,
      phone,
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
    res.status(400).json({
      success: false,
      message: 'Registration failed',
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
