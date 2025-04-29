import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type UserRankingProps = {
  currentRank: number;
  previousRank: number;
  minutesToNextRank: number;
  averageMinutes: number;
  userMinutes: number;
  friendComparisons: Array<{
    name: string;
    minutes: number;
    ahead: boolean;
    achievements?: string[];
  }>;
  achievements: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
};

export default function UserRanking({
  currentRank,
  previousRank,
  minutesToNextRank,
  averageMinutes,
  userMinutes,
  friendComparisons,
  achievements,
}: UserRankingProps) {
  const getRankChange = () => {
    if (!previousRank) return null;
    const change = previousRank - currentRank;
    if (change === 0) return null;
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' : 'down',
    };
  };

  const rankChange = getRankChange();

  return (
    <View style={styles.container}>
      {/* Current Rank */}
      <View style={styles.rankCard}>
        <View style={styles.rankHeader}>
          <Text style={styles.rankTitle}>Your Position</Text>
          {rankChange && (
            <View style={[
              styles.rankChange,
              { backgroundColor: rankChange.direction === 'up' ? '#065F46' : '#991B1B' }
            ]}>
              <Text style={[
                styles.rankChangeText,
                { color: rankChange.direction === 'up' ? '#34D399' : '#F87171' }
              ]}>
                {rankChange.value} positions
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.rankNumber}>#{currentRank}</Text>
        {minutesToNextRank && (
          <Text style={styles.nextRankText}>
            {minutesToNextRank} minutes to reach #{currentRank - 1}
          </Text>
        )}
      </View>

      {/* Achievements */}
      <View style={styles.achievementsCard}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementItem}>
              <MaterialCommunityIcons
                name={achievement.icon as any}
                size={24}
                color="#6366F1"
              />
              <Text style={styles.achievementName}>{achievement.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Comparative Stats */}
      <View style={styles.comparisonCard}>
        <Text style={styles.sectionTitle}>How You Compare</Text>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${(userMinutes / averageMinutes) * 100}%` }]}
          />
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statText}>You: {userMinutes}m</Text>
          <Text style={styles.statText}>Average: {averageMinutes}m</Text>
        </View>
      </View>

      {/* Friend Comparisons */}
      <View style={styles.friendsCard}>
        <Text style={styles.friendsTitle}>Friends</Text>
        {friendComparisons.map((friend, index) => (
          <View key={index} style={styles.friendComparison}>
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{friend.name}</Text>
              {friend.achievements && friend.achievements.length > 0 && (
                <View style={styles.friendAchievements}>
                  {friend.achievements.map((achievement, i) => (
                    <View key={i} style={styles.friendAchievementBadge}>
                      <Text style={styles.friendAchievementText}>{achievement}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <View style={styles.friendStats}>
              <Text style={[
                styles.friendDifference,
                { color: friend.ahead ? '#34D399' : '#F87171' }
              ]}>
                {friend.minutes}m
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  rankCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
  },
  rankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rankTitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  rankChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rankChangeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rankNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  nextRankText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  achievementsCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  achievementItem: {
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 12,
    minWidth: 80,
  },
  achievementName: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  comparisonCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  friendsCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
  },
  friendsTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  friendComparison: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  friendAchievements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  friendAchievementBadge: {
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  friendAchievementText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  friendStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  friendDifference: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 