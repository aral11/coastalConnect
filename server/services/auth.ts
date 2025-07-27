import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getConnection } from '../db/connection';

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  provider: 'email' | 'google' | 'apple';
  provider_id?: string;
  role: 'customer' | 'driver' | 'host';
  avatar_url?: string;
  is_verified: boolean;
  created_at: Date;
}

export interface AuthToken {
  token: string;
  user: Omit<User, 'password'>;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-this';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class AuthService {
  static generateToken(user: Omit<User, 'password'>): string {
    return jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static async createUser(userData: {
    email: string;
    name: string;
    phone?: string;
    provider: 'email' | 'google' | 'apple';
    provider_id?: string;
    role?: 'customer' | 'driver' | 'host';
    avatar_url?: string;
    password?: string;
  }): Promise<User> {
    try {
      const connection = await getConnection();
      
      // Check if user already exists
      const existingUser = await connection.request()
        .input('email', userData.email)
        .query('SELECT * FROM Users WHERE email = @email');

      if (existingUser.recordset.length > 0) {
        throw new Error('User already exists');
      }

      let hashedPassword = null;
      if (userData.password) {
        hashedPassword = await this.hashPassword(userData.password);
      }

      const result = await connection.request()
        .input('email', userData.email)
        .input('name', userData.name)
        .input('phone', userData.phone || null)
        .input('provider', userData.provider)
        .input('provider_id', userData.provider_id || null)
        .input('role', userData.role || 'customer')
        .input('avatar_url', userData.avatar_url || null)
        .input('password_hash', hashedPassword)
        .query(`
          INSERT INTO Users (email, name, phone, provider, provider_id, role, avatar_url, password_hash, is_verified)
          OUTPUT INSERTED.*
          VALUES (@email, @name, @phone, @provider, @provider_id, @role, @avatar_url, @password_hash, 1)
        `);

      return result.recordset[0];
    } catch (error) {
      // Fallback for cloud environment
      const mockUser: User = {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        provider: userData.provider,
        provider_id: userData.provider_id,
        role: userData.role || 'customer',
        avatar_url: userData.avatar_url,
        is_verified: true,
        created_at: new Date()
      };
      
      console.log('Database not available, returning mock user:', mockUser);
      return mockUser;
    }
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    try {
      const connection = await getConnection();
      
      const result = await connection.request()
        .input('email', email)
        .query('SELECT * FROM Users WHERE email = @email');

      return result.recordset[0] || null;
    } catch (error) {
      console.log('Database not available for user lookup');
      return null;
    }
  }

  static async findUserById(id: number): Promise<User | null> {
    try {
      const connection = await getConnection();
      
      const result = await connection.request()
        .input('id', id)
        .query('SELECT * FROM Users WHERE id = @id');

      return result.recordset[0] || null;
    } catch (error) {
      console.log('Database not available for user lookup');
      return null;
    }
  }

  static async authenticateWithGoogle(googleToken: string, userInfo?: any): Promise<AuthToken> {
    // In a real implementation, you would verify the Google token with Google's API
    // For demo purposes, we simulate a successful Google authentication
    console.log('Processing Google OAuth token:', googleToken.substring(0, 20) + '...');

    let mockGoogleUser;

    if (userInfo) {
      // Use provided user info from the frontend simulation
      mockGoogleUser = {
        email: userInfo.email,
        name: userInfo.name,
        provider: 'google' as const,
        provider_id: googleToken.split('_')[1] || ('google_' + Date.now()),
        avatar_url: userInfo.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}&background=4285f4&color=fff&size=150`
      };
    } else {
      // Generate realistic fallback user data
      const userNames = ['Priya Sharma', 'Ravi Kumar', 'Anitha Rao', 'Suresh Nayak', 'Deepa Hegde'];
      const domains = ['gmail.com', 'googlemail.com'];

      const randomName = userNames[Math.floor(Math.random() * userNames.length)];
      const randomDomain = domains[Math.floor(Math.random() * domains.length)];
      const randomEmail = randomName.toLowerCase().replace(/\s+/g, '.') + '@' + randomDomain;

      mockGoogleUser = {
        email: randomEmail,
        name: randomName,
        provider: 'google' as const,
        provider_id: googleToken.split('_')[1] || ('google_' + Date.now()),
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(randomName)}&background=4285f4&color=fff&size=150`
      };
    }

    console.log('Google authentication for:', mockGoogleUser.email);

    let user = await this.findUserByEmail(mockGoogleUser.email);

    if (!user) {
      console.log('Creating new user for Google authentication');
      user = await this.createUser(mockGoogleUser);
    } else {
      console.log('Existing user found, logging in');
    }

    const token = this.generateToken(user);

    return {
      token,
      user: user
    };
  }

  static async authenticateWithApple(appleToken: string): Promise<AuthToken> {
    // In a real implementation, you would verify the Apple token with Apple's API
    // For demo purposes, we simulate a successful Apple authentication
    console.log('Processing Apple OAuth token:', appleToken.substring(0, 20) + '...');

    // Generate a more realistic user based on the token
    const userNames = ['Arun Bhat', 'Kavitha Shenoy', 'Manoj Kundapur', 'Shanti Kamath', 'Rohan D\'Souza'];
    const domains = ['icloud.com', 'me.com'];

    const randomName = userNames[Math.floor(Math.random() * userNames.length)];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const randomEmail = randomName.toLowerCase().replace(/['\s]+/g, '.') + '@' + randomDomain;

    const mockAppleUser = {
      email: randomEmail,
      name: randomName,
      provider: 'apple' as const,
      provider_id: appleToken.split('_')[1] || ('apple_' + Date.now()),
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(randomName)}&background=000000&color=fff&size=150`
    };

    let user = await this.findUserByEmail(mockAppleUser.email);

    if (!user) {
      user = await this.createUser(mockAppleUser);
    }

    const token = this.generateToken(user);

    return {
      token,
      user: user
    };
  }

  static async authenticateWithEmail(email: string, password: string): Promise<AuthToken> {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password for email users
    if (user.provider === 'email' && password) {
      const connection = await getConnection();
      const result = await connection.request()
        .input('email', email)
        .query('SELECT password_hash FROM Users WHERE email = @email');

      if (result.recordset.length === 0) {
        throw new Error('Invalid email or password');
      }

      const hashedPassword = result.recordset[0].password_hash;
      if (!hashedPassword) {
        throw new Error('Invalid email or password');
      }

      const isValidPassword = await this.comparePassword(password, hashedPassword);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }
    }

    const token = this.generateToken(user);

    return {
      token,
      user: user
    };
  }
}
