/**
 * Database Abstraction Layer for CoastalConnect
 * Provides database-agnostic interface for switching between Supabase and SQL Server
 * 
 * Usage:
 * 1. Set DB_TYPE environment variable to 'supabase' or 'sqlserver'
 * 2. Configure respective connection settings
 * 3. Use DatabaseService methods throughout the application
 */

import { createClient } from '@supabase/supabase-js';
import sql from 'mssql';

// Type definitions for database abstraction
export interface DatabaseConfig {
  type: 'supabase' | 'sqlserver';
  supabase?: {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
  };
  sqlserver?: {
    server: string;
    database: string;
    user: string;
    password: string;
    port?: number;
    encrypt?: boolean;
    trustServerCertificate?: boolean;
  };
}

export interface QueryResult<T = any> {
  data: T[] | null;
  error: Error | null;
  count?: number;
}

export interface InsertResult<T = any> {
  data: T | null;
  error: Error | null;
}

export interface UpdateResult<T = any> {
  data: T[] | null;
  error: Error | null;
  count?: number;
}

export interface DeleteResult {
  data: any | null;
  error: Error | null;
  count?: number;
}

// Base database interface
export interface DatabaseAdapter {
  // Connection management
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;

  // CRUD operations
  select<T>(table: string, options?: SelectOptions): Promise<QueryResult<T>>;
  insert<T>(table: string, data: any): Promise<InsertResult<T>>;
  update<T>(table: string, data: any, where: any): Promise<UpdateResult<T>>;
  delete(table: string, where: any): Promise<DeleteResult>;

  // Raw query execution
  query<T>(sql: string, params?: any[]): Promise<QueryResult<T>>;

  // Transaction support
  transaction<T>(fn: (tx: DatabaseAdapter) => Promise<T>): Promise<T>;

  // File upload (for media assets)
  uploadFile(bucket: string, path: string, file: Buffer, metadata?: any): Promise<{ url: string; error?: Error }>;
  deleteFile(bucket: string, path: string): Promise<{ error?: Error }>;
  getFileUrl(bucket: string, path: string): string;
}

export interface SelectOptions {
  select?: string;
  where?: any;
  orderBy?: string;
  limit?: number;
  offset?: number;
  join?: string[];
}

// Supabase adapter implementation
class SupabaseAdapter implements DatabaseAdapter {
  private supabase: any;
  private connected = false;

  constructor(private config: DatabaseConfig['supabase']) {
    if (!config) throw new Error('Supabase configuration required');
  }

