@echo off
echo ========================================
echo 创建 WayneMCP 最小化部署包
echo ========================================
echo.

:: 检查编译文件是否存在
if not exist "dist\index.js" (
    echo 错误: 编译文件不存在，请先运行 npm run build
    pause
    exit /b 1
)

:: 创建部署目录
set DEPLOY_DIR=waynemcp-deployment
if exist "%DEPLOY_DIR%" (
    echo 删除旧的部署目录...
    rmdir /s /q "%DEPLOY_DIR%"
)

echo 创建部署目录: %DEPLOY_DIR%
mkdir "%DEPLOY_DIR%"

:: 复制必要文件
echo 复制编译文件...
xcopy "dist" "%DEPLOY_DIR%\dist" /e /i /y

echo 复制 package.json...
copy "package.json" "%DEPLOY_DIR%\" /y

echo 复制 README.md...
copy "README.md" "%DEPLOY_DIR%\" /y

echo 复制部署指南...
copy "deploy.md" "%DEPLOY_DIR%\" /y

echo 复制配置模板...
copy "mcp-config-template.json" "%DEPLOY_DIR%\" /y

:: 创建快速安装脚本
echo 创建快速安装脚本...
(
echo @echo off
echo echo ========================================
echo echo WayneMCP SQL Server 快速安装
echo echo ========================================
echo echo.
echo echo 正在安装依赖...
echo npm install
echo if %%errorlevel%% neq 0 ^(
echo     echo 错误: 依赖安装失败
echo     pause
echo     exit /b 1
echo ^)
echo echo.
echo echo ✓ 安装完成！
echo echo.
echo echo 下一步操作：
echo echo 1. 编辑 MCP 配置文件
echo echo 2. 重启 Cursor
echo echo 3. 测试连接
echo echo.
echo echo 配置文件位置：
echo echo %%USERPROFILE%%\.cursor\mcp.json
echo echo.
echo pause
) > "%DEPLOY_DIR%\install.bat"

:: 显示部署包信息
echo.
echo ========================================
echo 部署包创建完成！
echo ========================================
echo.
echo 部署包位置: %DEPLOY_DIR%
echo.
echo 包含文件:
dir "%DEPLOY_DIR%" /b
echo.
echo 部署包大小:
dir "%DEPLOY_DIR%" /s | find "个文件"
echo.
echo 下一步操作:
echo 1. 将 %DEPLOY_DIR% 文件夹复制到目标电脑
echo 2. 在目标电脑上运行 install.bat
echo 3. 配置 MCP 配置文件
echo.
pause 