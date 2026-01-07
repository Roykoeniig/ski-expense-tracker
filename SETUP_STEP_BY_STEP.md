# 📋 Supabase 数据库配置 - 分步指南

## ⚠️ 当前状态

你的测试显示：`Supabase not configured`，需要完成以下配置。

---

## 🎯 第一步：创建 Supabase 项目

### 1.1 访问 Supabase
👉 **打开浏览器，访问：** https://supabase.com

### 1.2 登录/注册
- 点击右上角 "Start your project"
- 使用 **GitHub 账户登录**（推荐，最快）
- 或使用邮箱注册

### 1.3 创建新项目
1. 登录后，点击 **"New Project"** 按钮
2. 填写项目信息：
   ```
   Organization: 选择你的组织（或创建新组织）
   Name: ski-expense-tracker
   Database Password: [设置一个强密码，请保存好！]
   Region: Southeast Asia (Singapore) [或离你最近的]
   Pricing Plan: Free [免费计划即可]
   ```
3. 点击 **"Create new project"**
4. ⏳ 等待项目创建完成（约 2 分钟，会显示进度）

---

## 🗄️ 第二步：创建数据库表

### 2.1 打开 SQL Editor
项目创建完成后：
1. 在左侧菜单点击 **"SQL Editor"**（图标像 `</>`）
2. 点击 **"New query"** 按钮

### 2.2 执行 SQL 语句
1. **完全清空**编辑框
2. **复制以下所有 SQL 代码**（从 `-- 创建用户表` 到最后的 `);`）：

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

3. **粘贴**到 SQL Editor
4. 点击右下角 **"Run"** 按钮（或按 `Cmd/Ctrl + Enter`）
5. ✅ 应该看到 "Success. No rows returned"

---

## 🔑 第三步：获取 API 密钥

### 3.1 进入 API 设置
1. 在 Supabase 项目页面，点击左侧 **"Settings"**（⚙️ 齿轮图标）
2. 在设置菜单中，点击 **"API"**

### 3.2 复制密钥
你会看到两个重要的值：

**1. Project URL**
- 位置：在 "Project URL" 标题下
- 格式：`https://xxxxx.supabase.co`
- 📋 **复制这个 URL**（点击右侧的复制图标）

**2. anon public key**
- 位置：在 "Project API keys" > "anon" > "public"
- 格式：以 `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` 开头，很长
- 📋 **复制这个 key**（点击右侧的复制图标）

⚠️ **重要**：请保存这两个值，下一步需要用到！

---

## ⚙️ 第四步：在 Vercel 配置环境变量

### 4.1 打开 Vercel 项目设置
1. 访问：https://vercel.com/dashboard
2. 找到你的项目（`ski-expense-tracker` 或 `skifly`）
3. 点击项目进入详情页

### 4.2 进入环境变量设置
1. 点击顶部菜单的 **"Settings"**
2. 在左侧菜单选择 **"Environment Variables"**

### 4.3 添加第一个环境变量
1. 点击 **"Add New"** 按钮
2. 填写：
   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: [粘贴你刚才复制的 Project URL]
   Environment: ☑️ Production ☑️ Preview ☑️ Development
   ```
3. 点击 **"Save"**

### 4.4 添加第二个环境变量
1. 再次点击 **"Add New"** 按钮
2. 填写：
   ```
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: [粘贴你刚才复制的 anon public key]
   Environment: ☑️ Production ☑️ Preview ☑️ Development
   ```
3. 点击 **"Save"**

### 4.5 确认
你应该看到两个环境变量：
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🚀 第五步：重新部署

### 5.1 触发重新部署
1. 在 Vercel 项目页面，点击顶部 **"Deployments"** 标签
2. 找到最新的部署（最上面的）
3. 点击右侧的 **"..."** 菜单（三个点）
4. 选择 **"Redeploy"**
5. 确认重新部署

### 5.2 等待部署完成
- ⏳ 等待约 2-3 分钟
- 你会看到部署状态从 "Building" 变为 "Ready"
- 部署完成后，状态会显示绿色 ✅

---

## ✅ 第六步：验证配置

### 6.1 测试数据库连接
部署完成后：
1. 访问：`https://你的网站域名/api/test-db`
   - 例如：`https://skifly.vercel.app/api/test-db`
2. 应该看到：
   ```json
   {
     "success": true,
     "message": "数据库连接成功！",
     "tables": {
       "users": "连接正常",
       "expenses": "连接正常"
     }
   }
   ```

### 6.2 测试数据同步
1. **在设备 A**：
   - 登录网站
   - 添加一个用户
   - 创建一条记账
   - 打开浏览器控制台（F12），应该看到同步日志

2. **在设备 B**（或新浏览器）：
   - 登录网站
   - 刷新页面
   - 应该能看到设备 A 创建的用户和记账

---

## 🎉 完成！

如果测试通过，你的数据库就配置成功了！

---

## ❓ 遇到问题？

### 问题 1：环境变量配置后还是不工作
**解决**：
1. 确认已点击 "Redeploy" 重新部署
2. 等待 2-3 分钟让部署完成
3. 清除浏览器缓存（Cmd/Ctrl + Shift + R）
4. 再次测试

### 问题 2：SQL 执行失败
**解决**：
1. 检查是否完全复制了所有 SQL 代码
2. 确认没有遗漏任何分号 `;`
3. 查看错误信息，通常是表已存在（可以忽略）

### 问题 3：找不到 API 密钥
**解决**：
1. 确认在正确的项目页面
2. 点击 Settings > API（不是其他设置）
3. 如果看不到，可能是项目还在创建中，等待几分钟

### 问题 4：Vercel 找不到环境变量设置
**解决**：
1. 确认已登录 Vercel
2. 确认在正确的项目页面
3. 路径：项目 > Settings > Environment Variables

---

## 📞 需要帮助？

如果完成以上步骤后仍有问题，请告诉我：
1. 你在哪一步遇到问题
2. 具体的错误信息或截图
3. 浏览器控制台的错误（F12 > Console）

我会帮你解决！