  async connect(): Promise<void> {
    try {
      this.supabase = createClient(this.config!.url, this.config!.serviceRoleKey);
      this.connected = true;
    } catch (error) {
      throw new Error(`Failed to connect to Supabase: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async select<T>(table: string, options: SelectOptions = {}): Promise<QueryResult<T>> {
    try {
      let query = this.supabase.from(table);

      if (options.select) {
        query = query.select(options.select);
      } else {
        query = query.select('*');
      }

      if (options.where) {
        Object.entries(options.where).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else if (typeof value === 'object' && value !== null) {
            // Handle complex operators like gte, lte, etc.
            Object.entries(value).forEach(([op, val]) => {
              query = query[op](key, val);
            });
          } else {
            query = query.eq(key, value);
          }
        });
      }

      if (options.orderBy) {
        const [column, direction] = options.orderBy.split(' ');
        query = query.order(column, { ascending: direction !== 'desc' });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 100) - 1);
      }

      const { data, error, count } = await query;
      return { data, error, count };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async insert<T>(table: string, data: any): Promise<InsertResult<T>> {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .insert(data)
        .select()
        .single();
      
      return { data: result, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async update<T>(table: string, data: any, where: any): Promise<UpdateResult<T>> {
    try {
      let query = this.supabase.from(table).update(data);

      Object.entries(where).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { data: result, error, count } = await query.select();
      return { data: result, error, count };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async delete(table: string, where: any): Promise<DeleteResult> {
    try {
      let query = this.supabase.from(table);

      Object.entries(where).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { data, error, count } = await query.delete();
      return { data, error, count };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async query<T>(sqlQuery: string, params: any[] = []): Promise<QueryResult<T>> {
    try {
      // Supabase uses stored procedures for complex queries
      const { data, error } = await this.supabase.rpc('execute_sql', {
        query: sqlQuery,
        params: params
      });
      
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async transaction<T>(fn: (tx: DatabaseAdapter) => Promise<T>): Promise<T> {
    // Supabase doesn't support explicit transactions in the same way
    // Use RLS policies and atomic operations instead
    return await fn(this);
  }

  async uploadFile(bucket: string, path: string, file: Buffer, metadata: any = {}): Promise<{ url: string; error?: Error }> {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(path, file, {
          contentType: metadata.contentType,
          metadata: metadata
        });

      if (error) throw error;

      const { data: { publicUrl } } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return { url: publicUrl };
    } catch (error) {
      return { url: '', error: error as Error };
    }
  }

  async deleteFile(bucket: string, path: string): Promise<{ error?: Error }> {
    try {
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([path]);

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }

  getFileUrl(bucket: string, path: string): string {
    const { data: { publicUrl } } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  }
}

// SQL Server adapter implementation
class SqlServerAdapter implements DatabaseAdapter {
  private pool: sql.ConnectionPool | null = null;
  private connected = false;

  constructor(private config: DatabaseConfig['sqlserver']) {
    if (!config) throw new Error('SQL Server configuration required');
  }

  async connect(): Promise<void> {
    try {
      this.pool = new sql.ConnectionPool({
        server: this.config!.server,
        database: this.config!.database,
        user: this.config!.user,
        password: this.config!.password,
        port: this.config!.port || 1433,
        options: {
          encrypt: this.config!.encrypt || true,
          trustServerCertificate: this.config!.trustServerCertificate || false,
        }
      });

      await this.pool.connect();
      this.connected = true;
    } catch (error) {
      throw new Error(`Failed to connect to SQL Server: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      this.connected = false;
    }
  }

  isConnected(): boolean {
    return this.connected && this.pool !== null;
  }

  async select<T>(table: string, options: SelectOptions = {}): Promise<QueryResult<T>> {
    try {
      if (!this.pool) throw new Error('Database not connected');

      let query = `SELECT ${options.select || '*'} FROM ${table}`;
      const params: any[] = [];
      let paramIndex = 1;

      if (options.where) {
        const whereConditions: string[] = [];
        Object.entries(options.where).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            const placeholders = value.map(() => `@param${paramIndex++}`).join(',');
            whereConditions.push(`${key} IN (${placeholders})`);
            params.push(...value);
          } else {
            whereConditions.push(`${key} = @param${paramIndex++}`);
            params.push(value);
          }
        });
        query += ` WHERE ${whereConditions.join(' AND ')}`;
      }

      if (options.orderBy) {
        query += ` ORDER BY ${options.orderBy}`;
      }

      if (options.limit) {
        query += ` OFFSET ${options.offset || 0} ROWS FETCH NEXT ${options.limit} ROWS ONLY`;
      }

      const request = this.pool.request();
      params.forEach((param, index) => {
        request.input(`param${index + 1}`, param);
      });

