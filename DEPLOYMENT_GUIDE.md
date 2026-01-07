# 🚀 部署指南

本指南将帮助你将滑雪记账网站部署到 GitHub 并发布到公开域名。

## 第一步：上传到 GitHub

### 1. 在 GitHub 创建新仓库

1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - Repository name: `ski-expense-tracker` (或你喜欢的名称)
   - Description: `🎿 滑雪记账网站 - 多人记账应用`
   - 选择 Public（公开）或 Private（私有）
   - **不要**勾选 "Initialize this repository with a README"
4. 点击 "Create repository"

### 2. 推送代码到 GitHub

在终端中执行以下命令（替换 `YOUR_USERNAME` 为你的 GitHub 用户名）：

```bash
cd /Users/rongshunwang/ski-expense-tracker

# 添加远程仓库（替换 YOUR_USERNAME 和 REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 推送代码
git branch -M main
git push -u origin main
```

**或者使用 SSH（如果已配置 SSH 密钥）：**

```bash
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## 第二步：部署到 Vercel（推荐）

### 1. 注册 Vercel 账户

1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub 账户登录（推荐）

### 2. 导入项目

1. 在 Vercel 控制台点击 "Add New..." > "Project"
2. 选择你刚创建的 GitHub 仓库
3. 点击 "Import"

### 3. 配置项目

Vercel 会自动检测 Next.js 项目，配置如下：

- **Framework Preset**: Next.js（自动检测）
- **Build Command**: `npm run build`（自动）
- **Output Directory**: `.next`（自动）
- **Install Command**: `npm install`（自动）

### 4. 设置环境变量

在 "Environment Variables" 部分添加：

```
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

**注意**：
- `OPENAI_API_KEY` 是可选的，如果不使用 AI 功能可以不设置
- `NEXT_PUBLIC_SITE_URL` 会在部署后自动设置为 Vercel 提供的域名

### 5. 部署

点击 "Deploy" 按钮，等待部署完成（通常 2-3 分钟）

### 6. 添加自定义域名（可选）

1. 在项目设置中，进入 "Domains"
2. 输入你的域名（例如：`ski-expense.yourdomain.com`）
3. 按照 Vercel 的指引配置 DNS 记录：
   - 添加 CNAME 记录：`ski-expense` -> `cname.vercel-dns.com`
   - 或添加 A 记录指向 Vercel 的 IP

## 第三步：部署到 Netlify（备选方案）

### 1. 注册 Netlify 账户

访问 [Netlify](https://www.netlify.com) 并使用 GitHub 登录

### 2. 导入项目

1. 点击 "Add new site" > "Import an existing project"
2. 选择 GitHub 并授权
3. 选择你的仓库

### 3. 配置构建设置

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Base directory**: `/`（留空）

### 4. 设置环境变量

在 "Site settings" > "Environment variables" 中添加：

```
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
```

### 5. 部署

点击 "Deploy site"，等待构建完成

## 环境变量说明

### 必需的环境变量

无（所有功能都可以在本地运行）

### 可选的环境变量

- `OPENAI_API_KEY`: OpenAI API 密钥，用于 AI 记账功能
  - 获取方式：访问 [OpenAI Platform](https://platform.openai.com/api-keys)
  - 如果不使用 AI 功能，可以不设置

- `NEXT_PUBLIC_SITE_URL`: 网站公开 URL
  - 部署到 Vercel/Netlify 后会自动设置
  - 如果使用自定义域名，设置为你的域名

## 部署后检查清单

- [ ] 网站可以正常访问
- [ ] 登录功能正常
- [ ] 照片上传功能正常
- [ ] 背景图片显示正常
- [ ] 多语言切换正常
- [ ] AI 记账功能（如果设置了 API Key）正常
- [ ] 移动端响应式设计正常

## 常见问题

### 1. 构建失败

- 检查 Node.js 版本（需要 18.x 或更高）
- 确保所有依赖都已安装：`npm install`
- 检查环境变量是否正确设置

### 2. 图片不显示

- 检查 `next.config.js` 中的图片域名配置
- 确保照片已正确上传到照片墙

### 3. API 错误

- 检查环境变量是否正确设置
- 检查 API 密钥是否有效

## 技术支持

如有问题，请联系：
- 网页创建者和维护者：王荣舜 Roy
- GitHub: https://github.com/rongshunwang
- 版权归属：苏子云 Louis 创立的滑雪飞飞飞群体

