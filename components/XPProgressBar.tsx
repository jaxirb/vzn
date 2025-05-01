import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number;
  currentLevelXP: number; // XP required to start current level
  previousLevelXP?: number; // XP within the level *before* the gain
  xpGained?: number; // Optional: Explicit XP gained value (might simplify)
  showDetails?: boolean;
  compact?: boolean;
  maxLevel?: number;
};

export default function XPProgressBar({ 
  currentLevel, 
  currentXP, 
  nextLevelXP, 
  currentLevelXP, // Start XP of current level
  previousLevelXP, // XP within level *before* gain
  xpGained, // Optional: XP gained this session
  showDetails = true,
  compact = false, 
  maxLevel
}: Props) {

  const isMaxLevel = maxLevel !== undefined && currentLevel >= maxLevel;

  // Calculate progress percentages
  const calculateProgress = () => {
    if (isMaxLevel) return { overall: 100, previous: 100 };

    const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
    if (xpNeededForNextLevel <= 0) return { overall: 100, previous: 100 }; // Handle potential division by zero or weird data

    const xpForCurrentLevel = Math.max(0, currentXP - currentLevelXP);
    const overallProgress = Math.min(100, (xpForCurrentLevel / xpNeededForNextLevel) * 100);

    // Calculate progress percentage *before* the gain
    let previousProgress = 0;
    if (previousLevelXP !== undefined) {
      previousProgress = Math.min(100, (previousLevelXP / xpNeededForNextLevel) * 100);
    }
    // Alternative using xpGained:
    // if (xpGained !== undefined) {
    //   const xpBeforeGainInLevel = Math.max(0, xpForCurrentLevel - xpGained);
    //   previousProgress = Math.min(100, (xpBeforeGainInLevel / xpNeededForNextLevel) * 100);
    // }

    return { 
      overall: Math.max(0, overallProgress), // Ensure non-negative
      previous: Math.max(0, previousProgress) // Ensure non-negative
    };
  };

  const { overall: overallProgressPercentage, previous: previousProgressPercentage } = calculateProgress();
  const gainPercentage = Math.max(0, overallProgressPercentage - previousProgressPercentage);

  return (
    <View style={styles.container}>
      {!compact && (
        <View style={styles.levelHeader}>
          <Text style={styles.currentLevelText}>LVL {currentLevel}</Text>
          <Text style={[
            styles.nextLevelText, 
            isMaxLevel && styles.maxLevelText
          ]}>
            {isMaxLevel ? 'MAX' : `LVL ${currentLevel + 1}`}
          </Text>
        </View>
      )}
      <View style={styles.xpProgressContainer}>
        <View style={styles.xpProgressBar}> 
          {/* Background Track (already handled by container background) */}
          
          {/* Previous Progress (Base White) */}
          <View 
            style={[
              styles.xpProgressBase,
              { width: `${previousProgressPercentage}%` }
            ]} 
          />
          {/* XP Gained (Green overlay) */}
          <View 
            style={[
              styles.xpProgressGain,
              { 
                left: `${previousProgressPercentage}%`, // Start where previous ended
                width: `${gainPercentage}%` // Width is the difference
              }
            ]} 
          />
          {/* Overall Progress (White overlay for remaining part - needed if gain isn't full width) - Simpler: just draw base white to full current % */}
           <View 
            style={[
              styles.xpProgressBase, // Reuse base white style
              { width: `${overallProgressPercentage}%` }
            ]} 
          />
          {/* XP Gained (Green overlay) - Redraw on top */}
          <View 
            style={[
              styles.xpProgressGain,
              { 
                left: `${previousProgressPercentage}%`, 
                width: `${gainPercentage}%` 
              }
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
  xpProgressBar: { // The track
    height: 6, // Make slightly thicker
    backgroundColor: '#3A3A3C', // Darker grey track
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative', // Needed for absolute positioning of progress layers
  },
  xpProgressBase: { // Base white progress
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  xpProgressGain: { // Gain indicator (green)
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#34C759', // Green color for gain
    borderRadius: 3,
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