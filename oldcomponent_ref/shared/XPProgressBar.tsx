import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number;
  currentLevelXP: number;
  showDetails?: boolean;
  compact?: boolean;
};

export default function XPProgressBar({ 
  currentLevel, 
  currentXP, 
  nextLevelXP, 
  currentLevelXP,
  showDetails = true,
  compact = false 
}: Props) {
  // Calculate progress percentage
  const calculateProgress = () => {
    const xpForCurrentLevel = currentXP - currentLevelXP;
    const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
    const progress = (xpForCurrentLevel / xpNeededForNextLevel) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <View style={styles.container}>
      {!compact && (
        <View style={styles.levelHeader}>
          <Text style={styles.currentLevelText}>Level {currentLevel}</Text>
          <Text style={styles.nextLevelText}>Level {currentLevel + 1}</Text>
        </View>
      )}
      <View style={styles.xpProgressContainer}>
        <View style={styles.xpProgressBar}>
          <View 
            style={[
              styles.xpProgress, 
              { width: `${calculateProgress()}%` }
            ]} 
          />
        </View>
        {showDetails && (
          <View style={styles.xpInfoContainer}>
            <Text style={styles.xpRemaining}>
              {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  currentLevelText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  nextLevelText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  xpProgressContainer: {
    gap: 4,
  },
  xpProgressBar: {
    height: 4,
    backgroundColor: '#2C2C2E',
    borderRadius: 2,
    overflow: 'hidden',
  },
  xpProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  xpInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpRemaining: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
}); 