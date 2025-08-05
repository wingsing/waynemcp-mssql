# WayneMCP SQL Server

一个功能完整的自定义MCP服务器，支持SQL Server的完整CRUD和DDL操作。

## 功能特性

### 🔧 数据库操作
- ✅ **表操作**: 创建、删除、重命名、描述表结构
- ✅ **表结构修改**: 添加列、删除列、修改列、重命名列
- ✅ **约束操作**: 添加约束、删除约束、查看约束
- ✅ **索引操作**: 创建、删除、列出索引
- ✅ **数据操作**: 插入、更新、删除、查询数据
- ✅ **存储过程**: 执行存储过程
- ✅ **批量操作**: 批量插入数据
- ✅ **自定义查询**: 执行任意SQL查询

### 🛡️ 安全特性
- ✅ **参数化查询**: 防止SQL注入
- ✅ **连接池管理**: 高效连接管理
- ✅ **事务支持**: 支持数据库事务
- ✅ **错误处理**: 完善的错误处理机制
- ✅ **日志记录**: 详细的操作日志

### ⚙️ 配置特性
- ✅ **环境变量配置**: 灵活的配置方式
- ✅ **连接超时设置**: 可配置的连接超时
- ✅ **命令超时设置**: 可配置的命令超时
- ✅ **认证方式**: 支持Windows认证和SQL Server认证

## 安装和配置

### 1. 安装依赖
```bash
npm install
```

### 2. 编译项目
```bash
npm run build
```

### 3. 配置MCP

在 `~/.cursor/mcp.json` 中添加配置：

```json
{
  "mcpServers": {
    "wayne-mssql": {
      "command": "node",
      "args": ["path/to/waynemcp-mssql/dist/index.js"],
      "env": {
        "SERVER_NAME": "TRACYW\\SQL2014",
        "DATABASE_NAME": "test",
        "USER_ID": "sa",
        "PASSWORD": "sa0813",
        "CONNECTION_TIMEOUT": "30",
        "COMMAND_TIMEOUT": "30",
        "TRUST_SERVER_CERTIFICATE": "true",
        "ENCRYPT": "false"
      }
    }
  }
}
```

### 4. 环境变量说明

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `SERVER_NAME` | SQL Server服务器地址 | localhost | 是 |
| `DATABASE_NAME` | 数据库名称 | master | 是 |
| `USER_ID` | 用户名 | - | 否（Windows认证时） |
| `PASSWORD` | 密码 | - | 否（Windows认证时） |
| `CONNECTION_TIMEOUT` | 连接超时（秒） | 30 | 否 |
| `COMMAND_TIMEOUT` | 命令超时（秒） | 30 | 否 |
| `TRUST_SERVER_CERTIFICATE` | 信任服务器证书 | true | 否 |
| `ENCRYPT` | 启用加密 | false | 否 |

## 可用工具

### 表操作
- `list_tables` - 列出所有表
- `describe_table` - 描述表结构
- `create_table` - 创建表
- `drop_table` - 删除表
- `rename_table` - 重命名表

### 表结构修改
- `add_column` - 添加列
- `drop_column` - 删除列
- `modify_column` - 修改列
- `rename_column` - 重命名列

### 约束操作
- `add_constraint` - 添加约束
- `drop_constraint` - 删除约束
- `get_table_constraints` - 获取表约束

### 索引操作
- `create_index` - 创建索引
- `drop_index` - 删除索引
- `list_indexes` - 列出索引

### 数据操作
- `insert_data` - 插入数据
- `update_data` - 更新数据
- `delete_data` - 删除数据
- `execute_query` - 执行自定义查询
- `execute_stored_procedure` - 执行存储过程
- `batch_insert` - 批量插入数据

## 使用示例

### 创建表
```json
{
  "name": "create_table",
  "arguments": {
    "tableName": "wstbUsers",
    "columns": [
      "Id INT IDENTITY(1,1) PRIMARY KEY",
      "Username NVARCHAR(50) NOT NULL",
      "Password NVARCHAR(100) NOT NULL",
      "Department NVARCHAR(50)",
      "Status NVARCHAR(20) DEFAULT '激活'",
      "CreatedTime DATETIME2 DEFAULT GETDATE()",
      "LastLoginTime DATETIME2 NULL"
    ]
  }
}
```

