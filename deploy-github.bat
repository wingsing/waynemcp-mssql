@echo off
echo ========================================
echo WayneMCP GitHub 部署脚本
echo ========================================
echo.

:: 检查Git是否安装
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Git，请先安装Git
    echo 下载地址: https://git-scm.com/
    pause
    exit /b 1
)

echo ✓ Git 已安装
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

:: 获取最新代码
echo 正在获取最新代码...
git pull origin main
if %errorlevel% neq 0 (
    echo 警告: 获取最新代码失败，继续使用本地代码
)

echo ✓ 代码同步完成
echo.

:: 安装依赖
echo 正在安装依赖...
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

:: 显示部署信息
echo ========================================
echo 部署完成！
echo ========================================
echo.
echo 当前分支: 
git branch --show-current
echo.
echo 最新提交:
git log -1 --oneline
echo.
echo 下一步操作：
echo 1. 重启 Cursor
echo 2. 测试 MCP 功能
echo 3. 如有问题，检查 MCP 配置文件
echo.
echo 配置文件位置：
echo %USERPROFILE%\.cursor\mcp.json
echo.
pause 