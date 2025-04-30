import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import XPProgressBar from './XPProgressBar';
import { LEVELS } from '../lib/levels';

// Define the structure of a level object based on usage
type Level = {
  level: number;
  xpRequired: number;
  title?: string; // Optional title based on usage in rewards
};

type Props = {
  currentLevel: number;
  currentXP: number;
  onClose: () => void;
};

const MAX_DISPLAY_LEVEL = 20; // Define the display cap

export default function LevelingSystem({ currentLevel, currentXP, onClose }: Props) {
  // Remove expandedLevel state
  // const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  // Add type annotation for find callbacks
  const currentLevelData = LEVELS.find((l: Level) => l.level === currentLevel) || LEVELS[0];
  const nextLevelData = LEVELS.find((l: Level) => l.level === currentLevel + 1) || LEVELS[0];

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.content}>
          {/* Current Level Progress */}
          <View style={styles.currentLevelSection}>
            <XPProgressBar
              currentLevel={currentLevel}
              currentXP={currentXP}
              nextLevelXP={nextLevelData.xpRequired}
              currentLevelXP={currentLevelData.xpRequired}
              showDetails={true}
              compact={false}
              maxLevel={MAX_DISPLAY_LEVEL}
            />
          </View>

          {/* Task 28.4: Add XP Hint - Now Conditional */}
          <Text style={styles.xpHintText}>
            {currentLevel >= MAX_DISPLAY_LEVEL
              ? "Max level reached! More levels coming soon."
              : "Earn XP by completing focus sessions."}
          </Text>

          {/* Task 28.5: Add Visual Separator */}
          <View style={styles.separator} />

          {/* Level List */}
          <View style={styles.levelList}>
            {LEVELS
              .filter(level => level.level <= MAX_DISPLAY_LEVEL) // Filter levels to display
              .map((level: Level) => (
              <Pressable
                key={level.level}
                style={[
                  styles.levelItem,
                  level.level <= currentLevel ? styles.unlockedLevel : styles.lockedLevel,
                  level.level === currentLevel && styles.currentLevelHighlight,
                  level.level === currentLevel + 1 && styles.nextLevelHighlight,
                ]}
              >
                <View style={styles.levelItemHeader}>
                  <View style={styles.levelNumberContainer}>
                    <Text style={[
                      styles.levelItemNumber,
                      level.level > currentLevel && styles.lockedText
                    ]}>LVL {level.level}</Text>
                    {level.level > currentLevel && (
                      <MaterialCommunityIcons 
                        name="lock" 
                        size={14} 
                        color={level.title ? "#FFD700" : "#6B7280"} 
                        style={styles.lockIcon}
                      />
                    )}
                  </View>
                  <Text style={[
                    styles.levelItemXP,
                    level.level > currentLevel && styles.lockedText
                  ]}>{level.xpRequired.toLocaleString()} XP</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#111111',
  },
  container: {
    flex: 1,
  },
  header: {
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  currentLevelSection: {
    paddingHorizontal: 12, 
    paddingVertical: 20,
    backgroundColor: '#141414',
    borderRadius: 16,
  },
  currentLevelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  currentLevelText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  currentTitle: {
    fontSize: 15,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  xpProgressContainer: {
    gap: 8,
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
  xpToNext: {
    fontSize: 13,
    color: '#34D399',
    fontWeight: '500',
  },
  levelList: {
    paddingVertical: 16,
    paddingHorizontal: 0,
    gap: 8,
  },
  levelItem: {
    backgroundColor: '#141414',
    padding: 12,
    borderRadius: 12,
  },
  levelItemContent: {
    backgroundColor: '#141414',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unlockedLevel: {
    backgroundColor: '#141414',
  },
  lockedLevel: {
    backgroundColor: '#141414',
    opacity: 0.7,
  },
  levelItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelItemLeft: {
    // REMOVED - styles no longer needed
  },
  levelNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 75, // Increased minimum width further
  },
  levelItemNumber: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'ChakraPetch-SemiBold',
  },
  levelItemXP: {
    fontSize: 12,
    color: '#8e8e93',
    fontFamily: 'ChakraPetch-SemiBold',
  },
  lockIcon: {
    marginLeft: 2,
  },
  lockedText: {
    color: '#6B7280',
  },
  rewardsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
    gap: 8,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  rewardDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  // Style to highlight the user's current level row
  currentLevelHighlight: {
    backgroundColor: '#1C1C1E', // Slightly lighter background
  },
  // Style to highlight the next level row
  nextLevelHighlight: {
    // Keep default background but add a subtle border
  },
  // Style for the XP hint text
  xpHintText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8, // Add some space above the separator/list
  },
  // Style for the visual separator line
  separator: {
    height: 1,
    backgroundColor: '#2C2C2E', // Same color as borders
    marginVertical: 16, // Space above and below
  },
}); 