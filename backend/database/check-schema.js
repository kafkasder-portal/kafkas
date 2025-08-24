"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
// Load environment variables
dotenv.config();
async function checkSchema() {
    let pool;
    // Use Supabase connection if available, otherwise fallback to local
    if (process.env.POSTGRES_URL) {
        pool = new pg_1.Pool({
            connectionString: process.env.POSTGRES_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
    }
    else {
        pool = new pg_1.Pool({
            user: process.env.DB_USER || process.env.POSTGRES_USER || 'postgres',
            host: process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost',
            database: process.env.DB_NAME || process.env.POSTGRES_DATABASE || 'kafkasder_portal',
            password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'password',
            port: parseInt(process.env.DB_PORT || '5432'),
        });
    }
    try {
        console.log('=== Checking Database Schema ===\n');
        // Check existing tables
        const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
        console.log('Existing tables:');
        tablesResult.rows.forEach(row => {
            console.log(`  - ${row.table_name}`);
        });
        console.log('\n=== Table Structures ===\n');
        // Check structure of each table
        for (const table of tablesResult.rows) {
            const tableName = table.table_name;
            const columnsResult = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `, [tableName]);
            console.log(`Table: ${tableName}`);
            columnsResult.rows.forEach(col => {
                console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
            });
            console.log('');
        }
        // Check if schema_migrations table exists
        const migrationTableResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'schema_migrations'
      );
    `);
        console.log(`Schema migrations table exists: ${migrationTableResult.rows[0].exists}`);
        if (migrationTableResult.rows[0].exists) {
            const appliedMigrations = await pool.query('SELECT version, applied_at FROM schema_migrations ORDER BY applied_at');
            console.log('\nApplied migrations:');
            appliedMigrations.rows.forEach(row => {
                console.log(`  - ${row.version} (${row.applied_at})`);
            });
        }
    }
    catch (error) {
        console.error('Error checking schema:', error);
    }
    finally {
        await pool.end();
    }
}
checkSchema();
//# sourceMappingURL=check-schema.js.map