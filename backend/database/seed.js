"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const pool = new pg_1.Pool({
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
        const adminId = (0, uuid_1.v4)();
        const hashedPassword = await bcryptjs_1.default.hash('admin123', 10);
        await client.query(`
      INSERT INTO users (id, email, password, first_name, last_name, role, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `, [adminId, 'admin@kafkasder.org', hashedPassword, 'Admin', 'User', 'admin', true]);
        console.log('✅ Admin user created (email: admin@kafkasder.org, password: admin123)');
        // Create sample volunteer
        const volunteerId = (0, uuid_1.v4)();
        const volunteerPassword = await bcryptjs_1.default.hash('volunteer123', 10);
        await client.query(`
      INSERT INTO users (id, email, password, first_name, last_name, role, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `, [volunteerId, 'volunteer@kafkasder.org', volunteerPassword, 'Gönüllü', 'Kullanıcı', 'volunteer', true]);
        console.log('✅ Volunteer user created (email: volunteer@kafkasder.org, password: volunteer123)');
        // Create sample beneficiaries
        const beneficiaryIds = [];
        for (let i = 1; i <= 5; i++) {
            const beneficiaryId = (0, uuid_1.v4)();
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
            const donationId = (0, uuid_1.v4)();
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
            const referralId = (0, uuid_1.v4)();
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
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
    finally {
        client.release();
        await pool.end();
    }
}
// Run seeding
seedDatabase().catch(console.error);
//# sourceMappingURL=seed.js.map