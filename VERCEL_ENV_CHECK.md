# Vercel 环境变量配置检查清单

## ⚠️ 当前问题：Supabase 未配置

错误信息显示环境变量未生效。请按照以下步骤检查：

## ✅ 步骤 1：确认环境变量已添加

1. 访问：https://vercel.com/dashboard
2. 进入你的项目（`skifly` 或 `ski-expense-tracker`）
3. 点击顶部菜单的 **"Settings"**
4. 点击左侧菜单的 **"Environment Variables"**
5. 确认有以下两个变量：
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ✅ 步骤 2：检查环境变量值

### 检查 NEXT_PUBLIC_SUPABASE_URL
- 应该以 `https://` 开头
- 格式类似：`https://xxxxx.supabase.co`
- 不能有尾随斜杠 `/`

### 检查 NEXT_PUBLIC_SUPABASE_ANON_KEY
- 应该是一串很长的字符（通常以 `eyJ` 开头）
- 这是 JWT token 格式

## ✅ 步骤 3：确认环境变量作用域

每个环境变量都应该勾选：
- ✅ **Production**（生产环境）
- ✅ **Preview**（预览环境）
- ✅ **Development**（开发环境）

**重要：** 如果只勾选了 Production，预览部署可能无法使用环境变量。

## ✅ 步骤 4：重新部署（必须！）

**这是最关键的一步！** 修改环境变量后，必须重新部署才能生效。

### 方法 1：通过 Vercel Dashboard 重新部署

1. 在 Vercel 项目页面，点击 **"Deployments"**
2. 找到最新的部署（最上面的）
3. 点击右侧的 **"..."** 菜单（三个点）
4. 选择 **"Redeploy"**
5. 在弹出窗口中，确认勾选了 **"Use existing Build Cache"**（可选）
6. 点击 **"Redeploy"**
7. 等待部署完成（约 2-3 分钟）

### 方法 2：通过 Git 推送触发部署

如果你修改了代码并推送到 GitHub，Vercel 会自动部署：

```bash
# 创建一个空提交来触发部署
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```

## ✅ 步骤 5：验证环境变量是否生效

部署完成后：

1. 访问：`https://skifly.vercel.app/test-db`
2. 点击 **"检查配置"** 按钮
3. 应该显示：`✅ 数据库连接成功！`

如果还是显示 "Supabase not configured"，说明：
- 环境变量名称可能拼写错误
- 环境变量值可能不正确
- 部署可能还没有完成（等待几分钟）

## 🔍 常见问题

### 问题 1：环境变量已添加，但还是显示未配置

**原因：** 没有重新部署

**解决：** 执行步骤 4 重新部署

### 问题 2：环境变量名称拼写错误

**检查：**
- `NEXT_PUBLIC_SUPABASE_URL`（注意大小写和拼写）
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`（注意大小写和拼写）

**注意：** Next.js 的环境变量必须以 `NEXT_PUBLIC_` 开头才能在客户端使用。

### 问题 3：环境变量值不正确

**检查：**
- URL 是否正确（从 Supabase Dashboard → Settings → API 获取）
- Anon Key 是否正确（从 Supabase Dashboard → Settings → API 获取）

### 问题 4：只配置了 Production，Preview 无法使用

**解决：** 在添加环境变量时，确保勾选所有环境（Production、Preview、Development）

## 📝 快速检查清单

完成以下所有步骤：

- [ ] 在 Vercel 中已添加 `NEXT_PUBLIC_SUPABASE_URL`
- [ ] 在 Vercel 中已添加 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] 两个环境变量都勾选了 Production、Preview、Development
- [ ] 环境变量值正确（从 Supabase Dashboard 获取）
- [ ] 已重新部署 Vercel 项目
- [ ] 等待部署完成（2-3 分钟）
- [ ] 测试页面显示 "数据库连接成功！"

## 💡 获取 Supabase 环境变量

如果不知道如何获取环境变量：

1. 访问：https://supabase.com/dashboard
2. 进入你的项目
3. 点击左侧菜单的 **"Settings"**（齿轮图标）
4. 点击 **"API"**
5. 在 **"Project URL"** 部分，复制 URL（这就是 `NEXT_PUBLIC_SUPABASE_URL`）
6. 在 **"Project API keys"** 部分，找到 **"anon public"** key，点击眼睛图标显示，然后复制（这就是 `NEXT_PUBLIC_SUPABASE_ANON_KEY`）

## 🚀 完成后的下一步

环境变量配置正确并重新部署后：

1. 访问：`https://skifly.vercel.app/import-data`
2. 点击 **"测试数据库连接"** 按钮
3. 应该显示：`✅ 所有测试通过！`
4. 然后点击 **"导入到 Supabase"** 导入数据

