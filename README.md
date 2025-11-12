# 藍牙裝置偵測 App

一個使用 React Native 開發的 Android 應用程式，透過藍牙掃描偵測附近的藍牙裝置數量，並根據 RSSI 值分類為近、中、遠距離，同時以圖表呈現數據變化趨勢。

## 功能特色

- 🔍 **藍牙掃描**：每 5 秒自動掃描附近的藍牙裝置
- 📊 **RSSI 分類**：根據訊號強度將裝置分類為：
  - 近距離：RSSI > -75 dBm
  - 中距離：-75 dBm ≤ RSSI ≤ -85 dBm
  - 遠距離：-85 dBm < RSSI ≤ -100 dBm
- 📈 **趨勢圖表**：顯示過去 5 分鐘的裝置數量變化趨勢
- 💾 **即時統計**：即時顯示各距離範圍的裝置數量

## 技術架構

- **框架**：React Native CLI 0.82.1
- **語言**：TypeScript
- **藍牙庫**：react-native-ble-manager
- **圖表庫**：react-native-chart-kit
- **權限管理**：react-native-permissions

## 專案結構

```
MobileCrowdTracker/
├── src/
│   ├── components/
│   │   ├── BluetoothScanner.tsx    # 藍牙掃描核心邏輯
│   │   ├── DeviceCounter.tsx        # 裝置計數器組件
│   │   └── ChartView.tsx            # 圖表顯示組件
│   ├── utils/
│   │   ├── rssiClassifier.ts       # RSSI 分類工具
│   │   ├── dataManager.ts          # 歷史數據管理
│   │   └── permissions.ts          # 權限處理
│   └── App.tsx                      # 主應用程式
├── android/                         # Android 原生專案
└── package.json
```

## 安裝與運行

### 前置需求

- Node.js >= 20
- React Native 開發環境
- Android Studio 和 Android SDK
- Android 實體裝置或模擬器（需要支援藍牙）

### 安裝步驟

1. 安裝依賴套件：
```bash
npm install
```

2. 連結原生模組（React Native 0.82+ 自動連結）：
```bash
cd android && ./gradlew clean && cd ..
```

3. 運行應用程式：
```bash
npm run android
```

## 權限說明

應用程式需要以下權限：

- **BLUETOOTH**：掃描藍牙裝置
- **BLUETOOTH_ADMIN**：管理藍牙連接
- **ACCESS_FINE_LOCATION**：Android 6.0+ 要求（藍牙掃描需要位置權限）
- **BLUETOOTH_SCAN**：Android 12+ 要求
- **BLUETOOTH_CONNECT**：Android 12+ 要求

首次運行時，應用程式會自動請求必要權限。

## 使用說明

1. **啟動掃描**：點擊「開始掃描」按鈕開始偵測附近的藍牙裝置
2. **查看統計**：頂部顯示當前近/中/遠距離的裝置數量
3. **查看趨勢**：中間的圖表顯示過去 5 分鐘的數據變化
4. **停止掃描**：點擊「停止掃描」按鈕停止偵測
5. **清除數據**：點擊「清除數據」按鈕清除所有歷史數據

## 注意事項

- 藍牙掃描會消耗電量，建議適度使用
- 確保裝置的藍牙功能已開啟
- Android 6.0+ 需要授予位置權限才能進行藍牙掃描
- 數據僅儲存在記憶體中，關閉應用程式後會清除

## 開發說明

### 修改掃描間隔

在 `src/components/BluetoothScanner.tsx` 中修改：
- `scanInterval`：掃描間隔（預設 5000 毫秒）
- `scanDuration`：每次掃描持續時間（預設 3000 毫秒）

### 修改數據保留時間

在 `src/utils/dataManager.ts` 中修改：
- `maxDataPoints`：最大數據點數量
- `maxAge`：數據最大保留時間（毫秒）

## 授權

此專案僅供學習和開發使用。
