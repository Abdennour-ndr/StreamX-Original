import { Pool } from 'pg';
import { hash, compare } from 'bcrypt';
import { createHash } from 'crypto';
import { authenticator } from 'otplib';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export interface AdminUser {
  admin_id: string;
  email: string;
  password: string;
  two_factor_secret: string;
  ip_whitelist: string[];
  role: 'superadmin' | 'content-moderator' | 'support-agent';
  created_at: Date;
  last_login: Date;
}

export interface AuditLog {
  log_id: string;
  admin_id: string;
  action: string;
  details: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: Date;
}

class Database {
  async createAdminUser(user: Omit<AdminUser, 'admin_id' | 'created_at' | 'last_login'>): Promise<AdminUser> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO admin_users 
        (email, password, two_factor_secret, ip_whitelist, role) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [user.email, user.password, user.two_factor_secret, user.ip_whitelist, user.role]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async verifyAdminLogin(email: string, password: string, ip: string): Promise<AdminUser | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM admin_users WHERE email = $1',
        [email]
      );
      
      if (result.rows.length === 0) return null;
      
      const user = result.rows[0];
      const isValid = await compare(password, user.password);
      
      if (!isValid) return null;
      
      // Check IP whitelist
      if (!user.ip_whitelist.includes(ip)) {
        await this.logAudit(user.admin_id, 'login_failed', {
          reason: 'ip_not_whitelisted',
          attempted_ip: ip
        });
        return null;
      }

      // Update last login
      await client.query(
        'UPDATE admin_users SET last_login = NOW() WHERE admin_id = $1',
        [user.admin_id]
      );

      return user;
    } finally {
      client.release();
    }
  }

  async getAdminUser(adminId: string): Promise<AdminUser | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM admin_users WHERE admin_id = $1',
        [adminId]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async verifyTwoFactor(adminId: string, token: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT two_factor_secret FROM admin_users WHERE admin_id = $1',
        [adminId]
      );
      
      if (result.rows.length === 0) return false;
      
      const secret = result.rows[0].two_factor_secret;
      return authenticator.verify({ token, secret });
    } finally {
      client.release();
    }
  }

  async logAudit(adminId: string, action: string, details: Record<string, any>): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO audit_logs (
          admin_id, action, details, ip_address, user_agent
        ) VALUES ($1, $2, $3, $4, $5)`,
        [adminId, action, details, details.ip, details.userAgent]
      );
    } finally {
      client.release();
    }
  }

  async getAuditLogs(adminId?: string, limit: number = 100): Promise<AuditLog[]> {
    const client = await pool.connect();
    try {
      const query = adminId
        ? 'SELECT * FROM audit_logs WHERE admin_id = $1 ORDER BY created_at DESC LIMIT $2'
        : 'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1';
      const params = adminId ? [adminId, limit] : [limit];
      
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }
}

export const db = new Database(); 