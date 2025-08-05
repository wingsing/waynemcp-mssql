# WayneMCP SQL Server GitHub 部署指南

## 🎯 **GitHub部署方案优势**

- ✅ **版本控制**: 所有更改都有历史记录
- ✅ **多设备同步**: 多台电脑可以同步代码
- ✅ **协作开发**: 可以多人协作开发功能
- ✅ **分支管理**: 可以创建功能分支进行开发
- ✅ **回滚能力**: 可以轻松回滚到之前的版本

## 🚀 **首次部署到GitHub**

### 1. 创建GitHub仓库
1. 登录GitHub
2. 点击 "New repository"
3. 仓库名: `waynemcp-mssql`
4. 描述: `Custom MCP server for SQL Server with full CRUD and DDL operations`
5. 选择 "Public" 或 "Private"
6. 不要初始化README（我们已有）

### 2. 上传代码到GitHub
```bash
# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit: WayneMCP SQL Server MCP"

# 添加远程仓库（替换为你的GitHub仓库URL）
git remote add origin https://github.com/你的用户名/waynemcp-mssql.git

# 推送到GitHub
git push -u origin main
```

## 📥 **在其他电脑上部署**

### 1. 克隆仓库
```bash
git clone https://github.com/你的用户名/waynemcp-mssql.git
cd waynemcp-mssql
```

### 2. 安装依赖
```bash
npm install
```

### 3. 编译项目
```bash
npm run build
```

### 4. 配置MCP
编辑 `~/.cursor/mcp.json`：
```json
{
  "mcpServers": {
    "wayne-mssql": {
      "command": "node",
      "args": ["C:\\path\\to\\waynemcp-mssql\\dist\\index.js"],
      "env": {
        "SERVER_NAME": "你的服务器地址",
        "DATABASE_NAME": "你的数据库名",
        "USER_ID": "用户名",
        "PASSWORD": "密码"
      }
    }
  }
}
```

## 🔄 **日常开发流程**

### 获取最新代码
```bash
git pull origin main
npm install  # 如果有新的依赖
npm run build
```

### 开发新功能
```bash
# 创建功能分支
git checkout -b feature/新功能名称

# 开发完成后
git add .
git commit -m "Add: 新功能描述"
git push origin feature/新功能名称

# 合并到主分支
git checkout main
git merge feature/新功能名称
git push origin main
```

### 修复问题
```bash
# 创建修复分支
git checkout -b fix/问题描述

# 修复完成后
git add .
git commit -m "Fix: 问题描述"
git push origin fix/问题描述

# 合并到主分支
git checkout main
git merge fix/问题描述
git push origin main
```

## 📋 **版本管理**

### 创建版本标签
```bash
# 创建版本标签
git tag -a v1.1.0 -m "Version 1.1.0: Added database tools"

# 推送标签
git push origin v1.1.0
```

### 查看版本历史
```bash
# 查看所有标签
git tag

# 查看版本历史
git log --oneline --graph
```

## 🔧 **多环境配置**

### 创建环境配置模板
```bash
# 复制配置模板
cp mcp-config-template.json mcp-config-local.json
cp mcp-config-template.json mcp-config-production.json
```

### 不同环境的配置
- `mcp-config-local.json`: 本地开发环境
- `mcp-config-production.json`: 生产环境

## 📦 **自动化部署脚本**

### 创建部署脚本
```bash
# deploy.bat (Windows)
@echo off
echo 正在部署 WayneMCP...
git pull origin main
npm install
npm run build
echo 部署完成！
pause
```

## 🆘 **常见问题**

### 1. 合并冲突
```bash
# 解决冲突后
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

### 2. 回滚版本
```bash
# 查看提交历史
git log --oneline

# 回滚到指定版本
git reset --hard 提交ID
git push -f origin main
```

### 3. 分支管理
```bash
# 查看所有分支
git branch -a

# 删除本地分支
git branch -d 分支名

# 删除远程分支
git push origin --delete 分支名
```

## 🎯 **最佳实践**

1. **提交信息规范**
   - `Add: 新功能`
   - `Fix: 修复问题`
   - `Update: 更新功能`
   - `Refactor: 重构代码`

2. **分支命名规范**
   - `feature/功能名称`
   - `fix/问题描述`
   - `hotfix/紧急修复`

3. **定期同步**
   - 每天开始工作前 `git pull`
   - 完成工作后 `git push`

4. **测试验证**
   - 每次修改后都要测试功能
   - 确保编译通过

## 📞 **团队协作**

- 使用Pull Request进行代码审查
- 在Issues中记录问题和需求
- 使用Projects管理开发进度
- 定期进行代码审查 