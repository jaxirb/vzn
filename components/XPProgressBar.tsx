import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number;
  currentLevelXP: number;
  showDetails?: boolean;
  compact?: boolean;
  maxLevel?: number;
};

export default function XPProgressBar({ 
  currentLevel, 
  currentXP, 
  nextLevelXP, 
  currentLevelXP,
  showDetails = true,
  compact = false, 
  maxLevel
}: Props) {

  const isMaxLevel = maxLevel !== undefined && currentLevel >= maxLevel;

  // Calculate progress percentage
  const calculateProgress = () => {
    if (isMaxLevel) return 100; // Show full bar at max level

    const xpForCurrentLevel = currentXP - currentLevelXP;
    const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
    // Handle division by zero or negative XP needed if levels are configured oddly
    if (xpNeededForNextLevel <= 0) return xpForCurrentLevel >= 0 ? 100 : 0; 
    const progress = (xpForCurrentLevel / xpNeededForNextLevel) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <View style={styles.container}>
      {!compact && (
        <View style={styles.levelHeader}>
          <Text style={styles.currentLevelText}>LVL {currentLevel}</Text>
          <Text style={[
            styles.nextLevelText, 
            isMaxLevel && styles.maxLevelText
          ]}>
            {isMaxLevel ? 'MAX' : `Level ${currentLevel + 1}`}
          </Text>
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
              {isMaxLevel 
                ? `${currentXP.toLocaleString()} / ${currentXP.toLocaleString()} XP`
                : `${currentXP.toLocaleString()} / ${nextLevelXP.toLocaleString()} XP`}
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
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'ChakraPetch-SemiBold',
  },
  nextLevelText: {
    fontSize: 14,
    color: '#8e8e93',
    fontFamily: 'ChakraPetch-SemiBold',
    fontWeight: '500',
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
    fontSize: 12,
    color: '#8e8e93',
    fontFamily: 'ChakraPetch-SemiBold',
  },
  maxLevelText: {
    color: '#34C759',
  }
}); 