# 故障排除指南

## Java 相關問題

### 問題：找不到 Java Runtime

**錯誤訊息：**
```
The operation couldn't be completed. Unable to locate a Java Runtime.
```

**解決方案：**

#### 方案 1：使用 Android Studio 的 JDK（推薦）

如果已安裝 Android Studio，腳本會自動使用其 JDK。如果沒有自動檢測，可以手動設置：

```bash
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
```

#### 方案 2：安裝 Java

使用 Homebrew 安裝：
```bash
brew install openjdk
```

或下載安裝：
- 訪問 https://adoptium.net/
- 下載 macOS 版本的 OpenJDK

### 問題：Gradle 找不到 Java

**錯誤訊息：**
```
FAILURE: Build failed with an exception.
* What went wrong:
Unable to locate a Java Runtime.
```

**解決方案：**

1. 確保已設置 `JAVA_HOME` 環境變數
2. 使用打包腳本 `./build-release.sh`，它會自動設置 Java 環境
3. 或手動設置：
   ```bash
   export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
   export PATH="$JAVA_HOME/bin:$PATH"
   cd android
   ./gradlew clean
   ```

## Gradle 相關問題

### 問題：Gradle 版本兼容性錯誤

**錯誤訊息：**
```
Class org.gradle.jvm.toolchain.JvmVendorSpec does not have member field...
```

**解決方案：**

已更新 Gradle 版本到 8.13（React Native 0.82.1 要求的最低版本）。如果仍有問題：

1. 清除 Gradle 緩存：
   ```bash
   rm -rf ~/.gradle/caches/
   ```

2. 重新下載 Gradle：
   ```bash
   cd android
   ./gradlew --stop
   ./gradlew clean
   ```

### 問題：Gradle 版本過舊

**錯誤訊息：**
```
Minimum supported Gradle version is 8.13. Current version is X.X.
```

**解決方案：**

已更新 `android/gradle/wrapper/gradle-wrapper.properties` 到 Gradle 8.13。如果仍有問題，檢查文件內容：

```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.13-bin.zip
```

## 打包相關問題

### 問題：找不到 keystore.properties

**錯誤訊息：**
```
錯誤：找不到 android/keystore.properties
```

**解決方案：**

1. 生成密鑰庫（使用 Android Studio GUI 或腳本）
2. 複製範例文件：
   ```bash
   cd android
   cp keystore.properties.example keystore.properties
   ```
3. 編輯 `keystore.properties`，填入您的密鑰庫資訊

### 問題：簽名失敗

**錯誤訊息：**
```
FAILURE: Build failed with an exception.
* What went wrong:
Execution failed for task ':app:packageRelease'.
> A failure occurred while executing com.android.build.gradle.tasks.PackageAndroidArtifact
```

**解決方案：**

1. 檢查 `keystore.properties` 中的路徑和密碼是否正確
2. 確認 keystore 文件存在於指定位置
3. 檢查 keystore 文件權限：
   ```bash
   ls -la android/*.keystore
   ```

## 環境變數設置

為了避免每次都需要手動設置，可以將以下內容添加到 `~/.zshrc` 或 `~/.bash_profile`：

```bash
# Android Studio JDK
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"

# Android SDK (如果需要)
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/platform-tools:$PATH"
```

然後重新載入配置：
```bash
source ~/.zshrc
```

## 常見問題

### Q: 為什麼使用 Android Studio 的 JDK？

A: Android Studio 自帶完整的 JDK，無需額外安裝 Java，且版本與 Android 開發工具完全兼容。

### Q: 可以同時使用多個 Java 版本嗎？

A: 可以，但建議使用 Android Studio 的 JDK 進行 Android 開發，避免版本衝突。

### Q: 如何檢查當前使用的 Java 版本？

A:
```bash
java -version
echo $JAVA_HOME
```

### Q: 打包腳本無法運行怎麼辦？

A: 確保：
1. 在專案根目錄執行腳本
2. 已安裝 Android Studio 或 Java
3. 已配置 `keystore.properties`
4. 有執行權限：`chmod +x build-release.sh`

## 獲取幫助

如果以上方法都無法解決問題：

1. 檢查 React Native 官方文檔
2. 查看錯誤訊息的完整堆疊追蹤：`./gradlew --stacktrace`
3. 檢查 Android Studio 的 Logcat 輸出
4. 參考專案的 `RELEASE.md` 和 `README.md`

