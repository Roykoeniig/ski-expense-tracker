# ⚡ 快速设置 Supabase 数据库

## 问题诊断

你看到 "Supabase not configured" 错误，说明环境变量还没有配置。

## 5分钟快速设置

### 步骤 1：创建 Supabase 项目（2分钟）

1. 访问：https://supabase.com
2. 使用 GitHub 登录
3. 点击 "New Project"
4. 填写：
   - **Name**: `ski-expense-tracker`
   - **Database Password**: 设置一个强密码（**保存好！**）
   - **Region**: 选择 `Southeast Asia (Singapore)` 或离你最近的
5. 点击 "Create new project"
6. 等待创建完成（约2分钟）

### 步骤 2：创建数据库表（1分钟）

1. 在 Supabase 项目页面，点击左侧 **"SQL Editor"**
2. 点击 **"New query"**
3. **复制并粘贴**以下 SQL：

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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_paid_by ON expenses(paid_by);

-- 启用 Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有人访问
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on expenses" ON expenses
  FOR ALL USING (true) WITH CHECK (true);
```

4. 点击 **"Run"** 按钮（或按 `Cmd/Ctrl + Enter`）
5. 确认显示 "Success. No rows returned"

### 步骤 3：获取 API 密钥（30秒）

1. 在 Supabase 项目页面，点击左侧 **"Settings"**（齿轮图标）
2. 选择 **"API"**
3. 复制以下两个值：

**Project URL**（类似：`https://xxxxx.supabase.co`）
```
NEXT_PUBLIC_SUPABASE_URL=https://你的项目URL
```

**anon public key**（以 `eyJ...` 开头，很长）
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon key
```

### 步骤 4：在 Vercel 配置环境变量（1分钟）

1. 访问：https://vercel.com/dashboard
2. 选择你的项目（`ski-expense-tracker` 或 `skifly`）
3. 进入 **"Settings"** > **"Environment Variables"**
4. 添加第一个变量：
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: 粘贴你的 Project URL（例如：`https://xxxxx.supabase.co`）
   - **Environment**: 全选（Production, Preview, Development）
   - 点击 **"Save"**

5. 添加第二个变量：
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: 粘贴你的 anon public key
   - **Environment**: 全选
   - 点击 **"Save"**

### 步骤 5：重新部署（30秒）

1. 在 Vercel 项目页面，进入 **"Deployments"** 标签
2. 点击最新部署右侧的 **"..."** 菜单
3. 选择 **"Redeploy"**
4. 等待部署完成（约2分钟）

### 步骤 6：测试（30秒）

1. 部署完成后，访问你的网站
2. 访问测试页面：`https://你的网站域名/api/test-db`
3. 应该看到：`{"success":true,"message":"数据库连接成功！"}`

## ✅ 完成！

现在你的数据会自动同步到数据库，所有设备都能看到相同的数据了！

## 常见问题

### Q: 环境变量配置后还是不工作？

A: 
1. 确认已重新部署（Redeploy）
2. 等待2-3分钟让部署完成
3. 清除浏览器缓存并刷新页面
4. 检查浏览器控制台（F12）是否有错误

### Q: 如何确认环境变量已配置？

A: 访问 `https://你的网站/api/test-db`，如果显示成功就说明配置正确。

### Q: 数据会丢失吗？

A: 不会。配置数据库后，现有数据会自动上传到数据库。新设备登录时会自动从数据库同步。

## 需要帮助？

如果遇到问题，请告诉我：
1. 你在哪一步遇到问题
2. 具体的错误信息
3. 浏览器控制台的错误（F12 > Console）


