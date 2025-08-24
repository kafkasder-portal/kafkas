import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/kafportal'
});

async function checkDonationsTable() {
  try {
    console.log('=== DONATIONS TABLE ===');
    
    // Check if table exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'donations'
      );
    `);
    
    console.log('Table exists:', tableExists.rows[0].exists);
    
    if (tableExists.rows[0].exists) {
      // Get column information
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'donations' 
        ORDER BY ordinal_position;
      `);
      
      console.log('Columns:');
      columns.rows.forEach(col => {
        console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable} ${col.column_default || ''}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking donations table:', error instanceof Error ? error.message : String(error));
  } finally {
    await pool.end();
  }
}

checkDonationsTable();