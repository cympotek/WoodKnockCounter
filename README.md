# 木魚敲擊 - 數位禪修應用

一個現代化的木魚敲擊應用，將傳統佛教修行數位化，提供沉浸式的正念體驗。

## 功能特色

- **即時敲擊體驗** - 流暢的點擊反饋，音效和動畫同步
- **個人修行記錄** - 追蹤每日功德和敲擊歷史
- **全球排行榜** - 與其他用戶比較修行進度
- **批次處理技術** - 優化的連續敲擊體驗
- **用戶認證系統** - 安全的登錄註冊功能
- **響應式設計** - 移動端優先的用戶界面

## 技術架構

### 前端
- **React 18** - 現代化用戶界面框架
- **TypeScript** - 類型安全的開發體驗
- **Tailwind CSS** - 快速樣式開發
- **Vite** - 快速的構建工具
- **TanStack Query** - 狀態管理和數據獲取
- **Wouter** - 輕量級路由解決方案

### 後端
- **Express.js** - Node.js 服務器框架
- **Drizzle ORM** - 類型安全的數據庫查詢
- **PostgreSQL** - 可靠的關係型數據庫
- **Passport.js** - 身份認證中間件
- **WebSockets** - 實時通信支持

### 部署平台
- **Vercel** - 無服務器部署平台
- **Neon** - 現代化 PostgreSQL 服務

## 快速開始

### 本地開發

1. **克隆項目**
```bash
git clone <your-repo-url>
cd wooden-fish-app
```

2. **安裝依賴**
```bash
npm install
```

3. **環境配置**
```bash
cp .env.example .env.local
# 編輯 .env.local 添加您的數據庫連接字符串
```

4. **數據庫設置**
```bash
npm run db:push
```

5. **啟動開發服務器**
```bash
npm run dev
```

應用將在 `http://localhost:5000` 運行

### 部署到 Vercel

1. **安裝 Vercel CLI**
```bash
npm i -g vercel
```

2. **登錄並部署**
```bash
vercel login
vercel
```

3. **設置環境變數**
- `DATABASE_URL` - PostgreSQL 連接字符串
- `SESSION_SECRET` - 會話密鑰
- `REPL_ID` - 應用標識符
- `ISSUER_URL` - 認證服務地址
- `REPLIT_DOMAINS` - 允許的域名

詳細部署指南請參考 `VERCEL_READY.md`

## 項目結構

```
├── client/                 # 前端代碼
│   ├── src/
│   │   ├── components/     # React 組件
│   │   ├── pages/         # 頁面組件
│   │   ├── hooks/         # 自定義 Hooks
│   │   └── lib/           # 工具函數
├── server/                # 後端代碼
│   ├── routes.ts          # API 路由
│   ├── storage.ts         # 數據存儲層
│   ├── db.ts             # 數據庫連接
│   └── replitAuth.ts     # 認證配置
├── shared/                # 共享代碼
│   └── schema.ts         # 數據庫模式
├── api/                  # Vercel 函數
└── dist/                # 構建輸出
```

## 主要組件

### WoodenFish 組件
核心敲擊界面，提供：
- 視覺動畫效果
- 音頻播放
- 觸摸反饋
- 連續敲擊優化

### 數據模型
- **Users** - 用戶信息
- **DailyTaps** - 每日敲擊記錄
- **TapRecords** - 詳細敲擊歷史
- **UserSettings** - 用戶偏好設置

## 性能優化

- **批次處理** - 3秒內的連續敲擊合併為單次請求
- **本地狀態** - 即時更新計數器，減少延遲
- **數據庫索引** - 優化查詢性能
- **懶加載** - 按需加載組件和資源

## 安全特性

- **會話管理** - 安全的用戶會話處理
- **數據驗證** - 輸入數據嚴格驗證
- **SQL 注入防護** - 使用參數化查詢
- **CORS 配置** - 跨域請求安全控制

## 貢獻指南

1. Fork 項目
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 創建 Pull Request

## 許可證

本項目採用 MIT 許可證 - 詳見 [LICENSE](LICENSE) 文件

## 支持

如有問題或建議，請提交 Issue 或聯繫開發團隊。

---

願您在數位木魚的陪伴下，找到內心的平靜與智慧。🙏