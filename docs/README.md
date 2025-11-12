# GitHub Pages 設定說明

本目錄包含用於 GitHub Pages 的隱私權政策頁面。

## 檔案說明

- `index.html` - 隱私權政策頁面

## 設定 GitHub Pages

### 方法一：使用 GitHub Actions（推薦）

1. 確保 `.github/workflows/deploy-gh-pages.yml` 檔案存在
2. 推送程式碼到 GitHub 後，GitHub Actions 會自動部署
3. 在 GitHub 專案設定中啟用 GitHub Pages：
   - 前往 Settings > Pages
   - Source 選擇 "GitHub Actions"

### 方法二：手動設定

1. 前往 GitHub 專案設定：Settings > Pages
2. Source 選擇 "Deploy from a branch"
3. Branch 選擇 `main` 或 `master`
4. Folder 選擇 `/docs`
5. 點擊 Save

## 訪問隱私權政策

部署完成後，您的隱私權政策頁面將可在以下網址訪問：

```
https://[您的GitHub用戶名].github.io/[專案名稱]/
```

例如：
```
https://username.github.io/mobile_crowd_tracker/
```

## 更新隱私權政策

1. 編輯 `docs/index.html` 檔案
2. 更新「最後更新日期」
3. 提交並推送變更
4. GitHub Actions 會自動重新部署（如果使用自動部署）

## 注意事項

- 確保 HTML 檔案使用 UTF-8 編碼
- 所有連結使用相對路徑或完整 URL
- 測試在不同裝置和瀏覽器上的顯示效果

