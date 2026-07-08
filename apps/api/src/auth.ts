import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  roles: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  saltRounds: number;
}

export class AuthService {
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.config.saltRounds);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: this.config.jwtExpiresIn,
    } as jwt.SignOptions);
  }

  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.config.jwtSecret) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  hasPermission(roles: string[], permission: string): boolean {
    // In a real implementation, you would check roles against permissions
    // For now, we'll use a simple check
    const adminRoles = ['admin', 'superadmin'];
    return roles.some(role => adminRoles.includes(role));
  }

  hasAnyRole(userRoles: string[], requiredRoles: string[]): boolean {
    return requiredRoles.some(role => userRoles.includes(role));
  }

  hasAllRoles(userRoles: string[], requiredRoles: string[]): boolean {
    return requiredRoles.every(role => userRoles.includes(role));
  }
}

export default AuthService;