      const result = await request.query(query);
      return { data: result.recordset, error: null, count: result.recordset.length };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async insert<T>(table: string, data: any): Promise<InsertResult<T>> {
    try {
      if (!this.pool) throw new Error('Database not connected');

      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = columns.map((_, index) => `@param${index + 1}`);

      const query = `
        INSERT INTO ${table} (${columns.join(', ')})
        OUTPUT INSERTED.*
        VALUES (${placeholders.join(', ')})
      `;

      const request = this.pool.request();
      values.forEach((value, index) => {
        request.input(`param${index + 1}`, value);
      });

      const result = await request.query(query);
      return { data: result.recordset[0], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async update<T>(table: string, data: any, where: any): Promise<UpdateResult<T>> {
    try {
      if (!this.pool) throw new Error('Database not connected');

      const setColumns = Object.keys(data);
      const setValues = Object.values(data);
      const whereColumns = Object.keys(where);
      const whereValues = Object.values(where);

      const setClause = setColumns.map((col, index) => `${col} = @set${index + 1}`).join(', ');
      const whereClause = whereColumns.map((col, index) => `${col} = @where${index + 1}`).join(' AND ');

      const query = `
        UPDATE ${table}
        SET ${setClause}
        OUTPUT INSERTED.*
        WHERE ${whereClause}
      `;

      const request = this.pool.request();
      setValues.forEach((value, index) => {
        request.input(`set${index + 1}`, value);
      });
      whereValues.forEach((value, index) => {
        request.input(`where${index + 1}`, value);
      });

      const result = await request.query(query);
      return { data: result.recordset, error: null, count: result.recordset.length };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async delete(table: string, where: any): Promise<DeleteResult> {
    try {
      if (!this.pool) throw new Error('Database not connected');

      const whereColumns = Object.keys(where);
      const whereValues = Object.values(where);
      const whereClause = whereColumns.map((col, index) => `${col} = @param${index + 1}`).join(' AND ');

      const query = `DELETE FROM ${table} WHERE ${whereClause}`;

      const request = this.pool.request();
      whereValues.forEach((value, index) => {
        request.input(`param${index + 1}`, value);
      });

      const result = await request.query(query);
      return { data: null, error: null, count: result.rowsAffected[0] };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async query<T>(sqlQuery: string, params: any[] = []): Promise<QueryResult<T>> {
    try {
      if (!this.pool) throw new Error('Database not connected');

      const request = this.pool.request();
      params.forEach((param, index) => {
        request.input(`param${index + 1}`, param);
      });

      const result = await request.query(sqlQuery);
      return { data: result.recordset, error: null, count: result.recordset.length };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async transaction<T>(fn: (tx: DatabaseAdapter) => Promise<T>): Promise<T> {
    if (!this.pool) throw new Error('Database not connected');

    const transaction = new sql.Transaction(this.pool);
    await transaction.begin();

    try {
      // Create a transaction-aware adapter
      const txAdapter = new SqlServerTransactionAdapter(transaction);
      const result = await fn(txAdapter);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async uploadFile(bucket: string, path: string, file: Buffer, metadata: any = {}): Promise<{ url: string; error?: Error }> {
    try {
      // For SQL Server, we need to implement file storage separately
      // This could be Azure Blob Storage, local file system, or other storage service
      
      // Insert file metadata into media_assets table
      const fileData = {
        filename: path.split('/').pop(),
        original_name: metadata.originalName || path.split('/').pop(),
        file_type: metadata.contentType,
        file_size: file.length,
        storage_path: path,
        public_url: `/uploads/${bucket}/${path}`,
        alt_text: metadata.altText,
        caption: metadata.caption,
        metadata: JSON.stringify(metadata),
        uploaded_by: metadata.uploadedBy
      };

      const result = await this.insert('media_assets', fileData);
      
      if (result.error) {
        throw result.error;
      }

      // In a real implementation, you would save the file to your storage service here
      // For now, return a placeholder URL
      return { url: fileData.public_url };
    } catch (error) {
      return { url: '', error: error as Error };
    }
  }

  async deleteFile(bucket: string, path: string): Promise<{ error?: Error }> {
    try {
      // Delete from media_assets table
      await this.delete('media_assets', { storage_path: path });
      
      // In a real implementation, you would also delete from your storage service here
      
      return {};
    } catch (error) {
      return { error: error as Error };
    }
  }

  getFileUrl(bucket: string, path: string): string {
    // Return the public URL for the file
    return `/uploads/${bucket}/${path}`;
  }
}

// Transaction-aware SQL Server adapter
class SqlServerTransactionAdapter implements DatabaseAdapter {
  constructor(private transaction: sql.Transaction) {}

  async connect(): Promise<void> {
    // Already connected through transaction
  }

  async disconnect(): Promise<void> {
    // Managed by parent adapter
  }

  isConnected(): boolean {
    return true;
  }

  async select<T>(table: string, options: SelectOptions = {}): Promise<QueryResult<T>> {
    // Implementation similar to SqlServerAdapter but using transaction.request()
    try {
      let query = `SELECT ${options.select || '*'} FROM ${table}`;
      const params: any[] = [];
      let paramIndex = 1;

      if (options.where) {
        const whereConditions: string[] = [];
        Object.entries(options.where).forEach(([key, value]) => {
          whereConditions.push(`${key} = @param${paramIndex++}`);
          params.push(value);
        });
        query += ` WHERE ${whereConditions.join(' AND ')}`;
      }

      const request = this.transaction.request();
      params.forEach((param, index) => {
        request.input(`param${index + 1}`, param);
      });

      const result = await request.query(query);
      return { data: result.recordset, error: null, count: result.recordset.length };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async insert<T>(table: string, data: any): Promise<InsertResult<T>> {
    try {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = columns.map((_, index) => `@param${index + 1}`);

      const query = `
        INSERT INTO ${table} (${columns.join(', ')})
        OUTPUT INSERTED.*
        VALUES (${placeholders.join(', ')})
      `;

      const request = this.transaction.request();
      values.forEach((value, index) => {
        request.input(`param${index + 1}`, value);
      });

      const result = await request.query(query);
      return { data: result.recordset[0], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async update<T>(table: string, data: any, where: any): Promise<UpdateResult<T>> {
    // Similar implementation using transaction.request()
    try {
      const setColumns = Object.keys(data);
      const setValues = Object.values(data);
      const whereColumns = Object.keys(where);
      const whereValues = Object.values(where);

      const setClause = setColumns.map((col, index) => `${col} = @set${index + 1}`).join(', ');
      const whereClause = whereColumns.map((col, index) => `${col} = @where${index + 1}`).join(' AND ');

      const query = `
        UPDATE ${table}
        SET ${setClause}
        OUTPUT INSERTED.*
        WHERE ${whereClause}
      `;

      const request = this.transaction.request();
      setValues.forEach((value, index) => {
        request.input(`set${index + 1}`, value);
      });
      whereValues.forEach((value, index) => {
        request.input(`where${index + 1}`, value);
      });

      const result = await request.query(query);
      return { data: result.recordset, error: null, count: result.recordset.length };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async delete(table: string, where: any): Promise<DeleteResult> {
    try {
      const whereColumns = Object.keys(where);
      const whereValues = Object.values(where);
      const whereClause = whereColumns.map((col, index) => `${col} = @param${index + 1}`).join(' AND ');

      const query = `DELETE FROM ${table} WHERE ${whereClause}`;

      const request = this.transaction.request();
      whereValues.forEach((value, index) => {
        request.input(`param${index + 1}`, value);
      });

      const result = await request.query(query);
      return { data: null, error: null, count: result.rowsAffected[0] };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async query<T>(sqlQuery: string, params: any[] = []): Promise<QueryResult<T>> {
    try {
      const request = this.transaction.request();
      params.forEach((param, index) => {
        request.input(`param${index + 1}`, param);
      });

      const result = await request.query(sqlQuery);
      return { data: result.recordset, error: null, count: result.recordset.length };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async transaction<T>(fn: (tx: DatabaseAdapter) => Promise<T>): Promise<T> {
    // Nested transactions not supported, use current transaction
    return await fn(this);
  }

  async uploadFile(bucket: string, path: string, file: Buffer, metadata: any = {}): Promise<{ url: string; error?: Error }> {
    // Use the same implementation as SqlServerAdapter but with transaction
    return { url: `/uploads/${bucket}/${path}` };
  }

  async deleteFile(bucket: string, path: string): Promise<{ error?: Error }> {
    return {};
  }

  getFileUrl(bucket: string, path: string): string {
    return `/uploads/${bucket}/${path}`;
  }
}

// Main Database Service
class DatabaseService {
  private adapter: DatabaseAdapter;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
    
    if (config.type === 'supabase') {
      this.adapter = new SupabaseAdapter(config.supabase);
    } else if (config.type === 'sqlserver') {
      this.adapter = new SqlServerAdapter(config.sqlserver);
    } else {
      throw new Error(`Unsupported database type: ${config.type}`);
    }
  }

  async initialize(): Promise<void> {
    await this.adapter.connect();
  }

  async shutdown(): Promise<void> {
    await this.adapter.disconnect();
  }

  // Expose adapter methods
  async select<T>(table: string, options?: SelectOptions): Promise<QueryResult<T>> {
    return this.adapter.select<T>(table, options);
  }

  async insert<T>(table: string, data: any): Promise<InsertResult<T>> {
    return this.adapter.insert<T>(table, data);
  }

  async update<T>(table: string, data: any, where: any): Promise<UpdateResult<T>> {
    return this.adapter.update<T>(table, data, where);
  }

  async delete(table: string, where: any): Promise<DeleteResult> {
    return this.adapter.delete(table, where);
  }

  async query<T>(sql: string, params?: any[]): Promise<QueryResult<T>> {
    return this.adapter.query<T>(sql, params);
  }

  async transaction<T>(fn: (tx: DatabaseAdapter) => Promise<T>): Promise<T> {
    return this.adapter.transaction<T>(fn);
  }

  async uploadFile(bucket: string, path: string, file: Buffer, metadata?: any): Promise<{ url: string; error?: Error }> {
    return this.adapter.uploadFile(bucket, path, file, metadata);
  }

  async deleteFile(bucket: string, path: string): Promise<{ error?: Error }> {
    return this.adapter.deleteFile(bucket, path);
  }

  getFileUrl(bucket: string, path: string): string {
    return this.adapter.getFileUrl(bucket, path);
  }

  isConnected(): boolean {
    return this.adapter.isConnected();
  }

  getType(): 'supabase' | 'sqlserver' {
    return this.config.type;
  }
}

// Configuration factory
export function createDatabaseConfig(): DatabaseConfig {
  const dbType = process.env.DB_TYPE as 'supabase' | 'sqlserver';
  
  if (!dbType) {
    throw new Error('DB_TYPE environment variable must be set to "supabase" or "sqlserver"');
  }

  if (dbType === 'supabase') {
    return {
      type: 'supabase',
      supabase: {
        url: process.env.SUPABASE_URL!,
        anonKey: process.env.SUPABASE_ANON_KEY!,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!
      }
    };
  } else if (dbType === 'sqlserver') {
    return {
      type: 'sqlserver',
      sqlserver: {
        server: process.env.SQLSERVER_HOST!,
        database: process.env.SQLSERVER_DATABASE!,
        user: process.env.SQLSERVER_USER!,
        password: process.env.SQLSERVER_PASSWORD!,
        port: parseInt(process.env.SQLSERVER_PORT || '1433'),
        encrypt: process.env.SQLSERVER_ENCRYPT === 'true',
        trustServerCertificate: process.env.SQLSERVER_TRUST_CERT === 'true'
      }
    };
  }

  throw new Error(`Unsupported database type: ${dbType}`);
}

// Singleton instance
let databaseService: DatabaseService | null = null;

export function getDatabaseService(): DatabaseService {
  if (!databaseService) {
    const config = createDatabaseConfig();
    databaseService = new DatabaseService(config);
  }
  return databaseService;
}

export default DatabaseService;
export { DatabaseService };
