# 🎿 滑雪记账网站

一个专为滑雪旅行设计的多人记账应用，支持多币种、AI智能记账和欠款计算。

## 功能特性

- 🎿 **滑雪主题设计** - 美观的滑雪主题UI，蓝色渐变背景和现代化设计
- 👥 **多人记账** - 支持多用户共同记账，自动计算相互欠款
- 💰 **多币种支持** - 支持欧元(EUR)、瑞士法郎(CHF)、人民币(CNY)，自动汇率转换
- 🤖 **AI智能记账** - 通过聊天或拍照自动识别账单并记账
- 📊 **自动结算** - 智能算法计算最优转账方案，减少转账次数
- 📸 **照片墙** - 上传和分享滑雪照片，记录美好时光

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **AI服务**: OpenAI API (用于AI记账和图片识别)
- **汇率API**: ExchangeRate API (免费汇率服务)
- **图标**: Lucide React

## 快速开始

### 1. 安装依赖

```bash
cd ski-expense-tracker
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件（在项目根目录）：

```env
# OpenAI API Key (用于AI记账功能，可选但推荐)
OPENAI_API_KEY=your_openai_api_key_here

# Exchange Rate API (可选，有默认值)
NEXT_PUBLIC_EXCHANGE_RATE_API=https://api.exchangerate-api.com/v4/latest
```

**注意**: 
- 如果没有OpenAI API密钥，AI功能会使用简单的规则解析模式
- 汇率API是免费的，无需密钥

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 使用说明

### 1. 添加用户
- 在首页的"用户管理"区域添加参与记账的人员
- 每个用户都可以参与记账和结算

### 2. 记账方式

**方式一：手动记账**
- 点击"记账管理"页面
- 点击"添加记账"按钮
- 填写记账信息（描述、金额、货币、日期、付款人、共享人等）

**方式二：AI智能记账**
- 进入"AI记账"页面
- 通过文字描述：例如"我在1月15日花了50欧元买午餐"
- 或上传账单照片：AI会自动识别账单信息并记账

### 3. 查看结算
- 进入"结算中心"页面
- 系统会自动计算所有用户的欠款
- 显示最优的转账方案，减少转账次数

### 4. 照片墙
- 进入"照片墙"页面
- 上传滑雪照片，记录美好时光
- 点击照片可查看大图

## 功能详解

### 多币种支持
- 支持欧元(EUR)、瑞士法郎(CHF)、人民币(CNY)
- 自动获取实时汇率（使用ExchangeRate API）
- 所有记账按当天汇率统一换算后计算结算

### AI智能记账
- **文字识别**: 支持自然语言描述，自动提取日期、金额、货币等信息
- **图片识别**: 上传账单照片，AI自动识别并提取记账信息
- **智能分类**: 自动识别记账类别（餐饮、住宿、交通、滑雪装备等）

### 结算算法
- 使用贪心算法计算最优转账方案
- 自动减少转账次数，简化结算流程
- 支持选择基础货币（EUR/CHF/CNY）

## 项目结构

```
ski-expense-tracker/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   │   ├── chat/         # AI聊天和记账解析
│   │   ├── expenses/     # 记账CRUD
│   │   ├── exchange-rate/# 汇率获取
│   │   └── settlement/   # 结算计算
│   ├── expenses/         # 记账管理页面
│   ├── chat/             # AI记账页面
│   ├── settlement/       # 结算中心页面
│   └── photos/           # 照片墙页面
├── components/           # React组件
│   ├── Navigation.tsx    # 底部导航
│   ├── ExpenseForm.tsx   # 记账表单
│   └── UserManager.tsx   # 用户管理
├── lib/                  # 工具函数
│   ├── currency.ts       # 货币转换
│   ├── settlement.ts     # 结算算法
│   ├── storage.ts        # 本地存储
│   └── ai.ts             # AI相关
├── types/                # TypeScript类型定义
└── public/               # 静态资源
```

## 数据存储

当前版本使用浏览器本地存储（localStorage）保存数据。生产环境建议：
- 使用数据库（如PostgreSQL、MongoDB）
- 添加用户认证
- 支持多设备同步

## 注意事项

1. **OpenAI API**: 
   - 需要有效的OpenAI API密钥才能使用完整的AI功能
   - 如果没有API密钥，系统会使用简单的规则解析模式
   - 图片识别需要GPT-4 Vision模型，可能需要额外费用

2. **汇率API**:
   - 使用免费的ExchangeRate API
   - 如果API不可用，会使用默认汇率（可能不准确）

3. **浏览器兼容性**:
   - 需要支持ES6+的现代浏览器
   - 建议使用Chrome、Firefox、Safari或Edge的最新版本

## 开发计划

- [ ] 添加用户认证和登录
- [ ] 支持数据库存储
- [ ] 添加数据导出功能（Excel、PDF）
- [ ] 支持更多货币
- [ ] 添加统计图表
- [ ] 支持分组记账（多个旅行）
- [ ] 移动端优化

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！
