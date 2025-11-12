/**
 * 歷史數據管理器
 * 管理時間序列數據，保留過去 5 分鐘的數據
 */

export interface DataPoint {
  timestamp: number;
  near: number;
  medium: number;
  far: number;
}

export interface DeviceCounts {
  near: number;
  medium: number;
  far: number;
}

class DataManager {
  private dataPoints: DataPoint[] = [];
  private readonly maxDataPoints = 60; // 5 分鐘 * 12 個數據點/分鐘（每 5 秒一個）
  private readonly maxAge = 5 * 60 * 1000; // 5 分鐘（毫秒）

  /**
   * 添加新的數據點
   * @param counts 裝置計數
   */
  addDataPoint(counts: DeviceCounts): void {
    const now = Date.now();
    const dataPoint: DataPoint = {
      timestamp: now,
      near: counts.near,
      medium: counts.medium,
      far: counts.far,
    };

    this.dataPoints.push(dataPoint);
    this.cleanOldData();
  }

  /**
   * 獲取時間序列數據用於圖表
   * @returns 時間序列數據陣列
   */
  getTimeSeriesData(): DataPoint[] {
    this.cleanOldData();
    return [...this.dataPoints];
  }

  /**
   * 獲取最新的數據點
   * @returns 最新的數據點或 null
   */
  getLatestDataPoint(): DataPoint | null {
    if (this.dataPoints.length === 0) {
      return null;
    }
    return this.dataPoints[this.dataPoints.length - 1];
  }

  /**
   * 清除所有數據
   */
  clearData(): void {
    this.dataPoints = [];
  }

  /**
   * 清理過期數據
   */
  private cleanOldData(): void {
    const now = Date.now();
    
    // 移除超過最大年齡的數據點
    this.dataPoints = this.dataPoints.filter(
      (point) => now - point.timestamp <= this.maxAge
    );

    // 如果數據點超過最大數量，移除最舊的
    if (this.dataPoints.length > this.maxDataPoints) {
      const removeCount = this.dataPoints.length - this.maxDataPoints;
      this.dataPoints.splice(0, removeCount);
    }
  }

  /**
   * 獲取數據點數量
   */
  getDataPointCount(): number {
    return this.dataPoints.length;
  }
}

// 導出單例實例
export const dataManager = new DataManager();

