#!/bin/bash

# 生成發布簽名密鑰腳本
# 此腳本會生成一個用於 Google Play 發布的簽名密鑰

echo "=========================================="
echo "生成 Android 發布簽名密鑰"
echo "=========================================="
echo ""

# 尋找可用的 Java
find_java() {
    # 檢查系統 Java
    if command -v java &> /dev/null && java -version &> /dev/null 2>&1; then
        JAVA_CMD="java"
        KEYTOOL_CMD="keytool"
        return 0
    fi
    
    # 檢查 Android Studio 的 JDK
    local android_studio_jdks=(
        "/Applications/Android Studio.app/Contents/jbr/Contents/Home"
        "$HOME/Library/Android/sdk/jdk"
        "/Library/Java/JavaVirtualMachines"
    )
    
    for jdk_path in "${android_studio_jdks[@]}"; do
        if [ -d "$jdk_path" ]; then
            local keytool_path="$jdk_path/bin/keytool"
            if [ -f "$keytool_path" ]; then
                KEYTOOL_CMD="$keytool_path"
                echo "找到 Java: $jdk_path"
                return 0
            fi
        fi
    done
    
    # 檢查常見的 JDK 位置
    if [ -d "/Library/Java/JavaVirtualMachines" ]; then
        local jdk=$(ls -d /Library/Java/JavaVirtualMachines/*/Contents/Home 2>/dev/null | head -1)
        if [ -n "$jdk" ] && [ -f "$jdk/bin/keytool" ]; then
            KEYTOOL_CMD="$jdk/bin/keytool"
            echo "找到 Java: $jdk"
            return 0
        fi
    fi
    
    return 1
}

# 檢查 Java
if ! find_java; then
    echo "❌ 錯誤：找不到 Java 運行環境！"
    echo ""
    echo "請選擇以下方式之一安裝 Java："
    echo ""
    echo "方法 1：安裝 Android Studio（推薦）"
    echo "  - 下載：https://developer.android.com/studio"
    echo "  - Android Studio 自帶 JDK，安裝後即可使用"
    echo ""
    echo "方法 2：安裝 OpenJDK"
    echo "  - 使用 Homebrew: brew install openjdk"
    echo "  - 或下載：https://adoptium.net/"
    echo ""
    echo "方法 3：使用 Android Studio GUI 生成密鑰"
    echo "  - 打開 Android Studio"
    echo "  - Build > Generate Signed Bundle / APK"
    echo "  - 選擇 Android App Bundle"
    echo "  - 創建新的 keystore"
    echo ""
    exit 1
fi

echo "請輸入以下資訊："
echo ""

# 設定預設值
KEYSTORE_NAME="my-release-key.keystore"
KEY_ALIAS="my-key-alias"
VALIDITY_YEARS=25

# 讀取用戶輸入
read -p "密鑰庫文件名 (預設: $KEYSTORE_NAME): " input_keystore
KEYSTORE_NAME=${input_keystore:-$KEYSTORE_NAME}

read -p "密鑰別名 (預設: $KEY_ALIAS): " input_alias
KEY_ALIAS=${input_alias:-$KEY_ALIAS}

read -p "密鑰有效期（年，預設: $VALIDITY_YEARS）: " input_validity
VALIDITY_YEARS=${input_validity:-$VALIDITY_YEARS}

echo ""
echo "請輸入密碼（請妥善保管，遺失將無法更新應用程式）："
read -s STORE_PASSWORD
echo ""
read -s -p "請再次確認密碼: " STORE_PASSWORD_CONFIRM
echo ""

if [ "$STORE_PASSWORD" != "$STORE_PASSWORD_CONFIRM" ]; then
    echo "錯誤：兩次輸入的密碼不一致！"
    exit 1
fi

echo ""
echo "正在生成密鑰庫..."

# 生成 keystore
"$KEYTOOL_CMD" -genkeypair -v -storetype PKCS12 -keystore "$KEYSTORE_NAME" \
    -alias "$KEY_ALIAS" -keyalg RSA -keysize 2048 -validity $((VALIDITY_YEARS * 365)) \
    -storepass "$STORE_PASSWORD" -keypass "$STORE_PASSWORD" \
    -dname "CN=MobileCrowdTracker, OU=Development, O=MobileCrowdTracker, L=City, ST=State, C=TW"

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ 密鑰庫生成成功！"
    echo ""
    echo "密鑰庫位置: $(pwd)/$KEYSTORE_NAME"
    echo ""
    echo "請將此文件妥善保管，並更新 android/keystore.properties 文件："
    echo ""
    echo "MYAPP_RELEASE_STORE_FILE=$KEYSTORE_NAME"
    echo "MYAPP_RELEASE_KEY_ALIAS=$KEY_ALIAS"
    echo "MYAPP_RELEASE_STORE_PASSWORD=$STORE_PASSWORD"
    echo "MYAPP_RELEASE_KEY_PASSWORD=$STORE_PASSWORD"
    echo ""
    echo "⚠️  重要：請將密鑰庫文件和密碼妥善保管，遺失將無法更新應用程式！"
else
    echo ""
    echo "✗ 密鑰庫生成失敗！"
    exit 1
fi

