import { DatabaseConnection } from '../database/connection.js';
import * as fs from 'fs';
import * as path from 'path';

export class DatabaseTools {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  async listDatabases(): Promise<any> {
    const listDatabasesSQL = `
      SELECT 
        name,
        database_id,
        create_date,
        state_desc,
        recovery_model_desc
      FROM sys.databases 
      ORDER BY name
    `;

    try {
      const result = await this.db.executeQuery(listDatabasesSQL);
      return {
        success: true,
        databases: result.recordset,
        count: result.recordset.length
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to list databases: ${error}`,
        error
      };
    }
  }

  async listUsers(): Promise<any> {
    const listUsersSQL = `
      SELECT 
        name,
        type_desc,
        create_date,
        is_disabled
      FROM sys.database_principals 
      WHERE type IN ('S', 'U', 'G')
      ORDER BY name
    `;

    try {
      const result = await this.db.executeQuery(listUsersSQL);
      return {
        success: true,
        users: result.recordset,
        count: result.recordset.length
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to list users: ${error}`,
        error
      };
    }
  }

  async listViews(): Promise<any> {
    const listViewsSQL = `
      SELECT 
        TABLE_SCHEMA,
        TABLE_NAME,
        VIEW_DEFINITION
      FROM INFORMATION_SCHEMA.VIEWS 
      ORDER BY TABLE_SCHEMA, TABLE_NAME
    `;

    try {
      const result = await this.db.executeQuery(listViewsSQL);
      return {
        success: true,
        views: result.recordset,
        count: result.recordset.length
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to list views: ${error}`,
        error
      };
    }
  }

  async listStoredProcedures(): Promise<any> {
    const listStoredProceduresSQL = `
      SELECT 
        ROUTINE_SCHEMA,
        ROUTINE_NAME,
        ROUTINE_TYPE,
        CREATED,
        LAST_ALTERED
      FROM INFORMATION_SCHEMA.ROUTINES 
      WHERE ROUTINE_TYPE = 'PROCEDURE'
      ORDER BY ROUTINE_SCHEMA, ROUTINE_NAME
    `;

    try {
      const result = await this.db.executeQuery(listStoredProceduresSQL);
      return {
        success: true,
        storedProcedures: result.recordset,
        count: result.recordset.length
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to list stored procedures: ${error}`,
        error
      };
    }
  }

  async listTriggers(): Promise<any> {
    const listTriggersSQL = `
      SELECT 
        t.name AS trigger_name,
        OBJECT_SCHEMA_NAME(t.parent_id) AS table_schema,
        OBJECT_NAME(t.parent_id) AS table_name,
        t.type_desc,
        t.is_disabled,
        t.create_date,
        t.modify_date
      FROM sys.triggers t
      ORDER BY table_schema, table_name, trigger_name
    `;

    try {
      const result = await this.db.executeQuery(listTriggersSQL);
      return {
        success: true,
        triggers: result.recordset,
        count: result.recordset.length
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to list triggers: ${error}`,
        error
      };
    }
  }

  async exportData(tableName: string, format: string = 'json', filePath?: string): Promise<any> {
    const exportDataSQL = `SELECT * FROM ${tableName}`;

    try {
      const result = await this.db.executeQuery(exportDataSQL);
      const data = result.recordset;

      if (format.toLowerCase() === 'json') {
        const jsonData = JSON.stringify(data, null, 2);
        
        if (filePath) {
          fs.writeFileSync(filePath, jsonData, 'utf8');
          return {
            success: true,
            message: `Data exported to JSON file: ${filePath}`,
            recordCount: data.length,
            filePath: filePath
          };
        } else {
          return {
            success: true,
            message: `Data exported to JSON format`,
            recordCount: data.length,
            data: jsonData
          };
        }
      } else if (format.toLowerCase() === 'csv') {
        if (!data || data.length === 0) {
          return {
            success: false,
            message: 'No data to export'
          };
        }

        // 生成CSV内容
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        
        for (const row of data) {
          const values = headers.map(header => {
            const value = row[header];
            // 处理包含逗号或引号的值
            if (value === null || value === undefined) {
              return '';
            }
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          });
          csvRows.push(values.join(','));
        }

        const csvContent = csvRows.join('\n');
        
        if (filePath) {
          fs.writeFileSync(filePath, csvContent, 'utf8');
          return {
            success: true,
            message: `Data exported to CSV file: ${filePath}`,
            recordCount: data.length,
            filePath: filePath
          };
        } else {
          return {
            success: true,
            message: `Data exported to CSV format`,
            recordCount: data.length,
            data: csvContent
          };
        }
      } else {
        return {
          success: false,
          message: `Unsupported format: ${format}. Supported formats: json, csv`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to export data from table '${tableName}': ${error}`,
        error
      };
    }
  }

  async importData(tableName: string, data: any[], format: string = 'json'): Promise<any> {
    if (!data || data.length === 0) {
      return {
        success: false,
        message: 'No data to import'
      };
    }

    try {
      // 获取表结构
      const describeSQL = `
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = '${tableName}'
        ORDER BY ORDINAL_POSITION
      `;
      
      const structureResult = await this.db.executeQuery(describeSQL);
      const columns = structureResult.recordset.map(col => col.COLUMN_NAME);

      // 开始事务
      await this.db.executeQuery('BEGIN TRANSACTION');

      let insertedCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const row of data) {
        try {
          // 过滤数据，只包含表中存在的列
          const filteredRow: any = {};
          for (const column of columns) {
            if (row.hasOwnProperty(column)) {
              filteredRow[column] = row[column];
            }
          }

          const columnNames = Object.keys(filteredRow);
          const columnValues = Object.values(filteredRow);
          const placeholders = columnValues.map(() => '?').join(', ');

          const insertSQL = `INSERT INTO ${tableName} (${columnNames.join(', ')}) VALUES (${placeholders})`;
          
          await this.db.executeQuery(insertSQL, columnValues);
          insertedCount++;
        } catch (rowError) {
          errorCount++;
          errors.push(`Row ${insertedCount + errorCount}: ${rowError}`);
        }
      }

      // 提交事务
      await this.db.executeQuery('COMMIT');

      return {
        success: true,
        message: `Data import completed`,
        insertedCount,
        errorCount,
        totalCount: data.length,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      // 回滚事务
      await this.db.executeQuery('ROLLBACK');
      
      return {
        success: false,
        message: `Failed to import data to table '${tableName}': ${error}`,
        error
      };
    }
  }

  async importDataFromFile(tableName: string, filePath: string, format: string = 'json'): Promise<any> {
    try {
      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          message: `File not found: ${filePath}`
        };
      }

      const fileContent = fs.readFileSync(filePath, 'utf8');
      let data: any[];

      if (format.toLowerCase() === 'json') {
        data = JSON.parse(fileContent);
      } else if (format.toLowerCase() === 'csv') {
        // 简单的CSV解析
        const lines = fileContent.split('\n').filter(line => line.trim());
        if (lines.length === 0) {
          return {
            success: false,
            message: 'CSV file is empty'
          };
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        data = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          const row: any = {};
          
          for (let j = 0; j < headers.length && j < values.length; j++) {
            row[headers[j]] = values[j];
          }
          
          data.push(row);
        }
      } else {
        return {
          success: false,
          message: `Unsupported format: ${format}. Supported formats: json, csv`
        };
      }

      return await this.importData(tableName, data, format);
    } catch (error) {
      return {
        success: false,
        message: `Failed to import data from file '${filePath}': ${error}`,
        error
      };
    }
  }
} 