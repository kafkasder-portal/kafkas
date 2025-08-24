import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function checkAllTables() {
  let pool: Pool;
  
  // Use Supabase connection if available, otherwise fallback to local
  if (process.env.POSTGRES_URL) {
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  } else {
    pool = new Pool({
      user: process.env.DB_USER || process.env.POSTGRES_USER || 'postgres',
      host: process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost',
      database: process.env.DB_NAME || process.env.POSTGRES_DATABASE || 'kafkasder_portal',
      password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'password',
      port: parseInt(process.env.DB_PORT || '5432'),
    });
  }

  try {
    console.log('=== All Tables Structure ===\n');
    
    // Get all tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('Available tables:');
    tablesResult.rows.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });
    
    // Check specific tables mentioned in migration
    const tablesToCheck = ['aid_records', 'hospital_referrals', 'volunteers', 'projects', 'project_volunteers', 'expenses', 'reports', 'audit_logs'];
    
    for (const tableName of tablesToCheck) {
      console.log(`\n=== ${tableName.toUpperCase()} TABLE ===`);
      
      const tableExists = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `, [tableName]);
      
      console.log(`Table exists: ${tableExists.rows[0].exists}`);
      
      if (tableExists.rows[0].exists) {
        // Get column details
        const columnsResult = await pool.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position;
        `, [tableName]);
        
        console.log('Columns:');
        columnsResult.rows.forEach(col => {
          console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
        });
      }
    }
    
  } catch (error) {
    console.error('Error checking tables:', error);
  } finally {
    await pool.end();
  }
}

checkAllTables();