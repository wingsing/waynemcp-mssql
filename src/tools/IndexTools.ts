import { DatabaseConnection } from '../database/connection.js';

export class IndexTools {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  async createIndex(indexName: string, tableName: string, columns: string[], isUnique: boolean = false): Promise<any> {
    const uniqueClause = isUnique ? 'UNIQUE' : '';
    const createIndexSQL = `
      CREATE ${uniqueClause} INDEX ${indexName} 
      ON ${tableName} (${columns.join(', ')})
    `;

    try {
      const result = await this.db.executeQuery(createIndexSQL);
      return {
        success: true,
        message: `Index '${indexName}' created successfully on table '${tableName}'`,
        result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create index '${indexName}': ${error}`,
        error
      };
    }
  }

  async dropIndex(indexName: string, tableName: string): Promise<any> {
    const dropIndexSQL = `DROP INDEX ${indexName} ON ${tableName}`;

    try {
      const result = await this.db.executeQuery(dropIndexSQL);
      return {
        success: true,
        message: `Index '${indexName}' dropped successfully from table '${tableName}'`,
        result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to drop index '${indexName}': ${error}`,
        error
      };
    }
  }

  async listIndexes(tableName?: string): Promise<any> {
    let listIndexesSQL = `
      SELECT 
        t.name AS TableName,
        i.name AS IndexName,
        i.is_unique AS IsUnique,
        i.is_primary_key AS IsPrimaryKey,
        STUFF((
          SELECT ', ' + c.name
          FROM sys.index_columns ic
          JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
          WHERE ic.object_id = i.object_id AND ic.index_id = i.index_id
          ORDER BY ic.key_ordinal
          FOR XML PATH('')
        ), 1, 2, '') AS Columns
      FROM sys.indexes i
      JOIN sys.tables t ON i.object_id = t.object_id
      WHERE i.name IS NOT NULL
    `;

    if (tableName) {
      listIndexesSQL += ` AND t.name = '${tableName}'`;
    }

    listIndexesSQL += ` ORDER BY t.name, i.name`;

    try {
      const result = await this.db.executeQuery(listIndexesSQL);
      return {
        success: true,
        indexes: result.recordset,
        count: result.recordset.length
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to list indexes: ${error}`,
        error
      };
    }
  }
} 