# WayneMCP SQL Server 部署指南

## 📋 **部署前准备**

### 系统要求
- Windows 10/11 或 Windows Server
- Node.js 18+ 
- SQL Server 实例（本地或远程）
- 网络连接到SQL Server

### 必要信息
- SQL Server服务器地址
- 数据库名称
- 用户名和密码（或Windows认证）
- 端口号（默认1433）

## 🛠️ **部署步骤**

### 1. 复制项目文件
将整个 `waynemcp-mssql` 文件夹复制到目标电脑的任意目录，例如：
```
C:\MCP\waynemcp-mssql\
```

### 2. 安装Node.js依赖
在项目目录中打开命令提示符或PowerShell：
```bash
cd C:\MCP\waynemcp-mssql
npm install
```

### 3. 编译项目
```bash
npm run build
```

### 4. 配置MCP
在目标电脑上创建或编辑 `~/.cursor/mcp.json` 文件：

#### Windows路径：
```
C:\Users\[用户名]\.cursor\mcp.json
```

#### 配置示例：
```json
{
  "mcpServers": {
    "wayne-mssql": {
      "command": "node",
      "args": ["C:\\MCP\\waynemcp-mssql\\dist\\index.js"],
      "env": {
        "SERVER_NAME": "你的服务器地址",
        "DATABASE_NAME": "你的数据库名",
        "USER_ID": "用户名",
        "PASSWORD": "密码",
        "CONNECTION_TIMEOUT": "30",
        "COMMAND_TIMEOUT": "30",
        "TRUST_SERVER_CERTIFICATE": "true",
        "ENCRYPT": "false"
      }
    }
  }
}
```

### 5. 环境变量说明

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `SERVER_NAME` | SQL Server地址 | `localhost` 或 `192.168.1.100` |
| `DATABASE_NAME` | 数据库名称 | `test` |
| `USER_ID` | 用户名 | `sa` |
| `PASSWORD` | 密码 | `yourpassword` |
| `CONNECTION_TIMEOUT` | 连接超时（秒） | `30` |
| `COMMAND_TIMEOUT` | 命令超时（秒） | `30` |
| `TRUST_SERVER_CERTIFICATE` | 信任证书 | `true` |
| `ENCRYPT` | 启用加密 | `false` |

### 6. 测试连接
重启Cursor，然后测试MCP是否正常工作。

## 🔧 **常见问题解决**

### 连接失败
1. 检查SQL Server服务是否运行
2. 验证服务器地址和端口
3. 确认防火墙设置
4. 检查用户名密码是否正确

### 权限错误
1. 确认用户有足够权限
2. 检查SQL Server认证模式
3. 验证数据库是否存在

### 路径问题
- 确保路径使用双反斜杠 `\\`
- 检查文件是否存在
- 确认Node.js已正确安装

## 📦 **快速部署包**

### 创建部署包
```bash
# 在源电脑上执行
npm run build
# 复制整个文件夹到目标电脑
```

### 最小部署文件
只需要以下文件：
- `dist/` 目录（编译后的文件）
- `package.json`
- `deploy.md`（本文件）

## 🔒 **安全建议**

1. **密码安全**
   - 不要在代码中硬编码密码
   - 使用环境变量或配置文件
   - 定期更换密码

2. **网络安全**
   - 使用防火墙限制访问
   - 考虑使用VPN连接
   - 启用SQL Server加密

3. **权限最小化**
   - 只授予必要的数据库权限
   - 避免使用sa账户
   - 定期审查用户权限

## 📞 **技术支持**

如果遇到问题，请检查：
1. Node.js版本是否兼容
2. SQL Server连接是否正常
3. 配置文件语法是否正确
4. 文件路径是否正确

## 🎯 **验证部署**

部署完成后，可以运行以下测试：
1. 列出数据库：`list_databases`
2. 列出表：`list_tables`
3. 执行简单查询：`execute_query` 