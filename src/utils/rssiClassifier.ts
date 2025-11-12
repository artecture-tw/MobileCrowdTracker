/**
 * RSSI 分類工具
 * 根據 RSSI 值將藍牙裝置分類為近、中、遠距離
 */

export type DistanceCategory = 'near' | 'medium' | 'far' | 'outOfRange';

export interface ClassificationResult {
  category: DistanceCategory;
  label: string;
}

/**
 * 根據 RSSI 值分類裝置距離
 * @param rssi RSSI 值（dBm）
 * @returns 分類結果
 */
export function classifyRSSI(rssi: number | null | undefined): ClassificationResult {
  // 處理無效的 RSSI 值
  if (rssi === null || rssi === undefined || isNaN(rssi)) {
    return { category: 'outOfRange', label: '未知' };
  }

  // 分類規則
  if (rssi > -75) {
    return { category: 'near', label: '近' };
  } else if (rssi >= -85) {
    return { category: 'medium', label: '中' };
  } else if (rssi >= -100) {
    return { category: 'far', label: '遠' };
  } else {
    return { category: 'outOfRange', label: '超出範圍' };
  }
}

/**
 * 獲取所有分類標籤
 */
export function getCategoryLabels(): string[] {
  return ['近', '中', '遠'];
}

