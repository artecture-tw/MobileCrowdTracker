/**
 * 主應用程式
 * 整合藍牙掃描、數據管理和圖表顯示
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaProvider,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { BluetoothScanner } from './components/BluetoothScanner';
import { DeviceCounter } from './components/DeviceCounter';
import { ChartView } from './components/ChartView';
import { dataManager, DeviceCounts } from './utils/dataManager';
import {
  requestBluetoothPermissions,
  checkBluetoothPermissions,
  showPermissionAlert,
} from './utils/permissions';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('未開始');
  const [deviceCounts, setDeviceCounts] = useState<DeviceCounts>({
    near: 0,
    medium: 0,
    far: 0,
  });
  const [timeSeriesData, setTimeSeriesData] = useState(dataManager.getTimeSeriesData());
  const [hasPermissions, setHasPermissions] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  // 檢查權限
  useEffect(() => {
    const checkPermissions = async () => {
      const hasPerms = await checkBluetoothPermissions();
      setHasPermissions(hasPerms);
      
      if (!hasPerms) {
        const result = await requestBluetoothPermissions();
        if (result.granted) {
          setHasPermissions(true);
        } else {
          showPermissionAlert(result.message);
        }
      }
    };

    checkPermissions();
  }, []);

  // 處理裝置計數更新
  const handleDeviceCountsUpdate = useCallback((counts: DeviceCounts) => {
    setDeviceCounts(counts);
    dataManager.addDataPoint(counts);
    setTimeSeriesData(dataManager.getTimeSeriesData());
    setLastUpdateTime(new Date());
  }, []);

  // 處理掃描狀態變化
  const handleScanStatusChange = useCallback((status: string) => {
    setScanStatus(status);
  }, []);

  // 切換掃描狀態
  const toggleScanning = useCallback(async () => {
    if (!hasPermissions) {
      const result = await requestBluetoothPermissions();
      if (!result.granted) {
        showPermissionAlert(result.message);
        return;
      }
      setHasPermissions(true);
    }

    setIsScanning((prev) => !prev);
  }, [hasPermissions]);

  // 清除數據
  const clearData = useCallback(() => {
    dataManager.clearData();
    setTimeSeriesData([]);
    setDeviceCounts({ near: 0, medium: 0, far: 0 });
    setLastUpdateTime(null);
  }, []);

  // 格式化時間
  const formatTime = (date: Date | null): string => {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={isDarkMode ? '#000' : '#fff'}
        />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 標題 */}
          <View style={styles.header}>
            <Text style={styles.title}>藍牙裝置偵測</Text>
            <Text style={styles.subtitle}>監控附近藍牙裝置數量</Text>
          </View>

          {/* 裝置計數器 */}
          <DeviceCounter counts={deviceCounts} />

          {/* 掃描狀態 */}
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>狀態：</Text>
            <Text style={styles.statusText}>{scanStatus}</Text>
          </View>

          {/* 最後更新時間 */}
          {lastUpdateTime && (
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                最後更新：{formatTime(lastUpdateTime)}
              </Text>
            </View>
          )}

          {/* 圖表 */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>裝置數量趨勢（過去 5 分鐘）</Text>
            <ChartView dataPoints={timeSeriesData} />
          </View>

          {/* 控制按鈕 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                isScanning ? styles.stopButton : styles.startButton,
              ]}
              onPress={toggleScanning}
            >
              <Text style={styles.buttonText}>
                {isScanning ? '停止掃描' : '開始掃描'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={clearData}
            >
              <Text style={styles.buttonText}>清除數據</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* 藍牙掃描組件（不渲染 UI） */}
      <BluetoothScanner
        onDeviceCountsUpdate={handleDeviceCountsUpdate}
        isScanning={isScanning}
        onScanStatusChange={handleScanStatusChange}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  timeContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  chartContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    marginHorizontal: 20,
    gap: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  clearButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;

