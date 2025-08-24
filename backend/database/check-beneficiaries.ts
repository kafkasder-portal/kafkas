import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function checkBeneficiariesTable() {
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
    console.log('=== Beneficiaries Table Structure ===\n');
    
    // Check if beneficiaries table exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'beneficiaries'
      );
    `);
    
    console.log(`Beneficiaries table exists: ${tableExists.rows[0].exists}`);
    
    if (tableExists.rows[0].exists) {
      // Get column details
      const columnsResult = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'beneficiaries'
        ORDER BY ordinal_position;
      `);
      
      console.log('\nBeneficiaries table columns:');
      columnsResult.rows.forEach(col => {
        console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
      });
      
      // Check existing indexes
      const indexesResult = await pool.query(`
        SELECT indexname, indexdef
        FROM pg_indexes 
        WHERE tablename = 'beneficiaries' AND schemaname = 'public';
      `);
      
      console.log('\nExisting indexes on beneficiaries table:');
      indexesResult.rows.forEach(idx => {
        console.log(`  ${idx.indexname}: ${idx.indexdef}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking beneficiaries table:', error);
  } finally {
    await pool.end();
  }
}

checkBeneficiariesTable();