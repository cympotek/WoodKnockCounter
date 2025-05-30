# 🎯 Vercel 部署就緒

您的木魚敲擊應用已完全配置好，可以立即部署到 Vercel！

## 生成的安全密鑰

✅ **SESSION_SECRET**: `7ba149c47646031d56c12ee8e9097a062eecafb0b7cd0d55dbc157e08a3ab9ad`
✅ **REPL_ID**: `e3739829-6c92-4923-9507-c8ee07c4e5e7`

## 立即部署

```bash
# 1. 安裝 Vercel CLI
npm i -g vercel

# 2. 登錄
vercel login

# 3. 部署
vercel
```

## 環境變數 (複製貼上使用)

```
DATABASE_URL=postgres://neondb_owner:npg_ze2dqIfL4AJY@ep-summer-bonus-a1c71d1u-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
SESSION_SECRET=7ba149c47646031d56c12ee8e9097a062eecafb0b7cd0d55dbc157e08a3ab9ad
REPL_ID=e3739829-6c92-4923-9507-c8ee07c4e5e7
ISSUER_URL=https://replit.com/oidc
REPLIT_DOMAINS=your-vercel-domain.vercel.app
```

部署完成後，請將 `REPLIT_DOMAINS` 更新為您實際的 Vercel 域名。

您的木魚應用將支持：
- 用戶登錄註冊
- 敲擊記錄保存
- 每日功德統計
- 全球排行榜
- 個人設置同步