import { sign, verify } from 'jsonwebtoken';
import { authenticator } from 'otplib';
import { db, AdminUser } from '@/lib/db';
import bcrypt from 'bcrypt';
import { createHash } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';
const SALT_ROUNDS = 10;

export interface AdminTokenPayload {
  admin_id: string;
  email: string;
  role: string;
  two_factor_verified: boolean;
}

class AdminAuthService {
  async createAdmin(email: string, password: string, role: string, ip: string): Promise<AdminUser> {
    // Hash email
    const hashedEmail = await bcrypt.hash(email, SALT_ROUNDS);
    
    // Hash password with SHA256
    const passwordDigest = createHash('sha256')
      .update(password)
      .digest('hex');
    
    // Hash the digest with bcrypt
    const hashedPassword = await bcrypt.hash(passwordDigest, SALT_ROUNDS);
    
    // Generate 2FA secret
    const twoFactorSecret = authenticator.generateSecret();
    
    // Create admin user
    const adminUser = await db.createAdminUser({
      email: hashedEmail,
      password: hashedPassword,
      two_factor_secret: twoFactorSecret,
      ip_whitelist: [ip],
      role: role as 'superadmin' | 'content-moderator' | 'support-agent',
    });

    return adminUser;
  }

  async login(email: string, password: string, ip: string): Promise<{
    user: AdminUser;
    token: string;
    requires2FA: boolean;
  } | null> {
    // Hash email for comparison
    const hashedEmail = await bcrypt.hash(email, SALT_ROUNDS);
    
    // Hash password with SHA256
    const passwordDigest = createHash('sha256')
      .update(password)
      .digest('hex');
    
    const user = await db.verifyAdminLogin(hashedEmail, passwordDigest, ip);
    if (!user) return null;

    // Generate initial token (without 2FA)
    const token = this.generateToken({
      admin_id: user.admin_id,
      email: user.email,
      role: user.role,
      two_factor_verified: false,
    });

    return {
      user,
      token,
      requires2FA: true,
    };
  }

  async verifyTwoFactor(adminId: string, token: string): Promise<string | null> {
    const isValid = await db.verifyTwoFactor(adminId, token);
    if (!isValid) return null;

    // Get user details
    const user = await db.getAdminUser(adminId);
    if (!user) return null;

    // Generate final token with 2FA verification
    return this.generateToken({
      admin_id: user.admin_id,
      email: user.email,
      role: user.role,
      two_factor_verified: true,
    });
  }

  private generateToken(payload: AdminTokenPayload): string {
    return sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  verifyToken(token: string): AdminTokenPayload | null {
    try {
      return verify(token, JWT_SECRET) as AdminTokenPayload;
    } catch (error) {
      return null;
    }
  }

  async generateTwoFactorSecret(email: string): Promise<string> {
    const secret = authenticator.generateSecret();
    return secret;
  }

  async validateTwoFactorToken(secret: string, token: string): Promise<boolean> {
    return authenticator.verify({ token, secret });
  }

  async getQRCode(secret: string, email: string): Promise<string> {
    return authenticator.keyuri(email, 'StreamX Admin', secret);
  }

  async checkPermission(adminId: string, requiredRole: string): Promise<boolean> {
    const user = await db.getAdminUser(adminId);
    if (!user) return false;

    // Role hierarchy
    const roleHierarchy: Record<string, number> = {
      'superadmin': 3,
      'content-moderator': 2,
      'support-agent': 1,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }
}

export const adminAuthService = new AdminAuthService(); 