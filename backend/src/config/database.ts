import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.warn('⚠️ DATABASE_URL environment variable is not set')
  console.log('✅ Application will continue without database connection')
}

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl?.includes('supabase.co')
    ? {
        rejectUnauthorized: false,
      }
    : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Initialize database connection
export const initializeDatabase = async () => {
  try {
    if (!databaseUrl) {
      console.log('⚠️ No database URL provided, skipping database initialization')
      return
    }

    console.log('✅ Connecting to database...')

    // Test PostgreSQL connection
    const result = await pool.query('SELECT NOW() as current_time')
    console.log('✅ Database connection successful:', result.rows[0].current_time)
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    console.log('⚠️ Application will continue without database connection')
  }
}

// Simple query function using PostgreSQL
export const query = async (text: string, params?: any[]) => {
  try {
    if (!databaseUrl) {
      throw new Error('Database connection not available')
    }

    console.log('🔍 Executing query:', text.substring(0, 100) + '...')

    const result = await pool.query(text, params)
    return result
  } catch (error) {
    console.error('❌ Query execution failed:', {
      query: text.substring(0, 50) + '...',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    throw error
  }
}

// Export pool for direct access if needed
export { pool }
