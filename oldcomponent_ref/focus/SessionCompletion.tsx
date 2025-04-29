import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Session } from '../../lib/types/Session';
import { GamificationService } from '../../lib/services/GamificationService';

type SessionCompletionProps = {
  session: Session & { xpEarned: number };
  onShare: (reflection?: string) => void;
  onScheduleNext: () => void;
  suggestedNextSession?: {
    time: string;
    duration: number;
    mode: 'Flow' | 'Deep Dive';
  };
};

export default function SessionCompletion({
  session,
  onShare,
  onScheduleNext,
  suggestedNextSession,
}: SessionCompletionProps) {
  const [reflection, setReflection] = useState('');

  return (
    <View style={styles.container}>
      {/* Success Animation */}
      <View style={styles.successContainer}>
        <MaterialCommunityIcons name="check-circle" size={64} color="#10B981" />
        <Text style={styles.successTitle}>Session Complete!</Text>
      </View>

      {/* Session Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="clock-outline" size={24} color="#6366F1" />
          <Text style={styles.statValue}>{session.duration}m</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons name="star" size={24} color="#FCD34D" />
          <Text style={styles.statValue}>+{session.xpEarned}</Text>
          <Text style={styles.statLabel}>XP Earned</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons name="target" size={24} color="#10B981" />
          <Text style={styles.statValue}>{session.mode}</Text>
          <Text style={styles.statLabel}>Mode</Text>
        </View>
      </View>

      {/* Quick Reflection */}
      <View style={styles.reflectionContainer}>
        <Text style={styles.reflectionLabel}>Quick Reflection (Optional)</Text>
        <TextInput
          style={styles.reflectionInput}
          placeholder="How was your focus session?"
          placeholderTextColor="#6B7280"
          value={reflection}
          onChangeText={setReflection}
          multiline
          maxLength={280}
        />
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Pressable
          style={styles.shareButton}
          onPress={() => onShare(reflection)}
        >
          <MaterialCommunityIcons name="share" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Share Result</Text>
        </Pressable>

        {suggestedNextSession && (
          <Pressable
            style={styles.scheduleButton}
            onPress={onScheduleNext}
          >
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleTitle}>Schedule Next Session</Text>
              <Text style={styles.scheduleDetails}>
                {suggestedNextSession.time} · {suggestedNextSession.duration}m {suggestedNextSession.mode}
              </Text>
            </View>
            <MaterialCommunityIcons name="calendar-plus" size={24} color="#6366F1" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 24,
  },
  successContainer: {
    alignItems: 'center',
    gap: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  streakMaintained: {
    backgroundColor: '#422006',
  },
  streakBroken: {
    backgroundColor: '#991B1B',
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  reflectionContainer: {
    gap: 8,
  },
  reflectionLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  reflectionInput: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  actionsContainer: {
    gap: 12,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1F1F1F',
    padding: 16,
    borderRadius: 12,
  },
  scheduleInfo: {
    gap: 4,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scheduleDetails: {
    fontSize: 14,
    color: '#9CA3AF',
  },
}); 