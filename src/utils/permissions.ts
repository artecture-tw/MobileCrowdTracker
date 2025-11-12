/**
 * 權限處理工具
 * 處理 Android 藍牙和位置權限請求
 */

import { Platform, PermissionsAndroid, Alert } from 'react-native';

export interface PermissionStatus {
  granted: boolean;
  message: string;
}

/**
 * 請求藍牙和位置權限
 */
export async function requestBluetoothPermissions(): Promise<PermissionStatus> {
  if (Platform.OS !== 'android') {
    return { granted: true, message: '非 Android 平台' };
  }

  try {
    // Android 12+ (API 31+) 需要新的權限
    if (Platform.Version >= 31) {
      const bluetoothScanGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        {
          title: '藍牙掃描權限',
          message: '應用程式需要藍牙掃描權限以偵測附近的裝置',
          buttonNeutral: '稍後詢問',
          buttonNegative: '取消',
          buttonPositive: '確定',
        }
      );

      const bluetoothConnectGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
          title: '藍牙連接權限',
          message: '應用程式需要藍牙連接權限',
          buttonNeutral: '稍後詢問',
          buttonNegative: '取消',
          buttonPositive: '確定',
        }
      );

      if (
        bluetoothScanGranted !== PermissionsAndroid.RESULTS.GRANTED ||
        bluetoothConnectGranted !== PermissionsAndroid.RESULTS.GRANTED
      ) {
        return {
          granted: false,
          message: '需要藍牙權限才能掃描裝置',
        };
      }
    } else {
      // Android 6.0+ (API 23+) 需要位置權限
      const locationGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '位置權限',
          message: '應用程式需要位置權限以掃描藍牙裝置（Android 要求）',
          buttonNeutral: '稍後詢問',
          buttonNegative: '取消',
          buttonPositive: '確定',
        }
      );

      if (locationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
        return {
          granted: false,
          message: '需要位置權限才能掃描藍牙裝置',
        };
      }
    }

    return { granted: true, message: '權限已授予' };
  } catch (error) {
    console.error('權限請求錯誤:', error);
    return {
      granted: false,
      message: '權限請求失敗',
    };
  }
}

/**
 * 檢查權限狀態
 */
export async function checkBluetoothPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    if (Platform.Version >= 31) {
      const hasScan = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
      );
      const hasConnect = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      );
      return hasScan && hasConnect;
    } else {
      const hasLocation = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return hasLocation;
    }
  } catch (error) {
    console.error('檢查權限錯誤:', error);
    return false;
  }
}

/**
 * 顯示權限提示
 */
export function showPermissionAlert(message: string): void {
  Alert.alert('權限需要', message, [
    {
      text: '確定',
      onPress: () => {},
    },
  ]);
}

