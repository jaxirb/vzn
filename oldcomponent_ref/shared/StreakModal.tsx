import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  onClose: () => void;
  currentStreak: number;
  longestStreak: number;
  nextMilestone: number | null;
};

export default function StreakModal({ 
  onClose, 
  currentStreak,
  longestStreak,
  nextMilestone,
}: Props) {
  return (
    <View style={styles.modalContent}>
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

      <View style={styles.content}>
        {/* Current Streak */}
        <View style={styles.streakSection}>
          <View style={styles.streakHeader}>
            <MaterialCommunityIcons name="fire" size={32} color="#FF9500" />
            <Text style={styles.streakTitle}>Current Streak</Text>
          </View>
          <Text style={styles.streakCount}>{currentStreak} Days</Text>
          <Text style={styles.streakSubtext}>Keep it going!</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Longest Streak</Text>
            <Text style={styles.statValue}>{longestStreak} Days</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Next Milestone</Text>
            <Text style={styles.statValue}>
              {nextMilestone !== null ? `${nextMilestone} Days` : '-'}
            </Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Streak Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#34D399" />
              <Text style={styles.tipText}>Complete at least one focus session daily</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialCommunityIcons name="clock-outline" size={20} color="#34D399" />
              <Text style={styles.tipText}>Sessions must be at least 25 minutes</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialCommunityIcons name="shield-check" size={20} color="#34D399" />
              <Text style={styles.tipText}>Upgrade to PRO for streak protection</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    backgroundColor: '#000000',
    marginTop: 'auto',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    padding: 24,
    gap: 28,
  },
  streakSection: {
    alignItems: 'center',
    gap: 8,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  streakCount: {
    fontSize: 52,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  streakSubtext: {
    fontSize: 15,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#141414',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#2C2C2E',
  },
  statLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tipsSection: {
    gap: 12,
  },
  tipsTitle: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tipsList: {
    gap: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#141414',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  tipText: {
    fontSize: 13,
    color: '#9CA3AF',
    flex: 1,
  },
}); 