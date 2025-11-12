/**
 * 圖表顯示組件
 * 使用 react-native-chart-kit 顯示時間序列圖表
 */

import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { DataPoint } from '../utils/dataManager';

interface ChartViewProps {
  dataPoints: DataPoint[];
}

const screenWidth = Dimensions.get('window').width;

export const ChartView: React.FC<ChartViewProps> = ({ dataPoints }) => {
  // 準備圖表數據
  const chartData = useMemo(() => {
    if (dataPoints.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`, // 近距離 - 綠色
            strokeWidth: 2,
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, // 中距離 - 橙色
            strokeWidth: 2,
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // 遠距離 - 紅色
            strokeWidth: 2,
          },
        ],
        legend: ['近', '中', '遠'],
      };
    }

    // 生成時間標籤（只顯示部分標籤以避免擁擠）
    const labels: string[] = [];
    const nearData: number[] = [];
    const mediumData: number[] = [];
    const farData: number[] = [];

    dataPoints.forEach((point, index) => {
      const date = new Date(point.timestamp);
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      
      // 每 5 個數據點顯示一個標籤
      if (index % 5 === 0 || index === dataPoints.length - 1) {
        labels.push(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      } else {
        labels.push('');
      }

      nearData.push(point.near);
      mediumData.push(point.medium);
      farData.push(point.far);
    });

    return {
      labels,
      datasets: [
        {
          data: nearData,
          color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`, // 近距離 - 綠色
          strokeWidth: 2,
        },
        {
          data: mediumData,
          color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, // 中距離 - 橙色
          strokeWidth: 2,
        },
        {
          data: farData,
          color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // 遠距離 - 紅色
          strokeWidth: 2,
        },
      ],
      legend: ['近', '中', '遠'],
    };
  }, [dataPoints]);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '3',
      strokeWidth: '1',
      stroke: '#ffa726',
    },
  };

  if (dataPoints.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>等待數據中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        withInnerLines={true}
        withOuterLines={true}
        withDots={false}
        withShadow={false}
        segments={4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
});

