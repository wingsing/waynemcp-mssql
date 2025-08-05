import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { TableTools } from './TableTools.js';
import { IndexTools } from './IndexTools.js';
import { DataTools } from './DataTools.js';
import { DatabaseTools } from './DatabaseTools.js';

export function createTools(tableTools: TableTools, indexTools: IndexTools, dataTools: DataTools, databaseTools: DatabaseTools): Tool[] {
  return [
    {
      name: 'list_databases',
      description: 'List all databases in the SQL Server instance',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    {
      name: 'list_users',
      description: 'List all users in the current database',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    {
      name: 'list_views',
      description: 'List all views in the current database',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    {
      name: 'list_stored_procedures',
      description: 'List all stored procedures in the current database',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    {
      name: 'list_triggers',
      description: 'List all triggers in the current database',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    {
      name: 'export_data',
      description: 'Export data from a table to JSON or CSV format',
      inputSchema: {
        type: 'object',
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table to export data from'
          },
          format: {
            type: 'string',
            description: 'Export format: json or csv',
            default: 'json'
          },
          filePath: {
            type: 'string',
            description: 'Optional: File path to save the exported data'
          }
        },
        required: ['tableName']
      }
    },
    {
      name: 'import_data',
      description: 'Import data from JSON or CSV format to a table',
      inputSchema: {
        type: 'object',
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table to import data into'
          },
          data: {
            type: 'array',
            items: {
              type: 'object'
            },
            description: 'Array of data objects to import'
          },
          format: {
            type: 'string',
            description: 'Import format: json or csv',
            default: 'json'
          }
        },
        required: ['tableName', 'data']
      }
    },
    {
      name: 'import_data_from_file',
      description: 'Import data from a JSON or CSV file to a table',
      inputSchema: {
        type: 'object',
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table to import data into'
          },
          filePath: {
            type: 'string',
            description: 'Path to the file to import from'
          },
          format: {
            type: 'string',
            description: 'Import format: json or csv',
            default: 'json'
          }
        },
        required: ['tableName', 'filePath']
      }
    },
    {
      name: 'list_tables',
      description: 'List all tables in the database',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    {
      name: 'describe_table',
      description: 'Describe the structure of a specific table',
      inputSchema: {
        type: 'object',
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table to describe'
          }
        },
        required: ['tableName']
      }
    },
    {
      name: 'create_table',
      description: 'Create a new table with specified columns',
      inputSchema: {
        type: 'object',
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table to create'
          },
          columns: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Array of column definitions (e.g., ["Id INT PRIMARY KEY", "Name NVARCHAR(100)"])'
          }
        },
        required: ['tableName', 'columns']
      }
    },
    {
      name: 'drop_table',
      description: 'Drop a table from the database',
      inputSchema: {
        type: 'object',
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table to drop'
          }
        },
        required: ['tableName']
      }
    },
    {
      name: 'rename_table',
      description: 'Rename a table',
      inputSchema: {
        type: 'object',
        properties: {
          oldTableName: {
            type: 'string',
            description: 'Current name of the table'
          },
          newTableName: {
            type: 'string',
            description: 'New name for the table'
          }
        },
        required: ['oldTableName', 'newTableName']
      }
    },
    {
      name: 'add_column',
      description: 'Add a new column to an existing table',
      inputSchema: {
        type: 'object',
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table to add column to'
          },
          columnName: {
            type: 'string',
            description: 'Name of the new column'
          },
          columnDefinition: {
            type: 'string',
            description: 'Column definition (e.g., "NVARCHAR(100) NOT NULL", "INT DEFAULT 0")'
          }
        },
        required: ['tableName', 'columnName', 'columnDefinition']
      }
    },
    {
      name: 'drop_column',
      description: 'Drop a column from an existing table',
      inputSchema: {
        type: 'object',
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table to drop column from'
          },
          columnName: {
            type: 'string',
            description: 'Name of the column to drop'
          }
        },
        required: ['tableName', 'columnName']
      }
    },
    {
      name: 'modify_column',
      description: 'Modify an existing column in a table',
      inputSchema: {
        type: 'object',
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table containing the column'
          },
          columnName: {
            type: 'string',
            description: 'Name of the column to modify'
          },
          newColumnDefinition: {
            type: 'string',
            description: 'New column definition (e.g., "NVARCHAR(200)", "INT NOT NULL")'
          }
        },
        required: ['tableName', 'columnName', 'newColumnDefinition']
      }
    },
    {
      name: 'rename_column',
      description: 'Rename a column in a table',
      inputSchema: {
        type: 'object',
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table containing the column'
          },
          oldColumnName: {
            type: 'string',
            description: 'Current name of the column'
          },
          newColumnName: {
            type: 'string',
            description: 'New name for the column'
          }
        },
        required: ['tableName', 'oldColumnName', 'newColumnName']
      }
    },
    {
      name: 'add_constraint',
      description: 'Add a constraint to a table',
      inputSchema: {
        type: 'object',
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table to add constraint to'
          },
          constraintName: {
            type: 'string',
            description: 'Name of the constraint'
          },
          constraintDefinition: {
            type: 'string',
            description: 'Constraint definition (e.g., "PRIMARY KEY (Id)", "UNIQUE (Email)", "CHECK (Age > 0)")'
          }
        },
        required: ['tableName', 'constraintName', 'constraintDefinition']
      }
    },
    {
      name: 'drop_constraint',
      description: 'Drop a constraint from a table',
      inputSchema: {
        type: 'object',
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table to drop constraint from'
          },
          constraintName: {
            type: 'string',
            description: 'Name of the constraint to drop'
          }
        },
        required: ['tableName', 'constraintName']
      }
    },
    {
      name: 'get_table_constraints',
      description: 'Get all constraints for a specific table',
      inputSchema: {
        type: 'object',
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table to get constraints for'
          }
        },
        required: ['tableName']
      }
    },
    {
      name: 'create_index',
      description: 'Create an index on a table',
      inputSchema: {
        type: 'object',
        properties: {
          indexName: {
            type: 'string',
            description: 'Name of the index to create'
          },
          tableName: {
            type: 'string',
            description: 'Name of the table'
          },
          columns: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Array of column names for the index'
          },
          isUnique: {
            type: 'boolean',
            description: 'Whether the index should be unique',
            default: false
          }
        },
        required: ['indexName', 'tableName', 'columns']
      }
    },
    {
      name: 'drop_index',
      description: 'Drop an index from a table',
      inputSchema: {
        type: 'object',
        properties: {
          indexName: {
            type: 'string',
            description: 'Name of the index to drop'
          },
          tableName: {
            type: 'string',
            description: 'Name of the table'
          }
        },
        required: ['indexName', 'tableName']
      }
    },
    {
      name: 'list_indexes',
      description: 'List all indexes in the database or for a specific table',
      inputSchema: {
        type: 'object',
        properties: {
          tableName: {
            type: 'string',
            description: 'Optional: Name of the table to list indexes for'
          }
        },
        required: []
      }
    },
    {
      name: 'insert_data',
      description: 'Insert data into a table',
      inputSchema: {
        type: 'object',
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table to insert data into'
          },
          data: {
            type: 'object',
            description: 'Object containing column names and values to insert'
          }
        },
        required: ['tableName', 'data']
      }
    },
    {
      name: 'update_data',
      description: 'Update data in a table',
      inputSchema: {
        type: 'object',
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table to update'
          },
          data: {
            type: 'object',
            description: 'Object containing column names and new values'
          },
          whereClause: {
            type: 'string',
            description: 'WHERE clause for the update (e.g., "Id = 1")'
          },
          whereParams: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Array of parameters for the WHERE clause'
          }
        },
        required: ['tableName', 'data', 'whereClause']
      }
    },
    {
      name: 'delete_data',
      description: 'Delete data from a table',
      inputSchema: {
        type: 'object',
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table to delete from'
          },
          whereClause: {
            type: 'string',
            description: 'WHERE clause for the delete (e.g., "Id = 1")'
          },
          params: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Array of parameters for the WHERE clause'
          }
        },
        required: ['tableName', 'whereClause']
      }
    },
    {
      name: 'execute_query',
      description: 'Execute a custom SQL query',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'SQL query to execute'
          },
          params: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Array of parameters for the query'
          }
        },
        required: ['query']
      }
    },
    {
      name: 'execute_stored_procedure',
      description: 'Execute a stored procedure',
      inputSchema: {
        type: 'object',
        properties: {
          procedureName: {
            type: 'string',
            description: 'Name of the stored procedure to execute'
          },
          params: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Array of parameters for the stored procedure'
          }
        },
        required: ['procedureName']
      }
    },
    {
      name: 'batch_insert',
      description: 'Insert multiple rows of data into a table',
      inputSchema: {
        type: 'object',
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table to insert data into'
          },
          dataArray: {
            type: 'array',
            items: {
              type: 'object'
            },
            description: 'Array of objects containing column names and values'
          }
        },
        required: ['tableName', 'dataArray']
      }
    }
  ];
}

