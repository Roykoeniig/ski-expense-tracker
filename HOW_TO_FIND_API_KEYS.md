# 🔑 如何在 Supabase 中找到 API 密钥

## 📍 详细步骤

### 步骤 1：进入项目设置

1. 登录 Supabase：https://supabase.com
2. 选择你的项目（`ski-expense-tracker`）
3. 在左侧菜单栏，找到并点击 **"Settings"**（⚙️ 齿轮图标）
   - 位置：通常在菜单底部，在 "Database" 和 "API" 之间

### 步骤 2：进入 API 设置

1. 点击 "Settings" 后，会看到设置子菜单
2. 在设置子菜单中，点击 **"API"**
   - 位置：通常在 "General"、"Database"、"Auth" 等选项之后

### 步骤 3：找到 Project URL

在 API 页面顶部，你会看到：

**"Project URL"** 部分
- 显示一个 URL，格式类似：`https://xxxxx.supabase.co`
- 右侧有一个 **复制图标**（📋 或两个重叠的方框）
- **点击复制图标**即可复制

### 步骤 4：找到 anon public key

向下滚动，找到 **"Project API keys"** 部分

在这个部分，你会看到几个 key：

1. **anon** `public` 
   - 这是你需要的 key
   - 显示为：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2...`（很长的一串）
   - 右侧有 **"Reveal"** 或 **"Copy"** 按钮
   - 如果显示 "Reveal"，点击它显示完整 key
   - 然后点击 **复制图标**（📋）复制

2. **service_role** `secret`（可选，用于管理员操作）
   - 这个暂时不需要，可以忽略

## 🎯 你需要复制的两个值

### 1. Project URL
```
格式：https://xxxxx.supabase.co
位置：API 页面顶部 "Project URL" 部分
```

### 2. anon public key
```
格式：eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2...
位置：API 页面 "Project API keys" > "anon" > "public"
```

## 📸 页面结构示意

```
Supabase Dashboard
├── 左侧菜单
│   ├── Table Editor
│   ├── SQL Editor
│   ├── Authentication
│   ├── Storage
│   ├── Database
│   └── Settings ⚙️  ← 点击这里
│       ├── General
│       ├── API ← 点击这里
│       ├── Database
│       └── ...
│
└── 右侧内容区（API 页面）
    ├── Project URL
    │   └── https://xxxxx.supabase.co [📋 复制]
    │
    └── Project API keys
        ├── anon
        │   └── public: eyJhbGc... [Reveal] [📋 复制] ← 这个！
        └── service_role
            └── secret: ...（不需要）
```

## ⚠️ 注意事项

1. **anon public key 很长**：通常有 200+ 个字符，确保完整复制
2. **不要复制 service_role key**：那个是管理员密钥，更敏感
3. **如果看不到 key**：点击 "Reveal" 按钮显示
4. **复制后检查**：确保 key 以 `eyJ` 开头

## ✅ 验证

复制后，检查：
- Project URL：应该以 `https://` 开头，以 `.supabase.co` 结尾
- anon key：应该以 `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` 开头（或类似的 JWT token 格式）

## 🚀 下一步

复制好这两个值后：
1. 去 Vercel 配置环境变量
2. 重新部署
3. 测试数据库连接

---

如果还是找不到，可以：
1. 截图 Supabase 页面发给我
2. 或者告诉我你在哪个页面，我帮你定位

