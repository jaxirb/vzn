import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type DailyFocusProps = {
  hours: number;
  percentChange: number;
};

export default function DailyFocus({ hours, percentChange }: DailyFocusProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.todayTitle}>Today's Focus</Text>
        <Text style={styles.hoursValue}>{hours}h</Text>
        <View style={styles.percentChange}>
          <MaterialCommunityIcons 
            name={percentChange >= 0 ? "arrow-up" : "arrow-down"} 
            size={14} 
            color={percentChange >= 0 ? "#4ade80" : "#f87171"} 
          />
          <Text style={[
            styles.percentText,
            { color: percentChange >= 0 ? "#4ade80" : "#f87171" }
          ]}>
            {Math.abs(percentChange)}% vs yesterday
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  todayTitle: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  hoursValue: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 4,
  },
  percentChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  percentText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
}); 