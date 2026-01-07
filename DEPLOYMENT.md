# 部署指南 - 域名公开化配置

本文档说明如何将滑雪记账网站部署到公开域名。

## 域名配置

### 1. 环境变量配置

在部署环境中设置以下环境变量：

```env
# 网站域名（替换为你的实际域名）
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# 或者使用子域名
NEXT_PUBLIC_SITE_URL=https://ski-expense.your-domain.com
```

### 2. Vercel 部署（推荐）

1. 将代码推送到 GitHub/GitLab
2. 在 [Vercel](https://vercel.com) 导入项目
3. 在项目设置中添加环境变量
4. 在 Settings > Domains 中添加你的自定义域名
5. 按照 Vercel 的指引配置 DNS 记录

### 3. 其他平台部署

#### Netlify
1. 连接 Git 仓库
2. 构建命令: `npm run build`
3. 发布目录: `.next`
4. 在 Domain settings 中添加自定义域名

#### 自托管服务器
1. 构建项目: `npm run build`
2. 启动生产服务器: `npm start`
3. 配置 Nginx/Apache 反向代理
4. 配置 SSL 证书（Let's Encrypt）

### 4. DNS 配置

根据你的域名提供商，添加以下 DNS 记录：

**A 记录（IPv4）:**
```
类型: A
名称: @ 或 ski-expense
值: [服务器IP地址]
TTL: 3600
```

**CNAME 记录（如果使用子域名）:**
```
类型: CNAME
名称: ski-expense
值: [Vercel/Netlify提供的域名]
TTL: 3600
```

### 5. SSL 证书

确保网站使用 HTTPS：
- Vercel/Netlify 自动提供 SSL
- 自托管服务器可以使用 Let's Encrypt

### 6. 更新网站元数据

部署后，更新 `app/layout.tsx` 中的 metadata，包含实际域名：

```typescript
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'),
  // ... 其他配置
}
```

## 当前配置

网站已配置为支持：
- ✅ CORS 跨域访问
- ✅ 多语言支持（中文/英文/德语）
- ✅ 响应式设计
- ✅ SEO 优化

## 注意事项

1. **API 密钥安全**: 确保 `OPENAI_API_KEY` 等敏感信息只在服务器端使用
2. **域名备案**: 如果使用中国服务器，需要完成域名备案
3. **CDN 加速**: 建议使用 CDN 加速静态资源
4. **监控**: 建议配置错误监控和性能监控

## 支持

如有问题，请联系：
- 网页创建者和维护者：王荣舜 Roy
- 版权归属：苏子云 Louis 创立的滑雪飞飞飞群体

