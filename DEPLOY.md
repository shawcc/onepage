# 部署指南 (Deployment Guide)

本项目已经配置为可以直接部署到 **Vercel**，支持前端 (React + Vite) 和后端 API (Express + Serverless Functions) 的无缝集成。

## 1. 准备工作

*   一个 [GitHub](https://github.com/) 账号
*   一个 [Vercel](https://vercel.com/) 账号
*   (可选) [Supabase](https://supabase.com/) 账号 (如果需要数据库功能)

## 2. 部署步骤

### 第一步：推送到 GitHub
将你的代码提交并推送到 GitHub 仓库。

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 第二步：在 Vercel 中导入项目
1. 登录 Vercel 控制台。
2. 点击 **"Add New..."** -> **"Project"**.
3. 选择你刚才推送的 GitHub 仓库并点击 **"Import"**.

### 第三步：配置构建设置
Vercel 通常会自动检测项目设置。请确认以下信息：
*   **Framework Preset**: Vite
*   **Root Directory**: `./` (默认)
*   **Build Command**: `npm run build` (默认)
*   **Output Directory**: `dist` (默认)

### 第四步：环境变量 (Environment Variables)
如果你的项目需要连接 Supabase，请在 "Environment Variables" 区域添加以下变量：

*   `VITE_SUPABASE_URL`: 你的 Supabase URL
*   `VITE_SUPABASE_ANON_KEY`: 你的 Supabase Anon Key

### 第五步：点击 Deploy
点击 **"Deploy"** 按钮。等待几分钟，你的应用就会上线了！

## 3. 项目结构说明

*   **前端**: 位于 `src/`，构建后生成到 `dist/`。
*   **后端 API**: 位于 `api/`。通过 `vercel.json` 配置，所有 `/api/*` 的请求都会被路由到 `api/index.ts`，作为 Serverless Function 运行。
*   **配置文件**: `vercel.json` 已经配置好了路由重写规则。

## 4. 常见问题

*   **API 404**: 确保 `vercel.json` 存在且配置正确。
*   **Build 失败**: 请先在本地运行 `npm run build` 确保没有 TypeScript 错误。
