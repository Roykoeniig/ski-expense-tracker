# 快速修复数据库导入问题

## 问题：导入数据失败

如果看到 "导入用户数据失败" 或 "导入记账数据失败"，通常是因为以下原因：

## ✅ 必须完成的步骤

### 1. 检查 Supabase 表是否已创建

1. 访问：https://supabase.com/dashboard
2. 进入你的项目
3. 点击左侧菜单的 **"Table Editor"**
4. 确认有以下两个表：
   - ✅ `users` 表
   - ✅ `expenses` 表

**如果没有表，执行以下 SQL：**

在 Supabase 的 **"SQL Editor"** 中执行：

```sql
-- 创建 users 表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT DEFAULT 'user',
  password TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 expenses 表
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL,
  paid_by TEXT NOT NULL,
  shared_by TEXT[] NOT NULL,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_paid_by ON expenses(paid_by);
```

### 2. 配置 RLS（行级安全）策略 ⚠️ 非常重要！

**如果不配置 RLS，数据库会拒绝所有操作！**

在 Supabase 的 **"SQL Editor"** 中执行：

```sql
-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- 删除旧策略（如果存在）
DROP POLICY IF EXISTS "Allow public access on users" ON users;
DROP POLICY IF EXISTS "Allow public access on expenses" ON expenses;

-- 创建新策略：允许所有人访问（公开应用）
CREATE POLICY "Allow public access on users"
ON users FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public access on expenses"
ON expenses FOR ALL
USING (true)
WITH CHECK (true);
```

### 3. 检查 Vercel 环境变量

1. 访问：https://vercel.com/dashboard
2. 进入你的项目
3. 点击 **"Settings"** → **"Environment Variables"**
4. 确认有以下两个变量：
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. 确认两个变量都勾选了：
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### 4. 重新部署 Vercel 项目

**重要：** 修改环境变量后，必须重新部署！

1. 在 Vercel 项目页面，点击 **"Deployments"**
2. 找到最新的部署（最上面的）
3. 点击右侧的 **"..."** 菜单
4. 选择 **"Redeploy"**
5. 等待部署完成（约 2-3 分钟）

### 5. 测试数据库连接

部署完成后：

1. 访问：`https://skifly.vercel.app/test-db`
2. 点击 **"检查配置"** 按钮
3. 应该显示：`✅ 数据库连接成功！`

如果显示错误，请查看错误信息并按照提示修复。

### 6. 再次尝试导入数据

1. 访问：`https://skifly.vercel.app/import-data`
2. 点击 **"检查本地数据"**
3. 点击 **"导入到 Supabase"**
4. 应该显示：`✅ 成功导入 X 个用户和 Y 条记账记录`

## 🔍 常见错误及解决方案

### 错误 1: "relation 'users' does not exist"
**原因：** 表未创建

**解决：** 执行步骤 1 中的 SQL 创建表

### 错误 2: "new row violates row-level security policy"
**原因：** RLS 策略未配置或配置错误

**解决：** 执行步骤 2 中的 SQL 配置 RLS

### 错误 3: "Supabase not configured"
**原因：** 环境变量未配置或未生效

**解决：** 
1. 检查步骤 3 中的环境变量
2. 执行步骤 4 重新部署

### 错误 4: "permission denied for table users"
**原因：** RLS 策略不允许操作

**解决：** 执行步骤 2 中的 SQL 配置 RLS

## 📝 检查清单

完成以下所有步骤后，导入应该可以成功：

- [ ] Supabase 表已创建（users 和 expenses）
- [ ] RLS 策略已配置（允许公开访问）
- [ ] Vercel 环境变量已配置
- [ ] Vercel 项目已重新部署
- [ ] 测试页面显示 "数据库连接成功！"
- [ ] 导入数据成功

## 💡 提示

- 如果导入失败，查看错误详情中的 `details` 字段，它会告诉你具体是什么问题
- 所有 SQL 都可以在 Supabase 的 SQL Editor 中一次性执行
- 如果还有问题，检查浏览器控制台（F12）中的错误信息

