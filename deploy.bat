@echo off
echo ========================================
echo WayneMCP SQL Server 部署脚本
echo ========================================
echo.

:: 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js 18+
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js 已安装
echo.

:: 安装依赖
echo 正在安装依赖包...
npm install
if %errorlevel% neq 0 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)

echo ✓ 依赖安装完成
echo.

:: 编译项目
echo 正在编译项目...
npm run build
if %errorlevel% neq 0 (
    echo 错误: 项目编译失败
    pause
    exit /b 1
)

echo ✓ 项目编译完成
echo.

:: 检查编译结果
if not exist "dist\index.js" (
    echo 错误: 编译后的文件不存在
    pause
    exit /b 1
)

echo ✓ 编译文件检查通过
echo.

:: 显示配置信息
echo ========================================
echo 部署完成！
echo ========================================
echo.
echo 下一步操作：
echo 1. 编辑 MCP 配置文件
echo 2. 重启 Cursor
echo 3. 测试连接
echo.
echo 配置文件位置：
echo %USERPROFILE%\.cursor\mcp.json
echo.
echo 配置示例：
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
echo.
echo 当前项目路径: %~dp0
echo 编译文件路径: %~dp0dist\index.js
echo.
pause 