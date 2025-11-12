# Google Play 發布指南

本指南將幫助您將應用程式打包並上傳到 Google Play Store。

## 前置準備

1. **Google Play 開發者帳號**
   - 需要支付一次性 $25 美元的註冊費
   - 訪問 [Google Play Console](https://play.google.com/console) 註冊

2. **應用程式資訊準備**
   - 應用程式名稱：藍牙裝置偵測
   - 應用程式圖示（512x512 PNG）
   - 功能截圖（至少 2 張）
   - 應用程式描述（至少 400 字元）
   - 隱私權政策網址（Google Play 要求）

## 步驟 1：生成發布簽名密鑰

### 方法一：使用 Android Studio GUI（最簡單，推薦）

如果您的系統沒有安裝 Java，這是最簡單的方法：

1. 打開 Android Studio
2. 打開專案：`File > Open` > 選擇 `MobileCrowdTracker/android` 目錄
3. 生成簽名密鑰：
   - 點擊 `Build > Generate Signed Bundle / APK`
   - 選擇 `Android App Bundle`
   - 點擊 `Next`
   - 點擊 `Create new...` 創建新的 keystore
   - 填寫資訊並保存
4. 記錄生成的 keystore 位置和密碼
5. 將 keystore 文件複製到 `android/` 目錄
6. 更新 `android/keystore.properties` 文件

詳細說明請參考：`android/generate-keystore-manual.md`

### 方法二：使用提供的腳本

**前提：需要安裝 Java**

如果已安裝 Java 或 Android Studio，可以使用腳本：

```bash
cd android
chmod +x generate-keystore.sh
./generate-keystore.sh
```

腳本會自動檢測可用的 Java（包括 Android Studio 的 JDK），並引導您輸入：
- 密鑰庫文件名（預設：my-release-key.keystore）
- 密鑰別名（預設：my-key-alias）
- 密碼（請妥善保管！）
- 有效期（預設：25 年）

**如果提示找不到 Java：**
- 安裝 Android Studio（推薦，自帶 JDK）
- 或使用 Homebrew 安裝：`brew install openjdk`
- 或使用 Android Studio GUI 方法（方法一）

### 方法三：手動生成（命令行）

```bash
cd android
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore \
    -alias my-key-alias -keyalg RSA -keysize 2048 -validity 9125 \
    -storepass YOUR_STORE_PASSWORD -keypass YOUR_KEY_PASSWORD \
    -dname "CN=MobileCrowdTracker, OU=Development, O=MobileCrowdTracker, L=City, ST=State, C=TW"
```

**⚠️ 重要提示：**
- 請妥善保管密鑰庫文件和密碼
- 遺失密鑰庫將無法更新已發布的應用程式
- 建議將密鑰庫備份到安全的地方

## 步驟 2：配置簽名資訊

1. 複製範例配置文件：
```bash
cd android
cp keystore.properties.example keystore.properties
```

2. 編輯 `android/keystore.properties`，填入您的實際資訊：
```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your-store-password
MYAPP_RELEASE_KEY_PASSWORD=your-key-password
```

**注意：** `keystore.properties` 已加入 `.gitignore`，不會被提交到版本控制。

## 步驟 3：更新版本資訊

在 `android/app/build.gradle` 中更新版本號：

```gradle
defaultConfig {
    applicationId "com.mobilecrowdtracker"
    versionCode 1        // 每次上傳新版本時遞增
    versionName "1.0"   // 顯示給用戶的版本號
}
```

- `versionCode`：整數，每次上傳必須遞增（例如：1, 2, 3...）
- `versionName`：字串，用戶看到的版本號（例如："1.0", "1.1", "2.0"）

## 步驟 4：打包應用程式

### 方法一：使用提供的腳本（推薦）

```bash
chmod +x build-release.sh
./build-release.sh
```

### 方法二：手動打包

```bash
# 1. 清理舊構建
cd android
./gradlew clean
cd ..

# 2. 生成 AAB
cd android
./gradlew bundleRelease
cd ..
```

生成的 AAB 文件位置：
```
android/app/build/outputs/bundle/release/app-release.aab
```

## 步驟 5：上傳到 Google Play

1. **登入 Google Play Console**
   - 訪問 https://play.google.com/console
   - 選擇您的應用程式或創建新應用

2. **創建新版本**
   - 進入「發布」>「生產環境」（或「測試」>「內部測試」）
   - 點擊「建立新版本」

3. **上傳 AAB 文件**
   - 上傳 `app-release.aab` 文件
   - 填寫版本說明

4. **填寫應用程式資訊**
   - 應用程式名稱
   - 簡短描述（80 字元以內）
   - 完整描述（至少 400 字元）
   - 應用程式圖示（512x512 PNG）
   - 功能截圖（至少 2 張，最多 8 張）
   - 隱私權政策網址

5. **內容分級**
   - 完成內容分級問卷

6. **定價和發布**
   - 選擇免費或付費
   - 選擇發布國家/地區
   - 提交審核

## 常見問題

### Q: 為什麼使用 AAB 而不是 APK？
A: Google Play 自 2021 年 8 月起要求新應用使用 AAB 格式。AAB 格式可以讓 Google Play 為不同設備生成優化的 APK，減少應用程式大小。

### Q: 如何測試發布版本？
A: 可以生成 APK 進行測試：
```bash
cd android
./gradlew assembleRelease
```
APK 位置：`android/app/build/outputs/apk/release/app-release.apk`

### Q: 忘記密鑰庫密碼怎麼辦？
A: 無法恢復。如果遺失密鑰庫或密碼，將無法更新已發布的應用程式。必須創建新的應用程式並重新發布。

### Q: 如何更新應用程式？
A: 
1. 更新 `versionCode` 和 `versionName`
2. 重新打包生成新的 AAB
3. 在 Google Play Console 上傳新版本

### Q: 應用程式被拒絕怎麼辦？
A: 查看 Google Play Console 中的拒絕原因，通常包括：
- 缺少隱私權政策
- 權限說明不完整
- 內容分級問題
- 違反政策內容

## 資源連結

- [Google Play Console](https://play.google.com/console)
- [Android App Bundle 文檔](https://developer.android.com/guide/app-bundle)
- [React Native 發布指南](https://reactnative.dev/docs/signed-apk-android)
- [Google Play 政策](https://play.google.com/about/developer-content-policy/)

## 支援

如有問題，請參考：
- React Native 官方文檔
- Google Play Console 幫助中心
- 專案 README.md

