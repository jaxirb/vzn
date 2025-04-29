import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type PersonalStatsProps = {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalFocusHours: number;
  averageSessionLength: number;
  sessionsPerWeek: number;
  monthlyActivity: {
    date: string;
    minutes: number;
  }[];
  activityData?: {
    isActive: boolean;
    intensity?: 'low' | 'medium' | 'high';
  }[];
};

export default function PersonalStats({
  totalXP,
  level,
  currentStreak,
  longestStreak,
  totalFocusHours,
  averageSessionLength,
  sessionsPerWeek,
  monthlyActivity,
  activityData = Array(90).fill(null).map(() => ({
    isActive: Math.random() > 0.7,
    intensity: Math.random() > 0.5 ? 'high' : 'medium',
  })),
}: PersonalStatsProps) {
  const { width: windowWidth } = useWindowDimensions();
  const isSmallDevice = windowWidth < 375; // iPhone SE and similar

  // Mock data for new stats
  const mockTimeOfDayData = {
    morning: 35,
    afternoon: 45,
    evening: 20,
  };

  const mockGoalsData = {
    completed: 24,
    inProgress: 3,
    total: 30,
  };

  const mockProductivityScore = 87;

  const iconSize = isSmallDevice ? 20 : 24;
  const scoreCircleSize = isSmallDevice ? 80 : 100;

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Streak Information */}
      <View style={styles.section}>
        <View style={styles.streakContainer}>
          <View style={styles.streakInfo}>
            <MaterialCommunityIcons name="fire" size={iconSize} color="#FF9500" />
            <Text style={[styles.streakCount, isSmallDevice && styles.smallDeviceText]}>
              {currentStreak}
            </Text>
            <Text style={styles.streakLabel}>DAY STREAK</Text>
          </View>
          <View style={styles.streakDivider} />
          <View style={styles.streakInfo}>
            <MaterialCommunityIcons name="trophy" size={iconSize} color="#FFD700" />
            <Text style={[styles.streakCount, isSmallDevice && styles.smallDeviceText]}>
              {longestStreak}
            </Text>
            <Text style={styles.streakLabel}>BEST STREAK</Text>
          </View>
        </View>
      </View>

      {/* Productivity Score */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PRODUCTIVITY SCORE</Text>
        <View style={styles.scoreContainer}>
          <View style={[
            styles.scoreCircle, 
            { 
              width: scoreCircleSize, 
              height: scoreCircleSize,
              borderRadius: scoreCircleSize / 2 
            }
          ]}>
            <Text style={[styles.scoreNumber, isSmallDevice && styles.smallDeviceScore]}>
              {mockProductivityScore}
            </Text>
            <Text style={styles.scoreLabel}>/ 100</Text>
          </View>
          <Text style={styles.scoreDescription}>
            Based on consistency, session length, and goal completion
          </Text>
        </View>
      </View>

      {/* Focus Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FOCUS STATS</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, isSmallDevice && styles.smallDeviceText]}>
              {totalFocusHours}h
            </Text>
            <Text style={styles.statLabel}>Total Focus</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, isSmallDevice && styles.smallDeviceText]}>
              {averageSessionLength}m
            </Text>
            <Text style={styles.statLabel}>Avg. Session</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, isSmallDevice && styles.smallDeviceText]}>
              {sessionsPerWeek}
            </Text>
            <Text style={styles.statLabel}>Sessions/Week</Text>
          </View>
        </View>
      </View>

      {/* Time of Day Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FOCUS PATTERNS</Text>
        <View style={[styles.timeDistribution, isSmallDevice && { height: 100 }]}>
          <View style={styles.timeBlock}>
            <View style={[styles.timeBar, { height: `${mockTimeOfDayData.morning}%` }]} />
            <Text style={styles.timeLabel}>Morning</Text>
            <Text style={styles.timePercentage}>{mockTimeOfDayData.morning}%</Text>
          </View>
          <View style={styles.timeBlock}>
            <View style={[styles.timeBar, { height: `${mockTimeOfDayData.afternoon}%` }]} />
            <Text style={styles.timeLabel}>Afternoon</Text>
            <Text style={styles.timePercentage}>{mockTimeOfDayData.afternoon}%</Text>
          </View>
          <View style={styles.timeBlock}>
            <View style={[styles.timeBar, { height: `${mockTimeOfDayData.evening}%` }]} />
            <Text style={styles.timeLabel}>Evening</Text>
            <Text style={styles.timePercentage}>{mockTimeOfDayData.evening}%</Text>
          </View>
        </View>
      </View>

      {/* Goals Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>GOALS PROGRESS</Text>
        <View style={styles.goalsContainer}>
          <View style={styles.goalMetric}>
            <MaterialCommunityIcons 
              name="check-circle" 
              size={isSmallDevice ? 16 : 20} 
              color="#22C55E" 
            />
            <View style={styles.goalMetricContent}>
              <Text style={[styles.goalValue, isSmallDevice && styles.smallDeviceText]}>
                {mockGoalsData.completed}
              </Text>
              <Text style={styles.goalLabel}>Completed</Text>
            </View>
          </View>
          <View style={styles.goalMetric}>
            <MaterialCommunityIcons 
              name="progress-clock" 
              size={isSmallDevice ? 16 : 20} 
              color="#6366F1" 
            />
            <View style={styles.goalMetricContent}>
              <Text style={[styles.goalValue, isSmallDevice && styles.smallDeviceText]}>
                {mockGoalsData.inProgress}
              </Text>
              <Text style={styles.goalLabel}>In Progress</Text>
            </View>
          </View>
          <View style={styles.goalMetric}>
            <MaterialCommunityIcons 
              name="flag" 
              size={isSmallDevice ? 16 : 20} 
              color="#9CA3AF" 
            />
            <View style={styles.goalMetricContent}>
              <Text style={[styles.goalValue, isSmallDevice && styles.smallDeviceText]}>
                {mockGoalsData.total}
              </Text>
              <Text style={styles.goalLabel}>Total Goals</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Activity Grid */}
      <View style={[styles.section, styles.lastSection]}>
        <View style={styles.activityGridHeader}>
          <Text style={styles.sectionTitle}>Focus Activity</Text>
          <Text style={styles.activityGridSubtitle}>Last 90 days</Text>
        </View>
        <View style={styles.activityGridContainer}>
          {[...Array(6)].map((_, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.activityGridRow}>
              {[...Array(15)].map((_, colIndex) => {
                const index = rowIndex * 15 + colIndex;
                const day = activityData[index];
                return (
                  <View
                    key={`square-${index}`}
                    style={[
                      styles.activityGridSquare,
                      day?.isActive && (
                        day.intensity === 'high' ? styles.activityHigh :
                        day.intensity === 'medium' ? styles.activityMedium :
                        styles.activityLow
                      ),
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: '4%',
    paddingVertical: 16,
  },
  section: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: '4%',
    marginBottom: '3%',
  },
  lastSection: {
    marginBottom: '6%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: '2%',
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: '2%',
  },
  streakInfo: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  streakCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  streakLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  streakDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#374151',
    marginHorizontal: '4%',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '3%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  scoreContainer: {
    alignItems: 'center',
    marginTop: '4%',
    gap: 12,
  },
  scoreCircle: {
    backgroundColor: '#2C2C2E',
    borderWidth: 4,
    borderColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  scoreDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: '8%',
  },
  timeDistribution: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginTop: '4%',
  },
  timeBlock: {
    alignItems: 'center',
    width: '28%',
  },
  timeBar: {
    width: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 4,
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  timePercentage: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  goalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '4%',
    paddingHorizontal: '2%',
  },
  goalMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalMetricContent: {
    alignItems: 'flex-start',
  },
  goalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  goalLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  activityGridHeader: {
    marginBottom: '3%',
  },
  activityGridSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 4,
  },
  activityGridContainer: {
    width: '100%',
    gap: 4,
  },
  activityGridRow: {
    flexDirection: 'row',
    gap: 4,
  },
  activityGridSquare: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 2,
    minWidth: 0,
  },
  activityLow: {
    backgroundColor: '#166534',
  },
  activityMedium: {
    backgroundColor: '#16A34A',
  },
  activityHigh: {
    backgroundColor: '#22C55E',
  },
  smallDeviceText: {
    fontSize: 18,
  },
  smallDeviceScore: {
    fontSize: 28,
  },
});