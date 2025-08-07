import sql from 'mssql';

export interface DatabaseConfig {
  server: string;
  database: string;
  user?: string;
  password?: string;
  connectionTimeout?: number;
  commandTimeout?: number;
  trustServerCertificate?: boolean;
  encrypt?: boolean;
}

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: sql.ConnectionPool | null = null;
  private config: DatabaseConfig;

  private constructor(config: DatabaseConfig) {
    this.config = config;
  }

  public static getInstance(config: DatabaseConfig): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection(config);
    } else if (DatabaseConnection.instance.config.database !== config.database) {
      // 如果数据库名称改变，创建新实例
      DatabaseConnection.instance = new DatabaseConnection(config);
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    try {
      const sqlConfig: sql.config = {
        server: this.config.server,
        database: this.config.database,
        options: {
          encrypt: this.config.encrypt ?? false,
          trustServerCertificate: this.config.trustServerCertificate ?? true,
          connectTimeout: (this.config.connectionTimeout ?? 30) * 1000,
          requestTimeout: (this.config.commandTimeout ?? 30) * 1000,
        }
      };

      if (this.config.user && this.config.password) {
        sqlConfig.user = this.config.user;
        sqlConfig.password = this.config.password;
      } else {
        sqlConfig.options!.trustedConnection = true;
      }

      this.pool = await sql.connect(sqlConfig);
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
      console.log('Database disconnected');
    }
  }

  public getCurrentDatabase(): string {
    return this.config.database;
  }

  public async executeQuery(query: string, params?: any[]): Promise<sql.IResult<any>> {
    if (!this.pool) {
      throw new Error('Database not connected');
    }

    try {
      const request = this.pool.request();
      
      if (params && params.length > 0) {
        params.forEach((param, index) => {
          // 处理不同类型的参数
          if (param === null || param === undefined) {
            request.input(`param${index}`, sql.NVarChar, null);
          } else if (typeof param === 'string') {
            request.input(`param${index}`, sql.NVarChar, param);
          } else if (typeof param === 'number') {
            if (Number.isInteger(param)) {
              request.input(`param${index}`, sql.Int, param);
            } else {
              request.input(`param${index}`, sql.Float, param);
            }
          } else if (typeof param === 'boolean') {
            request.input(`param${index}`, sql.Bit, param);
          } else if (param instanceof Date) {
            request.input(`param${index}`, sql.DateTime, param);
          } else {
            request.input(`param${index}`, sql.NVarChar, String(param));
          }
        });
      }

      return await request.query(query);
    } catch (error) {
      console.error('Query execution failed:', error);
      throw error;
    }
  }

  public async executeStoredProcedure(procedureName: string, params?: any[]): Promise<sql.IResult<any>> {
    if (!this.pool) {
      throw new Error('Database not connected');
    }

    try {
      const request = this.pool.request();
      
      if (params) {
        params.forEach((param, index) => {
          request.input(`param${index}`, param);
        });
      }

      return await request.execute(procedureName);
    } catch (error) {
      console.error('Stored procedure execution failed:', error);
      throw error;
    }
  }

  public async beginTransaction(): Promise<sql.Transaction> {
    if (!this.pool) {
      throw new Error('Database not connected');
    }
    return this.pool.transaction();
  }

  public isConnected(): boolean {
    return this.pool !== null && this.pool.connected;
  }
} 