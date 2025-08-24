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
exports.MigrationManager = void 0;
const pg_1 = require("pg");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
// Load environment variables
dotenv.config();
class MigrationManager {
    pool;
    migrationsDir;
    constructor() {
        // Use Supabase connection if available, otherwise fallback to local
        if (process.env.POSTGRES_URL) {
            this.pool = new pg_1.Pool({
                connectionString: process.env.POSTGRES_URL,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
            });
        }
        else {
            this.pool = new pg_1.Pool({
                user: process.env.DB_USER || process.env.POSTGRES_USER || 'postgres',
                host: process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost',
                database: process.env.DB_NAME || process.env.POSTGRES_DATABASE || 'kafkasder_portal',
                password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'password',
                port: parseInt(process.env.DB_PORT || '5432'),
            });
        }
        this.migrationsDir = path.join(__dirname, 'migrations');
    }
    async ensureMigrationsTable() {
        const query = `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
        try {
            await this.pool.query(query);
            console.log('✓ Migration table ensured');
        }
        catch (error) {
            console.error('Error ensuring migrations table:', error);
            throw error;
        }
    }
    async getAppliedMigrations() {
        try {
            const result = await this.pool.query('SELECT version FROM schema_migrations ORDER BY version');
            return result.rows.map(row => row.version);
        }
        catch (error) {
            console.error('Error getting applied migrations:', error);
            return [];
        }
    }
    async getPendingMigrations() {
        const appliedMigrations = await this.getAppliedMigrations();
        const allMigrations = this.getAllMigrations();
        return allMigrations.filter(migration => !appliedMigrations.includes(migration.version));
    }
    getAllMigrations() {
        if (!fs.existsSync(this.migrationsDir)) {
            console.log('Migrations directory does not exist');
            return [];
        }
        const files = fs.readdirSync(this.migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();
        return files.map(filename => {
            const version = filename.replace('.sql', '');
            const content = fs.readFileSync(path.join(this.migrationsDir, filename), 'utf8');
            return { version, filename, content };
        });
    }
    async applyMigration(migration) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            console.log(`Applying migration: ${migration.version}`);
            // Execute migration SQL
            await client.query(migration.content);
            // Record migration as applied
            await client.query('INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING', [migration.version]);
            await client.query('COMMIT');
            console.log(`✓ Migration ${migration.version} applied successfully`);
        }
        catch (error) {
            await client.query('ROLLBACK');
            console.error(`✗ Error applying migration ${migration.version}:`, error);
            throw error;
        }
        finally {
            client.release();
        }
    }
    async rollbackMigration(version) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            console.log(`Rolling back migration: ${version}`);
            // Remove migration record
            await client.query('DELETE FROM schema_migrations WHERE version = $1', [version]);
            await client.query('COMMIT');
            console.log(`✓ Migration ${version} rolled back successfully`);
            console.log('Note: You may need to manually revert database changes');
        }
        catch (error) {
            await client.query('ROLLBACK');
            console.error(`✗ Error rolling back migration ${version}:`, error);
            throw error;
        }
        finally {
            client.release();
        }
    }
    async migrate() {
        try {
            await this.ensureMigrationsTable();
            const pendingMigrations = await this.getPendingMigrations();
            if (pendingMigrations.length === 0) {
                console.log('✓ No pending migrations');
                return;
            }
            console.log(`Found ${pendingMigrations.length} pending migration(s)`);
            for (const migration of pendingMigrations) {
                await this.applyMigration(migration);
            }
            console.log('✓ All migrations applied successfully');
        }
        catch (error) {
            console.error('Migration failed:', error);
            throw error;
        }
    }
    async status() {
        try {
            await this.ensureMigrationsTable();
            const appliedMigrations = await this.getAppliedMigrations();
            const allMigrations = this.getAllMigrations();
            const pendingMigrations = await this.getPendingMigrations();
            console.log('\n=== Migration Status ===');
            console.log(`Total migrations: ${allMigrations.length}`);
            console.log(`Applied: ${appliedMigrations.length}`);
            console.log(`Pending: ${pendingMigrations.length}`);
            if (appliedMigrations.length > 0) {
                console.log('\nApplied migrations:');
                appliedMigrations.forEach(version => {
                    console.log(`  ✓ ${version}`);
                });
            }
            if (pendingMigrations.length > 0) {
                console.log('\nPending migrations:');
                pendingMigrations.forEach(migration => {
                    console.log(`  ○ ${migration.version}`);
                });
            }
        }
        catch (error) {
            console.error('Error getting migration status:', error);
            throw error;
        }
    }
    async close() {
        await this.pool.end();
    }
}
exports.MigrationManager = MigrationManager;
// CLI interface
async function main() {
    const command = process.argv[2];
    const migrationManager = new MigrationManager();
    try {
        switch (command) {
            case 'migrate':
            case 'up':
                await migrationManager.migrate();
                break;
            case 'status':
                await migrationManager.status();
                break;
            case 'rollback':
                const version = process.argv[3];
                if (!version) {
                    console.error('Please specify migration version to rollback');
                    process.exit(1);
                }
                await migrationManager.rollbackMigration(version);
                break;
            default:
                console.log('Usage:');
                console.log('  npm run migrate        - Apply pending migrations');
                console.log('  npm run migrate:status - Show migration status');
                console.log('  npm run migrate:rollback <version> - Rollback specific migration');
                break;
        }
    }
    catch (error) {
        console.error('Migration command failed:', error);
        process.exit(1);
    }
    finally {
        await migrationManager.close();
    }
}
// Run if called directly
if (require.main === module) {
    main();
}
//# sourceMappingURL=migrate.js.map