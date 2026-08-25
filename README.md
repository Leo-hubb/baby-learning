# 宝贝学习乐园 - 儿童学习工作台

为4岁左右儿童打造的综合学习Web应用，包含英语乐园、识字花园、数字王国、逻辑挑战、闯关冒险五大模块。

## 技术栈

- **前端框架**: React 18 + Vite + TypeScript
- **样式方案**: Tailwind CSS（彩虹糖果色主题）
- **语音功能**: Web Speech API（SpeechSynthesis 发音）
- **数据存储**: localStorage 本地缓存 + Supabase 云端同步（可选配置）
- **路由**: React Router v6（HashRouter，兼容静态部署）
- **动画**: Framer Motion + CSS Animation
- **二维码**: qrcode.react

## 功能模块

### 1. 英语乐园（基于BIGFUN教材）
- 3个级别，每级10个主题单元（家庭、动物、食物、颜色、数字、身体、学校、玩具、自然、交通）
- 单词卡片学习（点击发音）
- 句型学习（整句朗读）
- 情景游戏（听音选图，满分100分）
- 单元解锁机制（单词全学+句型听读+游戏≥80分）

### 2. 识字花园（基于洪恩识字教材）
- 6个级别，共120个精选常用汉字（可扩展至600字）
- 汉字卡片（拼音、部首、笔画数、发音）
- 笔顺演示动画
- 组词学习（点击发音）
- 例句展示
- 巩固练习（听音选字）
- 今日复习功能（随机抽取已学汉字测试）

### 3. 数字王国
- 数字认知（0-20，点击发音）
- 10以内加减法练习（随机出题，4选1）
- 数数小游戏（数emoji数量）
- 连续答对5题奖励额外星星

### 4. 逻辑挑战
- 找规律（图形序列推理）
- 图形配对
- 排序题
- 难度随答题数量递增（3级难度）
- 连续答对10题奖励徽章

### 5. 闯关冒险
- 10个关卡，每关10道混合题（涵盖英语、识字、数学、逻辑）
- 每关最多13颗星（全对额外+3）
- 关卡解锁机制
- 12种成就徽章

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

### 生成 PWA 图标
```bash
npm run generate-icons
```

## PWA 安装使用（手机/平板/电脑通用）

本应用已配置为 PWA（渐进式Web应用），可一键安装到设备桌面，像原生App一样使用。

### 手机/平板（Android）
1. 用 Chrome 或 Edge 浏览器打开应用网址
2. 浏览器会自动弹出「添加到主屏幕」提示，点击即可
3. 或点击浏览器菜单 →「添加到主屏幕」/「安装应用」
4. 安装后桌面出现应用图标，点击全屏运行，支持离线使用

### 手机/平板（iOS / iPadOS）
1. 用 Safari 浏览器打开应用网址
2. 点击底部分享按钮 ⎋
3. 选择「添加到主屏幕」
4. 点击「添加」，桌面出现应用图标

### 电脑（Windows / macOS）
1. 用 Chrome 或 Edge 浏览器打开应用网址
2. 地址栏右侧会出现「安装」图标 📥，点击即可
3. 或点击浏览器菜单 →「安装宝贝学习乐园」
4. 安装后出现在开始菜单（Windows）/启动台（macOS），窗口化独立运行

### PWA 特性
- ✅ 全屏独立运行，无浏览器地址栏
- ✅ 离线可用（Service Worker 缓存）
- ✅ 启动画面（彩虹渐变动画）
- ✅ 应用图标和名称
- ✅ 自动更新（新版本自动缓存）
- ✅ 一套代码适配手机、平板、电脑

## 部署

### Vercel 部署（推荐）
1. 将代码推送到 GitHub 仓库
2. 在 Vercel 导入仓库
3. 框架预设选择 Vite
4. 构建命令：`npm run build`
5. 输出目录：`dist`
6. 点击部署

### Netlify 部署
1. 将代码推送到 GitHub
2. 在 Netlify 添加新站点
3. 构建命令：`npm run build`
4. 发布目录：`dist`

### 本地静态部署
构建后将 `dist` 目录部署到任意静态文件服务器。

## 云端同步配置（Supabase）

本应用默认使用 localStorage 存储数据。如需云端同步和跨设备同步，按以下步骤配置 Supabase：

### 1. 创建 Supabase 项目
访问 https://supabase.com 创建免费项目。

### 2. 执行数据库 Schema
在 Supabase SQL Editor 中执行 `supabase-schema.sql` 文件中的SQL。

### 3. 配置环境变量
在项目根目录创建 `.env` 文件：
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 启用匿名认证
在 Supabase Authentication → Settings 中启用匿名登录。

## 数据存储说明

- **本地存储**: 所有学习进度、星星数、徽章数据存储在浏览器 localStorage
- **数据键名**: `baby_learning_state`
- **离线支持**: 断网时可正常使用已缓存数据
- **数据导出**: 家长模式中可导出 JSON 格式学习数据

## 跨设备同步

当前版本使用匿名用户ID + localStorage，同一浏览器内数据持久化。跨设备同步方案：
1. 配置 Supabase 后支持邮箱登录同步
2. 或使用家长模式的数据导出/导入功能手动迁移

## 按钮规范

- 所有可点击元素最小点击区域：44×44px
- 移动端建议：48×48px
- 按钮点击时有缩放反馈动画

## 响应式设计

- **PC端（≥768px）**: 左侧固定220px侧边栏导航
- **移动端（<768px）**: 底部固定60px Tab栏（5个图标+文字）
- 移动端优先设计

## 项目结构

```
baby-learning/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── supabase-schema.sql
├── README.md
└── src/
    ├── main.tsx              # 入口文件
    ├── App.tsx               # 路由配置
    ├── index.css             # 全局样式+Tailwind
    ├── types/
    │   └── index.ts          # TypeScript类型定义
    ├── data/
    │   ├── english.ts        # 英语教材数据
    │   ├── literacy.ts       # 汉字库数据
    │   ├── math.ts           # 数学题目生成
    │   ├── logic.ts          # 逻辑题目生成
    │   ├── adventure.ts      # 闯关题库生成
    │   └── badges.ts         # 徽章定义
    ├── store/
    │   └── useStore.ts       # 全局状态管理
    ├── utils/
    │   └── speech.ts         # 语音合成+音效工具
    ├── components/
    │   ├── Layout.tsx        # 布局组件
    │   ├── Sidebar.tsx       # PC侧边栏
    │   ├── BottomTab.tsx     # 移动端底部Tab
    │   ├── StarCounter.tsx   # 星星计数器
    │   ├── StarBurst.tsx     # 星星爆炸动画
    │   └── Confetti.tsx      # 撒花动画
    └── pages/
        ├── English.tsx       # 英语乐园
        ├── Literacy.tsx      # 识字花园
        ├── Math.tsx          # 数字王国
        ├── Logic.tsx         # 逻辑挑战
        ├── Adventure.tsx     # 闯关冒险
        ├── Badges.tsx        # 徽章墙
        └── Settings.tsx      # 设置页
```

## 浏览器兼容性

- Chrome 33+ (SpeechSynthesis)
- Edge 79+
- Safari 7+
- Firefox 49+

## License

MIT
