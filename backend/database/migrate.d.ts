interface Migration {
    version: string;
    filename: string;
    content: string;
}
declare class MigrationManager {
    private pool;
    private migrationsDir;
    constructor();
    ensureMigrationsTable(): Promise<void>;
    getAppliedMigrations(): Promise<string[]>;
    getPendingMigrations(): Promise<Migration[]>;
    getAllMigrations(): Migration[];
    applyMigration(migration: Migration): Promise<void>;
    rollbackMigration(version: string): Promise<void>;
    migrate(): Promise<void>;
    status(): Promise<void>;
    close(): Promise<void>;
}
export { MigrationManager };
//# sourceMappingURL=migrate.d.ts.map