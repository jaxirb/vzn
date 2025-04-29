import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GamificationService } from '../../lib/services/GamificationService';
import { Progress } from '../../lib/types/Progress';

type FocusStatsProps = {
  userId: number;
};

export default function FocusStats({ userId }: FocusStatsProps) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const gamificationService = GamificationService.getInstance();

  useEffect(() => {
    const loadProgress = async () => {
      const userProgress = await gamificationService.getProgress(userId);
      // Add default values for missing fields
      const completeProgress: Progress = {
        ...userProgress,
        daily_focus_hours: userProgress.daily_focus_hours || 0,
        weekly_focus_hours: userProgress.weekly_focus_hours || 0,
        weekly_goal_hours: userProgress.weekly_goal_hours || 20,
        yesterday_comparison: userProgress.yesterday_comparison || 0,
        level_title: userProgress.level_title || 'Novice'
      };
      setProgress(completeProgress);
    };

    loadProgress();
  }, [userId]);

  if (!progress) return null;

  const weeklyProgress = (progress.weekly_focus_hours / progress.weekly_goal_hours) * 100;
  const yesterdayComparison = progress.yesterday_comparison;

  return (
    <View style={styles.container}>
      {/* Daily Focus */}
      <View style={styles.statCard}>
        <Text style={styles.statTitle}>Today's Focus</Text>
        <Text style={styles.statValue}>{progress.daily_focus_hours} hours</Text>
        <View style={styles.comparisonContainer}>
          <MaterialCommunityIcons 
            name={yesterdayComparison >= 0 ? "arrow-up" : "arrow-down"} 
            size={16} 
            color={yesterdayComparison >= 0 ? "#4CAF50" : "#F44336"} 
          />
          <Text style={[
            styles.comparisonText,
            { color: yesterdayComparison >= 0 ? "#4CAF50" : "#F44336" }
          ]}>
            {Math.abs(yesterdayComparison)}% vs yesterday
          </Text>
        </View>
      </View>

      {/* Weekly Progress */}
      <View style={styles.statCard}>
        <Text style={styles.statTitle}>Weekly Goal</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${weeklyProgress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {progress.weekly_focus_hours}/{progress.weekly_goal_hours} hours
          </Text>
        </View>
      </View>

      {/* Streak */}
      <View style={styles.statCard}>
        <View style={styles.streakContainer}>
          <MaterialCommunityIcons name="fire" size={24} color="#FF9500" />
          <Text style={styles.streakText}>{progress.streak_days}-day streak!</Text>
        </View>
      </View>

      {/* Level */}
      <View style={styles.statCard}>
        <Text style={styles.levelTitle}>Level {progress.current_level}</Text>
        <Text style={styles.levelSubtitle}>{progress.level_title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  statCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
  },
  statTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  comparisonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressBarContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  levelSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
}); 