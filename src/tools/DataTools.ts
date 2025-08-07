import { DatabaseConnection } from '../database/connection.js';

export class DataTools {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  async insertData(tableName: string, data: Record<string, any>): Promise<any> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `@param${index}`);

    const insertSQL = `
      INSERT INTO ${tableName} (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
    `;

    try {
      const result = await this.db.executeQuery(insertSQL, values);
      return {
        success: true,
        message: `Data inserted successfully into '${tableName}'`,
        rowsAffected: result.rowsAffected[0],
        result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to insert data into '${tableName}': ${error}`,
        error
      };
    }
  }

  async updateData(tableName: string, data: Record<string, any>, whereClause: string, whereParams?: any[]): Promise<any> {
    const setClause = Object.keys(data).map((key, index) => `${key} = @param${index}`).join(', ');
    const updateSQL = `
      UPDATE ${tableName} 
      SET ${setClause}
      WHERE ${whereClause}
    `;

    const allParams = [...Object.values(data), ...(whereParams || [])];

    try {
      const result = await this.db.executeQuery(updateSQL, allParams);
      return {
        success: true,
        message: `Data updated successfully in '${tableName}'`,
        rowsAffected: result.rowsAffected[0],
        result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to update data in '${tableName}': ${error}`,
        error
      };
    }
  }

  async deleteData(tableName: string, whereClause: string, params?: any[]): Promise<any> {
    const deleteSQL = `
      DELETE FROM ${tableName} 
      WHERE ${whereClause}
    `;

    try {
      const result = await this.db.executeQuery(deleteSQL, params);
      return {
        success: true,
        message: `Data deleted successfully from '${tableName}'`,
        rowsAffected: result.rowsAffected[0],
        result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to delete data from '${tableName}': ${error}`,
        error
      };
    }
  }

  async queryData(query: string, params?: any[]): Promise<any> {
    try {
      const result = await this.db.executeQuery(query, params);
      return {
        success: true,
        data: result.recordset,
        rowsAffected: result.rowsAffected[0],
        count: result.recordset.length
      };
    } catch (error) {
      return {
        success: false,
        message: `Query execution failed: ${error}`,
        error
      };
    }
  }

  async executeStoredProcedure(procedureName: string, params?: any[]): Promise<any> {
    try {
      const result = await this.db.executeStoredProcedure(procedureName, params);
      return {
        success: true,
        data: result.recordset,
        rowsAffected: result.rowsAffected[0],
        count: result.recordset.length
      };
    } catch (error) {
      return {
        success: false,
        message: `Stored procedure execution failed: ${error}`,
        error
      };
    }
  }

  async batchInsert(tableName: string, dataArray: Record<string, any>[]): Promise<any> {
    if (dataArray.length === 0) {
      return {
        success: false,
        message: 'No data provided for batch insert'
      };
    }

    // 逐个插入数据
    try {
      let insertedCount = 0;
      for (const data of dataArray) {
        const result = await this.insertData(tableName, data);
        if (result.success) {
          insertedCount++;
        }
      }
      
      return {
        success: true,
        message: `Batch insert completed successfully into '${tableName}'`,
        insertedCount: insertedCount
      };
    } catch (error) {
      return {
        success: false,
        message: `Batch insert failed: ${error}`,
        error
      };
    }
  }
} 