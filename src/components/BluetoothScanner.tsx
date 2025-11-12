/**
 * 藍牙掃描核心組件
 * 處理藍牙掃描邏輯、裝置發現和 RSSI 分類
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { classifyRSSI, DistanceCategory } from '../utils/rssiClassifier';
import { DeviceCounts } from '../utils/dataManager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

interface BluetoothScannerProps {
  onDeviceCountsUpdate: (counts: DeviceCounts) => void;
  isScanning: boolean;
  onScanStatusChange: (status: string) => void;
}

export const BluetoothScanner: React.FC<BluetoothScannerProps> = ({
  onDeviceCountsUpdate,
  isScanning,
  onScanStatusChange,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const devicesRef = useRef<Map<string, { rssi: number; category: DistanceCategory }>>(new Map());
  const scanDuration = 3000; // 每次掃描持續 3 秒
  const scanInterval = 5000; // 每 5 秒掃描一次

  // 初始化 BLE Manager
  useEffect(() => {
    const initBLE = async () => {
      try {
        await BleManager.start({ showAlert: false });
        setIsInitialized(true);
        onScanStatusChange('已就緒');
      } catch (error) {
        console.error('BLE Manager 初始化失敗:', error);
        onScanStatusChange('初始化失敗');
      }
    };

    initBLE();

    return () => {
      // 清理
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
      BleManager.stopScan().catch(() => {});
    };
  }, [onScanStatusChange]);

  // 處理裝置發現事件
  useEffect(() => {
    const subscription = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      (device) => {
        if (!device || device.rssi === null || device.rssi === undefined) {
          return;
        }

        const classification = classifyRSSI(device.rssi);
        
        // 只處理在範圍內的裝置
        if (classification.category !== 'outOfRange') {
          devicesRef.current.set(device.id, {
            rssi: device.rssi,
            category: classification.category,
          });
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // 計算裝置計數
  const calculateCounts = useCallback((): DeviceCounts => {
    const counts: DeviceCounts = {
      near: 0,
      medium: 0,
      far: 0,
    };

    devicesRef.current.forEach((device) => {
      switch (device.category) {
        case 'near':
          counts.near++;
          break;
        case 'medium':
          counts.medium++;
          break;
        case 'far':
          counts.far++;
          break;
      }
    });

    return counts;
  }, []);

  // 執行掃描
  const performScan = useCallback(async () => {
    if (!isInitialized) {
      return;
    }

    try {
      // 清除舊的裝置數據
      devicesRef.current.clear();
      
      onScanStatusChange('掃描中...');
      
      // 開始掃描
      await BleManager.scan([], scanDuration / 1000, true);
      
      // 設定掃描超時
      scanTimeoutRef.current = setTimeout(async () => {
        try {
          await BleManager.stopScan();
          
          // 計算並更新計數
          const counts = calculateCounts();
          onDeviceCountsUpdate(counts);
          onScanStatusChange(`已發現 ${counts.near + counts.medium + counts.far} 個裝置`);
        } catch (error) {
          console.error('停止掃描失敗:', error);
          onScanStatusChange('掃描錯誤');
        }
      }, scanDuration);
    } catch (error) {
      console.error('掃描失敗:', error);
      onScanStatusChange('掃描失敗');
    }
  }, [isInitialized, scanDuration, calculateCounts, onDeviceCountsUpdate, onScanStatusChange]);

  // 處理掃描狀態變化
  useEffect(() => {
    if (isScanning && isInitialized) {
      // 立即執行第一次掃描
      performScan();
      
      // 設定定時掃描
      scanIntervalRef.current = setInterval(() => {
        performScan();
      }, scanInterval);
    } else {
      // 停止掃描
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
        scanTimeoutRef.current = null;
      }
      
      BleManager.stopScan().catch(() => {});
      devicesRef.current.clear();
      
      if (!isScanning) {
        onScanStatusChange('已停止');
      }
    }

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, [isScanning, isInitialized, performScan, onScanStatusChange]);

  return null; // 此組件不渲染任何 UI
};

