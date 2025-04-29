import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AchievementPopup from './AchievementPopup';

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  xpReward: number;
  unlockedAt?: string | Date;
  progress?: {
    current: number;
    target: number;
  };
};

type AchievementsProps = {
  achievements: Achievement[];
  onAchievementPress?: (achievement: Achievement) => void;
};

export default function Achievements({ achievements, onAchievementPress }: AchievementsProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const { width: screenWidth } = Dimensions.get('window');
  const padding = 12;
  const gap = 12;
  const cardWidth = (screenWidth - (padding * 2) - gap) / 2;
  const iconSize = cardWidth * 0.3;

  // Sort achievements: completed first, then by XP reward
  const sortedAchievements = [...achievements].sort((a, b) => {
    // First sort by completion status
    if (!!a.unlockedAt && !b.unlockedAt) return -1;
    if (!a.unlockedAt && !!b.unlockedAt) return 1;
    // Then sort by XP reward within each group
    return b.xpReward - a.xpReward;
  });

  const renderAchievement = (achievement: Achievement) => {
    const isUnlocked = !!achievement.unlockedAt;
    const progress = achievement.progress ? Math.min((achievement.progress.current / achievement.progress.target) * 100, 100) : 0;

    return (
      <Pressable
        key={achievement.id}
        style={styles.achievementCard}
        onPress={() => {
          setSelectedAchievement(achievement);
          onAchievementPress?.(achievement);
        }}
      >
        <View style={styles.achievementContent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={achievement.icon}
              size={iconSize}
              color={isUnlocked ? '#FFFFFF' : '#666666'}
              style={isUnlocked ? styles.unlockedIcon : styles.lockedIcon}
            />
          </View>
          <Text style={styles.achievementTitle} numberOfLines={2}>
            {achievement.title}
          </Text>
          {!isUnlocked && achievement.progress && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
            </View>
          )}
          {isUnlocked && (
            <View style={styles.unlockedBadge}>
              <MaterialCommunityIcons name="check" size={10} color="#FFFFFF" />
            </View>
          )}
          {!isUnlocked && (
            <View style={styles.xpRewardBadge}>
              <Text style={styles.xpRewardText}>{achievement.xpReward} XP</Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.achievementsGrid}>
          {sortedAchievements.map((achievement) => (
            renderAchievement(achievement)
          ))}
        </View>
      </ScrollView>

      {selectedAchievement && (
        <AchievementPopup
          achievement={selectedAchievement}
          visible={true}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingBottom: 16,
    gap: 12,
  },
  achievementCard: {
    width: '48%',
    aspectRatio: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#141414',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  achievementContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconContainer: {
    width: '60%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 2,
  },
  unlockedIcon: {
    opacity: 1,
  },
  lockedIcon: {
    opacity: 0.5,
  },
  unlockedBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    padding: 3,
  },
  achievementTitle: {
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 8,
  },
  progressBar: {
    width: '60%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  xpRewardBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  xpRewardBadgeUnlocked: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  xpRewardText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '500',
  },
  xpRewardTextUnlocked: {
    // Removing the color override to keep text white
  },
}); 