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
            <Text style={styles.streakTitle}>Current Streak</Text>
          </View>
          <Text style={styles.streakCount}>{currentStreak}</Text>
          <Text style={styles.streakSubtext}>Keep it going!</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Longest Streak</Text>
            <Text style={styles.statValue}>{longestStreak}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Next Milestone</Text>
            <Text style={styles.statValue}>
              {nextMilestone !== null ? `${nextMilestone}` : '-'}
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
              <MaterialCommunityIcons name="trending-up" size={20} color="#34D399" />
              <Text style={styles.tipText}>Stay consistent to build momentum.</Text>
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
    backgroundColor: '#111111',
    marginTop: 'auto',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    // Removed border
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
    // Removed background and border radius
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
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  streakCount: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'ChakraPetch-SemiBold',
  },
  streakSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
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
    fontFamily: 'Inter-Medium',
  },
  statValue: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: 'ChakraPetch-SemiBold',
  },
  tipsSection: {
    gap: 12,
  },
  tipsTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  tipsList: {
    gap: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    padding: 10,
  },
  tipText: {
    fontSize: 13,
    color: '#9CA3AF',
    flex: 1,
    fontFamily: 'Inter-Regular',
  },
}); 