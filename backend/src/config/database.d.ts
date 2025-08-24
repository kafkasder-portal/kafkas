import { Pool } from 'pg';
declare const pool: Pool;
export declare const initializeDatabase: () => Promise<boolean>;
export declare const query: (text: string, params?: any[]) => Promise<import("pg").QueryResult<any>>;
export declare const getClient: () => Promise<import("pg").PoolClient>;
export default pool;
//# sourceMappingURL=database.d.ts.map