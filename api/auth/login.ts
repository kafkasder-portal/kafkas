import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Demo users (production'da database'den gelecek)
const DEMO_USERS = [
  {
    id: '1',
    email: 'admin@kafkas.org',
    password: '$2a$10$..hashlenmiş.şifre..', // "123456" hashlenmış hali
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'manager@kafkas.org', 
    password: '$2a$10$..hashlenmiş.şifre..',
    name: 'Manager User',
    role: 'manager',
  },
  {
    id: '3',
    email: 'volunteer@kafkas.org',
    password: '$2a$10$..hashlenmiş.şifre..',
    name: 'Volunteer User', 
    role: 'volunteer',
  },
];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'E-posta ve şifre gereklidir' 
      });
    }

    // Kullanıcıyı bul
    const user = DEMO_USERS.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Geçersiz giriş bilgileri' 
      });
    }

    // Şifre kontrolü (demo için basit string karşılaştırması)
    const isValidPassword = password === '123456'; // Demo şifre
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Geçersiz giriş bilgileri' 
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    // Başarılı response
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
      message: 'Başarıyla giriş yapıldı',
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      error: 'Sunucu hatası' 
    });
  }
}
