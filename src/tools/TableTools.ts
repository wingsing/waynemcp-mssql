import { DatabaseConnection } from '../database/connection.js';

export class TableTools {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  async createTable(tableName: string, columns: string[]): Promise<any> {
    const createTableSQL = `
      CREATE TABLE ${tableName} (
        ${columns.join(',\n        ')}
      )
    `;

    try {
      const result = await this.db.executeQuery(createTableSQL);
      return {
        success: true,
        message: `Table '${tableName}' created successfully`,
        result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create table '${tableName}': ${error}`,
        error
      };
    }
  }

  async dropTable(tableName: string): Promise<any> {
    const dropTableSQL = `DROP TABLE IF EXISTS ${tableName}`;

    try {
      const result = await this.db.executeQuery(dropTableSQL);
      return {
        success: true,
        message: `Table '${tableName}' dropped successfully`,
        result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to drop table '${tableName}': ${error}`,
        error
      };
    }
  }

  async renameTable(oldTableName: string, newTableName: string): Promise<any> {
    const renameTableSQL = `EXEC sp_rename '${oldTableName}', '${newTableName}'`;

    try {
      const result = await this.db.executeQuery(renameTableSQL);
      return {
        success: true,
        message: `Table '${oldTableName}' renamed to '${newTableName}' successfully`,
        result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to rename table '${oldTableName}' to '${newTableName}': ${error}`,
        error
      };
    }
  }

  async addColumn(tableName: string, columnName: string, columnDefinition: string): Promise<any> {
    const addColumnSQL = `ALTER TABLE ${tableName} ADD ${columnName} ${columnDefinition}`;

    try {
      const result = await this.db.executeQuery(addColumnSQL);
      return {
        success: true,
        message: `Column '${columnName}' added to table '${tableName}' successfully`,
        result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to add column '${columnName}' to table '${tableName}': ${error}`,
        error
      };
    }
  }

  async dropColumn(tableName: string, columnName: string): Promise<any> {
    const dropColumnSQL = `ALTER TABLE ${tableName} DROP COLUMN ${columnName}`;

    try {
      const result = await this.db.executeQuery(dropColumnSQL);
      return {
        success: true,
        message: `Column '${columnName}' dropped from table '${tableName}' successfully`,
        result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to drop column '${columnName}' from table '${tableName}': ${error}`,
        error
      };
    }
  }

  async modifyColumn(tableName: string, columnName: string, newColumnDefinition: string): Promise<any> {
    // SQL Server中修改列需要使用ALTER COLUMN
    const modifyColumnSQL = `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} ${newColumnDefinition}`;

    try {
      const result = await this.db.executeQuery(modifyColumnSQL);
      return {
        success: true,
        message: `Column '${columnName}' in table '${tableName}' modified successfully`,
        result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to modify column '${columnName}' in table '${tableName}': ${error}`,
        error
      };
    }
  }

  async renameColumn(tableName: string, oldColumnName: string, newColumnName: string): Promise<any> {
    const renameColumnSQL = `EXEC sp_rename '${tableName}.${oldColumnName}', '${newColumnName}', 'COLUMN'`;

    try {
      const result = await this.db.executeQuery(renameColumnSQL);
      return {
        success: true,
        message: `Column '${oldColumnName}' renamed to '${newColumnName}' in table '${tableName}' successfully`,
        result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to rename column '${oldColumnName}' to '${newColumnName}' in table '${tableName}': ${error}`,
        error
      };
    }
  }

  async addConstraint(tableName: string, constraintName: string, constraintDefinition: string): Promise<any> {
    const addConstraintSQL = `ALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} ${constraintDefinition}`;

    try {
      const result = await this.db.executeQuery(addConstraintSQL);
      return {
        success: true,
        message: `Constraint '${constraintName}' added to table '${tableName}' successfully`,
        result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to add constraint '${constraintName}' to table '${tableName}': ${error}`,
        error
      };
    }
  }

  async dropConstraint(tableName: string, constraintName: string): Promise<any> {
    const dropConstraintSQL = `ALTER TABLE ${tableName} DROP CONSTRAINT ${constraintName}`;

    try {
      const result = await this.db.executeQuery(dropConstraintSQL);
      return {
        success: true,
        message: `Constraint '${constraintName}' dropped from table '${tableName}' successfully`,
        result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to drop constraint '${constraintName}' from table '${tableName}': ${error}`,
        error
      };
    }
  }

  async listTables(): Promise<any> {
    const listTablesSQL = `
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE' 
      ORDER BY TABLE_NAME
    `;

    try {
      const result = await this.db.executeQuery(listTablesSQL);
      return {
        success: true,
        tables: result.recordset.map(row => row.TABLE_NAME),
        count: result.recordset.length
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to list tables: ${error}`,
        error
      };
    }
  }

  async describeTable(tableName: string): Promise<any> {
    const describeTableSQL = `
      SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        COLUMN_DEFAULT,
        CHARACTER_MAXIMUM_LENGTH
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = '${tableName}'
      ORDER BY ORDINAL_POSITION
    `;

    try {
      const result = await this.db.executeQuery(describeTableSQL);
      return {
        success: true,
        tableName,
        columns: result.recordset,
        count: result.recordset.length
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to describe table '${tableName}': ${error}`,
        error
      };
    }
  }

  async getTableConstraints(tableName: string): Promise<any> {
    const constraintsSQL = `
      SELECT 
        CONSTRAINT_NAME,
        CONSTRAINT_TYPE,
        COLUMN_NAME
      FROM INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE
      WHERE TABLE_NAME = '${tableName}'
      ORDER BY CONSTRAINT_NAME
    `;

    try {
      const result = await this.db.executeQuery(constraintsSQL);
      return {
        success: true,
        tableName,
        constraints: result.recordset,
        count: result.recordset.length
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to get constraints for table '${tableName}': ${error}`,
        error
      };
    }
  }
} 