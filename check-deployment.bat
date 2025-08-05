@echo off
echo ========================================
echo WayneMCP SQL Server 部署检查
echo ========================================
echo.

:: 检查Node.js
echo 检查 Node.js...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装或版本过低
) else (
    echo ✅ Node.js 正常
)
echo.

:: 检查项目文件
echo 检查项目文件...
if exist "package.json" (
    echo ✅ package.json 存在
) else (
    echo ❌ package.json 不存在
)

if exist "dist\index.js" (
    echo ✅ 编译文件存在
) else (
    echo ❌ 编译文件不存在，请运行 npm run build
)
echo.

:: 检查MCP配置
echo 检查 MCP 配置...
set MCP_CONFIG=%USERPROFILE%\.cursor\mcp.json
if exist "%MCP_CONFIG%" (
    echo ✅ MCP 配置文件存在: %MCP_CONFIG%
    echo.
    echo 配置文件内容:
    type "%MCP_CONFIG%"
) else (
    echo ❌ MCP 配置文件不存在: %MCP_CONFIG%
    echo.
    echo 请创建配置文件并添加以下内容:
    echo.
    echo {
    echo   "mcpServers": {
    echo     "wayne-mssql": {
    echo       "command": "node",
    echo       "args": ["%~dp0dist\\index.js"],
    echo       "env": {
    echo         "SERVER_NAME": "你的服务器地址",
    echo         "DATABASE_NAME": "你的数据库名",
    echo         "USER_ID": "用户名",
    echo         "PASSWORD": "密码"
    echo       }
    echo     }
    echo   }
    echo }
)
echo.

:: 检查网络连接（可选）
echo 检查网络连接...
ping -n 1 localhost >nul
if %errorlevel% equ 0 (
    echo ✅ 本地网络正常
) else (
    echo ⚠️  网络连接可能有问题
)
echo.

echo ========================================
echo 检查完成
echo ========================================
echo.
echo 如果所有检查都通过，请重启 Cursor 测试 MCP
echo.
pause 