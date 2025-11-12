# 快速打包指南

## 三步完成打包

### 1. 生成簽名密鑰

**選擇最適合您的方法：**

#### 方法 A：使用 Android Studio GUI（推薦，無需 Java）

1. 打開 Android Studio
2. 打開專案：`File > Open` > 選擇 `MobileCrowdTracker/android` 目錄
3. 點擊 `Build > Generate Signed Bundle / APK`
4. 選擇 `Android App Bundle` > `Next`
5. 點擊 `Create new...` 創建新的 keystore
6. 填寫資訊：
   - Key store path: `android/my-release-key.keystore`
   - Password: 輸入密碼（請妥善保管）
   - Key alias: `my-key-alias`
   - Key password: 與 store password 相同
   - Validity: 25 年
7. 點擊 `OK` 完成

#### 方法 B：使用腳本（需要 Java）

```bash
cd android
./generate-keystore.sh
```

如果提示找不到 Java，請：
- 安裝 Android Studio（推薦）
- 或使用：`brew install openjdk`
- 或使用方法 A

### 2. 配置簽名資訊

```bash
cd android
cp keystore.properties.example keystore.properties
```

然後編輯 `keystore.properties`，填入您的密鑰庫資訊：
```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=您的密碼
MYAPP_RELEASE_KEY_PASSWORD=您的密碼
```

### 3. 打包應用程式

```bash
./build-release.sh
```

打包完成後，AAB 文件位於：
```
android/app/build/outputs/bundle/release/app-release.aab
```

## 上傳到 Google Play

1. 登入 [Google Play Console](https://play.google.com/console)
2. 選擇您的應用程式
3. 進入「發布」>「生產環境」
4. 點擊「建立新版本」
5. 上傳 `app-release.aab` 文件
6. 填寫版本說明和應用程式資訊
7. 提交審核

## 詳細說明

請參考 [RELEASE.md](RELEASE.md) 獲取完整的發布指南。

## 遇到問題？

- **找不到 Java？** → 使用 Android Studio GUI 方法（方法 A）
- **詳細手動生成指南** → 查看 `android/generate-keystore-manual.md`
