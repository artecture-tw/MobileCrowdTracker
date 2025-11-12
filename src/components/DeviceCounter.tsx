/**
 * 裝置計數器組件
 * 顯示當前近/中/遠距離裝置數量
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DeviceCounts } from '../utils/dataManager';

interface DeviceCounterProps {
  counts: DeviceCounts;
}

export const DeviceCounter: React.FC<DeviceCounterProps> = ({ counts }) => {
  return (
    <View style={styles.container}>
      <View style={styles.counterItem}>
        <Text style={styles.label}>近距離</Text>
        <Text style={[styles.value, styles.nearValue]}>{counts.near}</Text>
      </View>
      <View style={styles.counterItem}>
        <Text style={styles.label}>中距離</Text>
        <Text style={[styles.value, styles.mediumValue]}>{counts.medium}</Text>
      </View>
      <View style={styles.counterItem}>
        <Text style={styles.label}>遠距離</Text>
        <Text style={[styles.value, styles.farValue]}>{counts.far}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 10,
  },
  counterItem: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  nearValue: {
    color: '#228B22', // 綠色
  },
  mediumValue: {
    color: '#FFA500', // 橙色
  },
  farValue: {
    color: '#FF0000', // 紅色
  },
});