export async function executeTool(
  name: string,
  args: any,
  tableTools: TableTools,
  indexTools: IndexTools,
  dataTools: DataTools,
  databaseTools: DatabaseTools
): Promise<any> {
  switch (name) {
    case 'list_databases':
      return await databaseTools.listDatabases();

    case 'list_users':
      return await databaseTools.listUsers();

    case 'list_views':
      return await databaseTools.listViews();

    case 'list_stored_procedures':
      return await databaseTools.listStoredProcedures();

    case 'list_triggers':
      return await databaseTools.listTriggers();

    case 'export_data':
      return await databaseTools.exportData(args.tableName, args.format, args.filePath);

    case 'import_data':
      return await databaseTools.importData(args.tableName, args.data, args.format);

    case 'import_data_from_file':
      return await databaseTools.importDataFromFile(args.tableName, args.filePath, args.format);

    case 'list_tables':
      return await tableTools.listTables();

    case 'describe_table':
      return await tableTools.describeTable(args.tableName);

    case 'create_table':
      return await tableTools.createTable(args.tableName, args.columns);

    case 'drop_table':
      return await tableTools.dropTable(args.tableName);

    case 'rename_table':
      return await tableTools.renameTable(args.oldTableName, args.newTableName);

    case 'add_column':
      return await tableTools.addColumn(args.tableName, args.columnName, args.columnDefinition);

    case 'drop_column':
      return await tableTools.dropColumn(args.tableName, args.columnName);

    case 'modify_column':
      return await tableTools.modifyColumn(args.tableName, args.columnName, args.newColumnDefinition);

    case 'rename_column':
      return await tableTools.renameColumn(args.tableName, args.oldColumnName, args.newColumnName);

    case 'add_constraint':
      return await tableTools.addConstraint(args.tableName, args.constraintName, args.constraintDefinition);

    case 'drop_constraint':
      return await tableTools.dropConstraint(args.tableName, args.constraintName);

    case 'get_table_constraints':
      return await tableTools.getTableConstraints(args.tableName);

    case 'create_index':
      return await indexTools.createIndex(args.indexName, args.tableName, args.columns, args.isUnique);

    case 'drop_index':
      return await indexTools.dropIndex(args.indexName, args.tableName);

    case 'list_indexes':
      return await indexTools.listIndexes(args.tableName);

    case 'insert_data':
      return await dataTools.insertData(args.tableName, args.data);

    case 'update_data':
      return await dataTools.updateData(args.tableName, args.data, args.whereClause, args.whereParams);

    case 'delete_data':
      return await dataTools.deleteData(args.tableName, args.whereClause, args.params);

    case 'execute_query':
      return await dataTools.queryData(args.query, args.params);

    case 'execute_stored_procedure':
      return await dataTools.executeStoredProcedure(args.procedureName, args.params);

    case 'batch_insert':
      return await dataTools.batchInsert(args.tableName, args.dataArray);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
} 