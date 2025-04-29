import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GamificationService } from '../../lib/services/GamificationService';
import { Session } from '../../lib/types/Session';
import { ACHIEVEMENTS } from '../../lib/constants/achievements';

interface SessionCompleteProps {
  session: Session;
  userId: number;
  onClose: () => void;
}

export const SessionComplete: React.FC<SessionCompleteProps> = ({
  session,
  userId,
  onClose,
}) => {
  const gamificationService = GamificationService.getInstance();
  const [progress, setProgress] = useState<{
    xpEarned: number;
    streak: number;
    unlockedAchievements: string[];
  } | null>(null);

  React.useEffect(() => {
    const handleSessionComplete = async () => {
      const result = await gamificationService.updateProgressAfterSession(userId, session);
      const xpEarned = gamificationService.calculateSessionXP(session);
      setProgress({
        xpEarned,
        streak: result.streak_days,
        unlockedAchievements: result.unlocked_achievements || []
      });
    };

    handleSessionComplete();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.successContainer}>
        <MaterialCommunityIcons name="check-circle" size={64} color="#10B981" />
        <Text style={styles.title}>Session Complete!</Text>
      </View>

      {progress && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="#6366F1" />
            <Text style={styles.statValue}>{Math.floor(session.duration / 60)}m</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons name="star" size={24} color="#FCD34D" />
            <Text style={styles.statValue}>+{progress.xpEarned}</Text>
            <Text style={styles.statLabel}>XP Earned</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons name="fire" size={24} color="#FF9500" />
            <Text style={styles.statValue}>{progress.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>
      )}

      {progress && progress.unlockedAchievements.length > 0 && (
        <View style={styles.achievementsContainer}>
          <Text style={styles.achievementsTitle}>Achievements Unlocked!</Text>
          {progress.unlockedAchievements.map(achievementId => {
            const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
            if (!achievement) return null;
            
            return (
              <View key={achievementId} style={styles.achievementCard}>
                <MaterialCommunityIcons 
                  name={achievement.icon as keyof typeof MaterialCommunityIcons.glyphMap} 
                  size={24} 
                  color="#10B981" 
                />
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      <Pressable style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Continue</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#111111',
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  achievementsContainer: {
    marginBottom: 24,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  achievementInfo: {
    marginLeft: 12,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  closeButton: {
    backgroundColor: '#6366F1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 