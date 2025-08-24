import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'kafkasder_portal',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...');
    
    // Create admin user
    const adminId = uuidv4();
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await client.query(`
      INSERT INTO users (id, email, password, first_name, last_name, role, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `, [adminId, 'admin@kafkasder.org', hashedPassword, 'Admin', 'User', 'admin', true]);
    
    console.log('✅ Admin user created (email: admin@kafkasder.org, password: admin123)');
    
    // Create sample volunteer
    const volunteerId = uuidv4();
    const volunteerPassword = await bcrypt.hash('volunteer123', 10);
    
    await client.query(`
      INSERT INTO users (id, email, password, first_name, last_name, role, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `, [volunteerId, 'volunteer@kafkasder.org', volunteerPassword, 'Gönüllü', 'Kullanıcı', 'volunteer', true]);
    
    console.log('✅ Volunteer user created (email: volunteer@kafkasder.org, password: volunteer123)');
    
    // Create sample beneficiaries
    const beneficiaryIds = [];
    for (let i = 1; i <= 5; i++) {
      const beneficiaryId = uuidv4();
      beneficiaryIds.push(beneficiaryId);
      
      await client.query(`
        INSERT INTO beneficiaries (id, first_name, last_name, phone, address, needs_description, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      `, [
        beneficiaryId,
        `Yararlanıcı ${i}`,
        `Soyadı ${i}`,
        `+90555000000${i}`,
        `Adres ${i}, İstanbul`,
        `İhtiyaç açıklaması ${i}`,
        'active'
      ]);
    }
    
    console.log('✅ Sample beneficiaries created');
    
    // Create sample donations
    for (let i = 1; i <= 10; i++) {
      const donationId = uuidv4();
      const amount = Math.floor(Math.random() * 1000) + 100;
      
      await client.query(`
        INSERT INTO donations (id, donor_name, donor_email, donor_phone, amount, donation_type, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      `, [
        donationId,
        `Bağışçı ${i}`,
        `bagisci${i}@example.com`,
        `+90555000${String(i).padStart(4, '0')}`,
        amount,
        i % 2 === 0 ? 'monetary' : 'in_kind',
        'completed'
      ]);
    }
    
    console.log('✅ Sample donations created');
    
    // Create sample hospital referrals
    for (let i = 1; i <= 3; i++) {
      const referralId = uuidv4();
      const beneficiaryId = beneficiaryIds[i - 1];
      
      await client.query(`
        INSERT INTO hospital_referrals (id, beneficiary_id, hospital_name, department, doctor_name, appointment_date, status, notes, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      `, [
        referralId,
        beneficiaryId,
        `Hastane ${i}`,
        `Bölüm ${i}`,
        `Dr. Doktor ${i}`,
        new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000), // i weeks from now
        'scheduled',
        `Sevk notları ${i}`
      ]);
    }
    
    console.log('✅ Sample hospital referrals created');
    
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run seeding
seedDatabase().catch(console.error);