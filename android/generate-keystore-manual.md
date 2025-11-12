# 手動生成簽名密鑰指南

如果腳本無法運行（例如缺少 Java），您可以手動生成簽名密鑰。

## 方法 1：使用 Android Studio（最簡單）

1. 打開 Android Studio
2. 打開專案：`File > Open` > 選擇 `MobileCrowdTracker/android` 目錄
3. 生成簽名密鑰：
   - 點擊 `Build > Generate Signed Bundle / APK`
   - 選擇 `Android App Bundle`
   - 點擊 `Next`
   - 點擊 `Create new...` 創建新的 keystore
   - 填寫資訊：
     - Key store path: 選擇保存位置（例如：`android/my-release-key.keystore`）
     - Password: 輸入密碼（請妥善保管）
     - Key alias: 輸入別名（例如：`my-key-alias`）
     - Key password: 輸入密碼（可與 store password 相同）
     - Validity: 25 年
     - Certificate 資訊：填寫您的資訊
   - 點擊 `OK` 完成創建
4. 記錄生成的 keystore 位置和密碼
5. 更新 `android/keystore.properties` 文件

## 方法 2：安裝 Java 後使用命令行

### 安裝 Java

**使用 Homebrew（推薦）：**
```bash
brew install openjdk
```

**或下載安裝：**
- 訪問 https://adoptium.net/
- 下載 macOS 版本的 OpenJDK
- 安裝後，在終端執行：
```bash
export JAVA_HOME=$(/usr/libexec/java_home)
```

### 生成密鑰

```bash
cd android

keytool -genkeypair -v -storetype PKCS12 \
    -keystore my-release-key.keystore \
    -alias my-key-alias \
    -keyalg RSA \
    -keysize 2048 \
    -validity 9125 \
    -storepass YOUR_STORE_PASSWORD \
    -keypass YOUR_KEY_PASSWORD \
    -dname "CN=MobileCrowdTracker, OU=Development, O=MobileCrowdTracker, L=City, ST=State, C=TW"
```

替換：
- `YOUR_STORE_PASSWORD`: 您的密鑰庫密碼
- `YOUR_KEY_PASSWORD`: 您的密鑰密碼（可與 store password 相同）

## 方法 3：使用 Android Studio 的 JDK

如果已安裝 Android Studio，可以使用其自帶的 JDK：

```bash
# 找到 Android Studio 的 JDK
ANDROID_STUDIO_JDK="/Applications/Android Studio.app/Contents/jbr/Contents/Home"

# 使用該 JDK 的 keytool
"$ANDROID_STUDIO_JDK/bin/keytool" -genkeypair -v -storetype PKCS12 \
    -keystore my-release-key.keystore \
    -alias my-key-alias \
    -keyalg RSA \
    -keysize 2048 \
    -validity 9125 \
    -storepass YOUR_STORE_PASSWORD \
    -keypass YOUR_KEY_PASSWORD \
    -dname "CN=MobileCrowdTracker, OU=Development, O=MobileCrowdTracker, L=City, ST=State, C=TW"
```

## 配置 keystore.properties

生成密鑰後，創建 `android/keystore.properties` 文件：

```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=您的密碼
MYAPP_RELEASE_KEY_PASSWORD=您的密碼
```

## 驗證密鑰

生成後，可以驗證密鑰：

```bash
keytool -list -v -keystore my-release-key.keystore
```

輸入密碼後，應該能看到密鑰的詳細資訊。

## 重要提示

- ⚠️ **妥善保管密鑰庫文件和密碼**
- ⚠️ **遺失密鑰庫將無法更新已發布的應用程式**
- ⚠️ **建議將密鑰庫備份到安全的地方**

