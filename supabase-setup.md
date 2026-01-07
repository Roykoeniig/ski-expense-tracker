# 🗄️ Supabase 数据库设置指南

本指南将帮助你设置 Supabase 数据库，实现真正的数据持久化和跨设备同步。

## 第一步：创建 Supabase 账户和项目

1. **访问 Supabase**
   - 打开 [https://supabase.com](https://supabase.com)
   - 点击 "Start your project" 或 "Sign in"

2. **注册/登录**
   - 使用 GitHub 账户登录（推荐）
   - 或使用邮箱注册

3. **创建新项目**
   - 点击 "New Project"
   - 填写项目信息：
     - **Name**: `ski-expense-tracker`（或你喜欢的名称）
     - **Database Password**: 设置一个强密码（**重要：请保存好这个密码**）
     - **Region**: 选择离你最近的区域（例如：`Southeast Asia (Singapore)`）
   - 点击 "Create new project"
   - 等待项目创建完成（约 2 分钟）

## 第二步：获取 API 密钥

1. **进入项目设置**
   - 在项目页面，点击左侧菜单的 "Settings"（齿轮图标）
   - 选择 "API"

2. **复制密钥**
   - **Project URL**: 复制这个 URL（例如：`https://xxxxx.supabase.co`）
   - **anon public key**: 复制这个密钥（以 `eyJ...` 开头）

## 第三步：创建数据库表

1. **进入 SQL Editor**
   - 在左侧菜单点击 "SQL Editor"
   - 点击 "New query"

2. **执行以下 SQL 语句**

```sql
-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT DEFAULT 'user',
  password TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建记账表
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('EUR', 'CHF', 'CNY')),
  paid_by TEXT NOT NULL,
  shared_by TEXT[] NOT NULL,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_paid_by ON expenses(paid_by);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 启用 Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有人读取和写入（简化版，生产环境应该更严格）
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on expenses" ON expenses
  FOR ALL USING (true) WITH CHECK (true);
```

3. **执行 SQL**
   - 点击 "Run" 按钮或按 `Cmd/Ctrl + Enter`
   - 确认没有错误

## 第四步：配置环境变量

### 在 Vercel 中配置

1. **进入 Vercel 项目设置**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 选择你的项目
   - 进入 "Settings" > "Environment Variables"

2. **添加环境变量**
   
   添加以下三个环境变量：

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   ```
   （替换为你的 Project URL）

   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   （替换为你的 anon public key）

   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   （可选，用于管理员操作，在 Supabase Settings > API > service_role key）

3. **设置环境**
   - 为每个变量选择环境：Production, Preview, Development（全选）
   - 点击 "Save"

4. **重新部署**
   - 进入 "Deployments" 标签
   - 点击最新部署右侧的 "..." 菜单
   - 选择 "Redeploy"
   - 或推送新代码触发自动部署

### 在本地开发环境配置

1. **创建/更新 `.env.local` 文件**

```bash
cd /Users/rongshunwang/ski-expense-tracker
```

创建或编辑 `.env.local` 文件：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 可选：Service Role Key（用于管理员操作）
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI API Key（如果使用 AI 功能）
OPENAI_API_KEY=your_openai_api_key_here
```

2. **重启开发服务器**

```bash
npm run dev
```

## 第五步：测试数据库连接

1. **访问网站**
   - 打开你的网站
   - 登录系统

2. **测试功能**
   - 添加一个用户
   - 创建一条记账
   - 检查数据是否保存

3. **验证跨设备同步**
   - 在另一个设备或浏览器中登录
   - 检查数据是否同步显示

## 数据库管理

### 查看数据

1. **在 Supabase Dashboard**
   - 进入 "Table Editor"
   - 可以查看和编辑 `users` 和 `expenses` 表

2. **使用 SQL Editor**
   - 可以执行 SQL 查询
   - 例如：`SELECT * FROM expenses ORDER BY date DESC LIMIT 10;`

### 备份数据

1. **自动备份**
   - Supabase 免费层提供每日自动备份
   - 在 "Settings" > "Database" > "Backups" 查看

2. **手动导出**
   - 在 "Table Editor" 中可以选择导出数据为 CSV

## 安全建议

1. **Row Level Security (RLS)**
   - 当前配置允许所有人访问（简化版）
   - 生产环境应该：
     - 添加用户认证
     - 创建更严格的 RLS 策略
     - 只允许认证用户访问自己的数据

2. **API 密钥安全**
   - 不要将 API 密钥提交到 Git
   - 只在服务器端使用 Service Role Key
   - 客户端只使用 Anon Key

## 故障排除

### 问题：数据没有同步

1. **检查环境变量**
   - 确认 Vercel 中已正确配置环境变量
   - 确认已重新部署

2. **检查浏览器控制台**
   - 打开开发者工具（F12）
   - 查看 Console 是否有错误

3. **检查 Supabase 日志**
   - 在 Supabase Dashboard > Logs
   - 查看 API 请求日志

### 问题：无法连接数据库

1. **检查网络**
   - 确认可以访问 Supabase URL

2. **检查 API 密钥**
   - 确认密钥正确复制（没有多余空格）

3. **检查 RLS 策略**
   - 确认已创建允许访问的策略

## 下一步

数据库配置完成后，你的应用将：
- ✅ 数据持久化存储
- ✅ 跨设备自动同步
- ✅ 数据备份和恢复
- ✅ 更好的性能和可靠性

## 支持

如有问题，请参考：
- [Supabase 文档](https://supabase.com/docs)
- [Supabase JavaScript 客户端](https://supabase.com/docs/reference/javascript/introduction)

---

**注意**：Supabase 免费层限制：
- 500MB 数据库空间
- 2GB 带宽/月
- 50,000 月度活跃用户
- 对于个人项目通常足够使用

如果需要更多资源，可以升级到付费计划。

