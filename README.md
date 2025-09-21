
## **在线体验**: [AI Studio](https://ai.studio/apps/drive/18viNeAZXmMF6MuR2xxTcCXI6BWBR3Nfa)
# AI 照片编辑器

一款基于 Google Gemini AI 模型的智能照片编辑应用，让您通过简单的文字描述就能创造出令人惊艳的图片效果。

## ✨ 功能特色

- 🎨 **智能图片编辑** - 使用 Gemini AI 模型进行高质量的图片生成和编辑
- 📝 **自定义提示词** - 支持自由输入编辑指令，让创意无限延伸
- 🎯 **预设模板** - 内置多种实用模板：3D手办、旧照片修复、肖像照等
- 🔄 **连续编辑** - 支持将生成结果作为新输入，实现多轮创作
- 📱 **响应式设计** - 完美适配桌面和移动设备
- ⚡ **实时预览** - 即时查看编辑效果，支持一键下载

## 🚀 快速开始

### 环境要求

- Node.js (推荐版本 16+)

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd nano-ps-main
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置 API 密钥**
   
   在项目根目录创建 `.env.local` 文件，并添加您的 Gemini API 密钥：
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **启动应用**
   ```bash
   npm run dev
   ```

5. **访问应用**
   
   打开浏览器访问 `http://localhost:5173`

## 📖 使用指南

1. **上传图片** - 点击上传区域选择您要编辑的图片
2. **输入提示词** - 在文本框中描述您想要的编辑效果，或选择预设模板
3. **生成结果** - 点击"开始编辑"按钮，AI 将根据您的描述生成新图片
4. **下载或继续编辑** - 可以下载生成的结果，或将其作为新输入继续创作

## 🛠️ 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite
- **AI 模型**: Google Gemini API
- **样式**: Tailwind CSS
- **状态管理**: React Hooks

## 📁 项目结构

```
nano-ps-main/
├── components/          # React 组件
│   ├── EditPanel.tsx   # 编辑面板
│   ├── ImageDisplay.tsx # 图片显示
│   ├── ImageUploader.tsx # 图片上传
│   └── ...
├── services/           # 服务层
│   └── geminiService.ts # Gemini API 服务
├── types.ts           # TypeScript 类型定义
├── constants.ts       # 常量配置
└── App.tsx           # 主应用组件
```

## 🔧 开发命令

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建

## 📝 许可证

本项目采用 MIT 许可证。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目！

---
