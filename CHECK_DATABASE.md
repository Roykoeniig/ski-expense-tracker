# 数据库连接问题排查指南

## ✅ 你已经完成的步骤

1. ✅ 在 Vercel 中配置了环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🔍 需要检查的步骤

### 步骤 1：重新部署 Vercel 项目

**重要：** 添加环境变量后，必须重新部署才能生效！

1. 访问：https://vercel.com/dashboard
2. 进入你的项目（`skifly`）
3. 点击顶部菜单的 **"Deployments"**
4. 找到最新的部署（最上面的）
5. 点击右侧的 **"..."** 菜单（三个点）
6. 选择 **"Redeploy"**
7. 等待部署完成（约 2-3 分钟）

### 步骤 2：检查 Supabase 表是否已创建

1. 访问：https://supabase.com/dashboard
2. 进入你的项目
3. 点击左侧菜单的 **"Table Editor"**
4. 检查是否有以下两个表：
   - ✅ `users` 表
   - ✅ `expenses` 表

**如果没有表，需要执行 SQL 创建：**

1. 点击左侧菜单的 **"SQL Editor"**
2. 点击 **"New query"**
3. 复制并执行以下 SQL：

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

### 步骤 3：配置 RLS（行级安全）策略

**重要：** 如果不配置 RLS，数据库会拒绝所有查询！

1. 在 Supabase 项目中，点击左侧菜单的 **"Authentication"** > **"Policies"**
2. 或者直接在 SQL Editor 中执行以下 SQL：

```sql
-- 为 users 表启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 为 expenses 表启用 RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有人读取 users 表
CREATE POLICY "Allow public read access on users"
ON users FOR SELECT
USING (true);

-- 创建策略：允许所有人插入 users 表
CREATE POLICY "Allow public insert access on users"
ON users FOR INSERT
WITH CHECK (true);

-- 创建策略：允许所有人更新 users 表
CREATE POLICY "Allow public update access on users"
ON users FOR UPDATE
USING (true);

-- 创建策略：允许所有人删除 users 表
CREATE POLICY "Allow public delete access on users"
ON users FOR DELETE
USING (true);

-- 创建策略：允许所有人读取 expenses 表
CREATE POLICY "Allow public read access on expenses"
ON expenses FOR SELECT
USING (true);

-- 创建策略：允许所有人插入 expenses 表
CREATE POLICY "Allow public insert access on expenses"
ON expenses FOR INSERT
WITH CHECK (true);

-- 创建策略：允许所有人更新 expenses 表
CREATE POLICY "Allow public update access on expenses"
ON expenses FOR UPDATE
USING (true);

-- 创建策略：允许所有人删除 expenses 表
CREATE POLICY "Allow public delete access on expenses"
ON expenses FOR DELETE
USING (true);
```

### 步骤 4：测试数据库连接

部署完成后：

1. 访问：`https://skifly.vercel.app/test-db`
2. 点击 **"检查配置"** 按钮
3. 应该显示：`✅ 数据库连接成功！`

## 🐛 常见问题

### 问题 1：显示 "Supabase not configured"

**原因：** 环境变量未生效

**解决：**
1. 确认在 Vercel 中已添加环境变量
2. **必须重新部署**才能生效
3. 检查环境变量名称是否正确（区分大小写）

### 问题 2：显示 "Database connection failed"

**原因：** 表不存在或 RLS 策略未配置

**解决：**
1. 检查表是否已创建（步骤 2）
2. 检查 RLS 策略是否已配置（步骤 3）
3. 在 Supabase 的 Table Editor 中手动检查表结构

### 问题 3：显示 "permission denied" 或 "new row violates row-level security policy"

**原因：** RLS 策略配置不正确

**解决：**
1. 执行步骤 3 中的 RLS 策略 SQL
2. 或者暂时禁用 RLS（仅用于测试）：
   ```sql
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
   ```

### 问题 4：数据不同步

**原因：** 代码可能还在使用 localStorage

**解决：**
1. 清除浏览器缓存
2. 重新登录
3. 检查浏览器控制台是否有错误信息

## 📝 检查清单

- [ ] Vercel 环境变量已配置
- [ ] Vercel 项目已重新部署
- [ ] Supabase 表已创建（users 和 expenses）
- [ ] RLS 策略已配置
- [ ] 测试页面显示 "数据库连接成功！"

完成以上所有步骤后，数据库应该可以正常工作了！

