import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkAuditLogsTable() {
  try {
    // Get table structure
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'audit_logs'
      ORDER BY ordinal_position;
    `);
    
    console.log('Audit logs table structure:');
    result.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} ${row.is_nullable} ${row.column_default ? 'DEFAULT ' + row.column_default : ''}`);
    });
    
    // Get existing indexes
    const indexResult = await pool.query(`
      SELECT indexname, indexdef
      FROM pg_indexes 
      WHERE tablename = 'audit_logs' 
      AND schemaname = 'public'
      ORDER BY indexname;
    `);
    
    console.log('\nExisting indexes on audit_logs table:');
    indexResult.rows.forEach(row => {
      console.log(`  ${row.indexname}: ${row.indexdef}`);
    });
    
  } catch (error) {
    console.error('Error checking audit_logs table:', error instanceof Error ? error.message : String(error));
  } finally {
    await pool.end();
  }
}

checkAuditLogsTable();