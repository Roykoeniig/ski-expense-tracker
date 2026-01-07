# 📱 iOS App 开发指南

本指南将帮助你将滑雪记账网站转换为可以在 App Store 上架的 iOS 应用。

## 前置要求

1. **macOS 系统**（必需，iOS 开发只能在 Mac 上）
2. **Xcode**（从 App Store 免费下载）
3. **Apple Developer 账户**（$99/年，用于发布到 App Store）
4. **Node.js**（已安装）

## 第一步：安装依赖

```bash
cd /Users/rongshunwang/ski-expense-tracker
npm install
```

## 第二步：构建静态网站

```bash
npm run build
```

这会生成 `out` 目录，包含所有静态文件。

## 第三步：初始化 Capacitor

```bash
npx cap init "滑雪记账" "com.skifly.expense" --web-dir="out"
```

## 第四步：添加 iOS 平台

```bash
npx cap add ios
```

## 第五步：同步文件到 iOS 项目

```bash
npx cap sync ios
```

## 第六步：在 Xcode 中打开项目

```bash
npx cap open ios
```

这会在 Xcode 中打开 iOS 项目。

## 第七步：在 Xcode 中配置

### 1. 配置 Bundle Identifier

1. 在 Xcode 中选择项目（左侧导航栏最上方）
2. 选择 "Signing & Capabilities" 标签
3. 确保 "Automatically manage signing" 已勾选
4. 选择你的 Team（需要 Apple Developer 账户）

### 2. 配置应用图标和启动画面

1. 在 Xcode 中，选择 `AppIcon` 资源
2. 添加应用图标（需要 1024x1024 的 PNG 图片）
3. 配置启动画面

### 3. 配置 Info.plist

在 `Info.plist` 中添加以下配置：

```xml
<key>NSCameraUsageDescription</key>
<string>需要访问相机以拍摄账单照片</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>需要访问相册以上传照片</string>
```

### 4. 配置 URL Scheme（可选）

如果需要深度链接，可以配置 URL Scheme。

## 第八步：测试应用

### 在模拟器中测试

1. 在 Xcode 顶部选择模拟器（例如：iPhone 14 Pro）
2. 点击运行按钮（▶️）或按 `Cmd + R`
3. 应用会在模拟器中启动

### 在真机上测试

1. 用 USB 连接 iPhone 到 Mac
2. 在 Xcode 顶部选择你的设备
3. 点击运行按钮
4. 首次运行需要在 iPhone 上信任开发者证书：
   - 设置 > 通用 > VPN与设备管理 > 信任开发者

## 第九步：准备发布到 App Store

### 1. 创建 App Store Connect 记录

1. 访问 [App Store Connect](https://appstoreconnect.apple.com)
2. 登录你的 Apple Developer 账户
3. 点击 "我的 App" > "+" > "新建 App"
4. 填写应用信息：
   - 平台：iOS
   - 名称：滑雪记账
   - 主要语言：简体中文
   - Bundle ID：选择 `com.skifly.expense`
   - SKU：唯一标识符（例如：ski-expense-001）

### 2. 准备应用截图和描述

需要准备：
- 应用截图（不同尺寸的 iPhone）
- 应用描述
- 关键词
- 隐私政策 URL（必需）

### 3. 构建归档（Archive）

1. 在 Xcode 中，选择 "Product" > "Archive"
2. 等待构建完成
3. 在 Organizer 窗口中，点击 "Distribute App"
4. 选择 "App Store Connect"
5. 按照向导完成上传

### 4. 提交审核

1. 在 App Store Connect 中完成应用信息
2. 上传构建版本
3. 填写审核信息
4. 提交审核

## 应用配置建议

### 应用图标

创建 1024x1024 的 PNG 图标，包含：
- 滑雪元素
- 蓝色主题
- 简洁设计

### 启动画面

可以自定义启动画面，显示：
- 应用 Logo
- 加载动画
- 品牌颜色

### 应用描述（建议）

```
🎿 滑雪记账 - 专为滑雪旅行设计的多人记账应用

功能特色：
• 多人共同记账，自动计算相互欠款
• 支持欧元、瑞士法郎、人民币，自动汇率转换
• AI智能记账，拍照识别账单
• 自动结算，优化转账方案
• 照片墙，记录美好时光
• 多语言支持（中文、英文、德语）

专为滑雪爱好者设计，让旅行记账变得简单！
```

## 常见问题

### 1. 构建失败

- 检查 Node.js 版本（需要 18+）
- 确保所有依赖已安装
- 清理构建：`npm run build` 然后 `npx cap sync ios`

### 2. 应用无法访问网络

- 检查 `Info.plist` 中的网络权限
- 确保 API 端点使用 HTTPS

### 3. 本地存储问题

- Capacitor 使用原生存储，代码会自动适配
- 测试时确保数据持久化正常

## 后续更新

每次更新应用：

1. 修改代码
2. 运行 `npm run build`
3. 运行 `npx cap sync ios`
4. 在 Xcode 中重新构建和上传

## 技术支持

如有问题，请参考：
- [Capacitor 文档](https://capacitorjs.com/docs)
- [Apple Developer 文档](https://developer.apple.com/documentation/)

---

**注意**：首次发布到 App Store 需要：
- Apple Developer 账户（$99/年）
- 应用审核（通常 1-3 天）
- 隐私政策 URL（必需）

祝你发布成功！🎉


