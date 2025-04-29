import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import XPProgressBar from '../shared/XPProgressBar';
import { LEVELS } from '../../lib/constants/levels';

type Props = {
  currentLevel: number;
  currentXP: number;
  onClose: () => void;
};

export default function LevelingSystem({ currentLevel, currentXP, onClose }: Props) {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  const currentLevelData = LEVELS.find(l => l.level === currentLevel) || LEVELS[0];
  const nextLevelData = LEVELS.find(l => l.level === currentLevel + 1) || LEVELS[0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.modalDragArea}>
          <View style={styles.modalDragIndicator} />
        </View>
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
          />
        </View>

        {/* Level List */}
        <View style={styles.levelList}>
          {LEVELS.map((level) => (
            <Pressable
              key={level.level}
              style={[
                styles.levelItem,
                level.level <= currentLevel ? styles.unlockedLevel : styles.lockedLevel,
                expandedLevel === level.level && styles.expandedLevel
              ]}
              onPress={() => setExpandedLevel(expandedLevel === level.level ? null : level.level)}
            >
              <View style={styles.levelItemHeader}>
                <View style={styles.levelItemLeft}>
                  <View style={styles.levelNumberContainer}>
                    <Text style={[
                      styles.levelItemNumber,
                      level.level > currentLevel && styles.lockedText
                    ]}>Level {level.level}</Text>
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
                <MaterialCommunityIcons 
                  name={expandedLevel === level.level ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#6B7280" 
                />
              </View>
              {expandedLevel === level.level && (
                <View style={styles.rewardsContainer}>
                  <View style={styles.rewardItem}>
                    <MaterialCommunityIcons name="crown" size={16} color="#FFD700" />
                    <Text style={styles.rewardText}>{level.title || 'Level ' + level.level}</Text>
                  </View>
                  <Text style={styles.rewardDescription}>
                    {level.level <= currentLevel ? 'Level Unlocked' : 'Locked'}
                  </Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  modalDragArea: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  modalDragIndicator: {
    width: 36,
    height: 4,
    backgroundColor: '#3A3A3C',
    borderRadius: 2,
    alignSelf: 'center',
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
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderRadius: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  currentLevelSection: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#141414',
    marginVertical: 16,
    marginHorizontal: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
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
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
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
    borderColor: '#1C1C1E',
  },
  levelItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelItemLeft: {
    gap: 4,
  },
  levelNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelItemNumber: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  levelItemXP: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
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
  expandedLevel: {
    backgroundColor: '#1C1C1E',
  },
}); 