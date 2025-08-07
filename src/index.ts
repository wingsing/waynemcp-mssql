#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { DatabaseConnection, DatabaseConfig } from './database/connection.js';
import { TableTools } from './tools/TableTools.js';
import { IndexTools } from './tools/IndexTools.js';
import { DataTools } from './tools/DataTools.js';
import { DatabaseTools } from './tools/DatabaseTools.js';
import { createTools, executeTool } from './tools/index.js';

// 全局变量
let dbConnection: DatabaseConnection | null = null;
let tableTools: TableTools | null = null;
let indexTools: IndexTools | null = null;
let dataTools: DataTools | null = null;
let databaseTools: DatabaseTools | null = null;

// 创建数据库配置
function createDatabaseConfig(): DatabaseConfig {
  const server = process.env.SERVER_NAME || 'localhost';
  const database = process.env.DATABASE_NAME || 'master';
  const user = process.env.USER_ID;
  const password = process.env.PASSWORD;
  const connectionTimeout = parseInt(process.env.CONNECTION_TIMEOUT || '30');
  const commandTimeout = parseInt(process.env.COMMAND_TIMEOUT || '30');
  const trustServerCertificate = process.env.TRUST_SERVER_CERTIFICATE?.toLowerCase() === 'true';
  const encrypt = process.env.ENCRYPT?.toLowerCase() === 'true';

  return {
    server,
    database,
    user,
    password,
    connectionTimeout,
    commandTimeout,
    trustServerCertificate,
    encrypt
  };
}

// 初始化数据库连接
async function initializeDatabase(): Promise<void> {
  try {
    const config = createDatabaseConfig();
    console.log('Connecting to database:', config.server, config.database);
    
    dbConnection = DatabaseConnection.getInstance(config);
    await dbConnection.connect();
    
    tableTools = new TableTools(dbConnection);
    indexTools = new IndexTools(dbConnection);
    dataTools = new DataTools(dbConnection);
    databaseTools = new DatabaseTools(dbConnection);
    
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
    throw error;
  }
}

// 创建MCP服务器
const server = new Server(
  {
    name: 'waynemcp-mssql',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// 处理工具列表请求
server.setRequestHandler(ListToolsRequestSchema, async () => {
  if (!tableTools || !indexTools || !dataTools || !databaseTools) {
    throw new Error('Database tools not initialized');
  }
  
  const tools = createTools(tableTools, indexTools, dataTools, databaseTools);
  return { tools };
});

// 处理工具调用请求
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (!tableTools || !indexTools || !dataTools || !databaseTools) {
    throw new Error('Database tools not initialized');
  }

  try {
    // 检查是否是switch_database工具
    if (request.params.name === 'switch_database') {
      const args = request.params.arguments as { databaseName: string };
      const { databaseName } = args;
      
      // 断开当前连接
      if (dbConnection) {
        await dbConnection.disconnect();
      }
      
      // 创建新配置
      const config = createDatabaseConfig();
      config.database = databaseName;
      
      // 获取新的实例（会因为数据库名不同而创建新实例）
      dbConnection = DatabaseConnection.getInstance(config);
      await dbConnection.connect();
      
      // 重新初始化所有工具
      tableTools = new TableTools(dbConnection);
      indexTools = new IndexTools(dbConnection);
      dataTools = new DataTools(dbConnection);
      databaseTools = new DatabaseTools(dbConnection);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ message: `Switched to database ${databaseName}` }, null, 2)
          }
        ]
      };
    }

    const result = await executeTool(
      request.params.name,
      request.params.arguments,
      tableTools,
      indexTools,
      dataTools,
      databaseTools
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  } catch (error) {
    console.error(`Error executing tool ${request.params.name}:`, error);
    throw error;
  }
});

// 主函数
async function main() {
  try {
    // 初始化数据库连接
    await initializeDatabase();
    
    // 创建传输层
    const transport = new StdioServerTransport();
    
    // 启动服务器
    await server.connect(transport);
    
    console.log('WayneMCP SQL Server started successfully');
    
    // 处理进程退出
    process.on('SIGINT', async () => {
      console.log('Shutting down...');
      if (dbConnection) {
        await dbConnection.disconnect();
      }
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log('Shutting down...');
      if (dbConnection) {
        await dbConnection.disconnect();
      }
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

// 启动服务器
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 