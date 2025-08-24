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
async function checkBeneficiariesTable() {
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
    }
    catch (error) {
        console.error('Error checking beneficiaries table:', error);
    }
    finally {
        await pool.end();
    }
}
checkBeneficiariesTable();
//# sourceMappingURL=check-beneficiaries.js.map