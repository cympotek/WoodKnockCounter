# Vercel 部署指令

## 快速部署

1. **安裝 Vercel CLI**
```bash
npm i -g vercel
```

2. **登錄 Vercel**
```bash
vercel login
```

3. **初始化並部署**
```bash
vercel
```

## 環境變數設置

在 Vercel 儀表板或通過 CLI 設置以下環境變數：

```bash
vercel env add DATABASE_URL
# 輸入: postgres://neondb_owner:npg_ze2dqIfL4AJY@ep-summer-bonus-a1c71d1u-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

vercel env add SESSION_SECRET
# 輸入: 7ba149c47646031d56c12ee8e9097a062eecafb0b7cd0d55dbc157e08a3ab9ad

vercel env add REPL_ID  
# 輸入: e3739829-6c92-4923-9507-c8ee07c4e5e7

vercel env add ISSUER_URL
# 輸入: https://replit.com/oidc

vercel env add REPLIT_DOMAINS
# 輸入您的 Vercel 域名 (例如: your-app.vercel.app)
```

## 部署後檢查

1. 驗證身份驗證流程
2. 測試木魚敲擊功能
3. 檢查排行榜數據

您的 Neon 數據庫已配置完成，可以直接開始部署。