### 重命名表
```json
{
  "name": "rename_table",
  "arguments": {
    "oldTableName": "wstbUsers",
    "newTableName": "Users"
  }
}
```

### 添加列
```json
{
  "name": "add_column",
  "arguments": {
    "tableName": "Users",
    "columnName": "Email",
    "columnDefinition": "NVARCHAR(100) NOT NULL"
  }
}
```

### 修改列
```json
{
  "name": "modify_column",
  "arguments": {
    "tableName": "Users",
    "columnName": "Username",
    "newColumnDefinition": "NVARCHAR(100) NOT NULL"
  }
}
```

### 重命名列
```json
{
  "name": "rename_column",
  "arguments": {
    "tableName": "Users",
    "oldColumnName": "Password",
    "newColumnName": "PasswordHash"
  }
}
```

### 添加约束
```json
{
  "name": "add_constraint",
  "arguments": {
    "tableName": "Users",
    "constraintName": "UQ_Users_Email",
    "constraintDefinition": "UNIQUE (Email)"
  }
}
```

### 删除列
```json
{
  "name": "drop_column",
  "arguments": {
    "tableName": "Users",
    "columnName": "LastLoginTime"
  }
}
```

### 插入数据
```json
{
  "name": "insert_data",
  "arguments": {
    "tableName": "Users",
    "data": {
      "Username": "wayne",
      "PasswordHash": "Test123",
      "Department": "IT",
      "Status": "激活",
      "Email": "wayne@example.com"
    }
  }
}
```

### 查询数据
```json
{
  "name": "execute_query",
  "arguments": {
    "query": "SELECT * FROM Users WHERE Department = 'IT'",
    "params": []
  }
}
```

### 创建索引
```json
{
  "name": "create_index",
  "arguments": {
    "indexName": "IX_Users_Department",
    "tableName": "Users",
    "columns": ["Department"],
    "isUnique": false
  }
}
```

### 获取表约束
```json
{
  "name": "get_table_constraints",
  "arguments": {
    "tableName": "Users"
  }
}
```

## 开发

### 项目结构
```
waynemcp-mssql/
├── src/
│   ├── database/
│   │   └── connection.ts      # 数据库连接管理
│   ├── tools/
│   │   ├── TableTools.ts      # 表操作工具
│   │   ├── IndexTools.ts      # 索引操作工具
│   │   ├── DataTools.ts       # 数据操作工具
│   │   └── index.ts           # 工具定义和路由
│   └── index.ts               # 主服务器文件
├── dist/                      # 编译输出目录
├── package.json
├── tsconfig.json
└── README.md
```

### 开发命令
```bash
# 开发模式
npm run dev

# 编译
npm run build

# 运行
npm start

# 测试
npm test

# 代码检查
npm run lint
```

## 故障排除

### 常见问题

1. **连接失败**
   - 检查服务器地址和端口
   - 验证用户名和密码
   - 确认SQL Server服务正在运行

2. **权限错误**
   - 确认用户有足够的数据库权限
   - 检查防火墙设置

3. **超时错误**
   - 增加连接超时时间
   - 检查网络连接

4. **表结构修改错误**
   - 确认表名和列名正确
   - 检查列定义语法
   - 确认没有依赖关系冲突

### 日志查看
MCP服务器会输出详细的日志信息，包括：
- 连接状态
- 查询执行结果
- 错误信息

## 许可证

MIT License

## 作者

Wayne

## 更新日志

### v1.1.0
- 新增表结构修改功能
  - 重命名表
  - 添加列
  - 删除列
  - 修改列
  - 重命名列
  - 添加约束
  - 删除约束
  - 获取表约束

### v1.0.0
- 初始版本发布
- 支持完整的CRUD和DDL操作
- 支持存储过程和批量操作
- 完善的错误处理和日志记录 