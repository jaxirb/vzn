import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { BlurView } from 'expo-blur';
import XPProgressBar from '../XPProgressBar'; // B8.6 Import progress bar
import { LEVELS } from '@/lib/levels'; // B8.6 Import level data
import { ThemedText } from '../ThemedText'; // Import ThemedText

// B8.6: Restore Type Definition
type PostSessionData = {
  duration: number;
  xpEarned: number;
  wasHardMode: boolean;
  oldLevel: number;
  newLevel: number;
  levelChanged: boolean;
  oldStreak: number;
  newStreak: number;
  streakChanged: boolean;
  oldXP: number; 
  currentXP: number; 
  xpRequiredForNextLevel: number | null; 
  baseXPEarned: number;
  bonusXPEarned: number;
};

interface SessionSummaryModalProps {
  isVisible: boolean;
  onClose: () => void;
  onStartNew: () => void;
  onViewProgress: () => void;
  sessionInfo: PostSessionData | null;
}

const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  isVisible,
  onClose,
  onStartNew,
  onViewProgress,
  sessionInfo,
}) => {

  // --- DEBUG: Log received props --- //
  console.log('[SessionSummaryModal] Received sessionInfo:', sessionInfo);

  if (!sessionInfo) {
    return null; 
  }

  // B8.6: Calculate XP required to START the current level
  const levelData = LEVELS.find(l => l.level === sessionInfo.newLevel);
  const xpRequiredForCurrentLevelStart = levelData?.xpRequired ?? 0; 
  const isMaxLevel = sessionInfo.xpRequiredForNextLevel === null;

  // Calculate XP user had WITHIN the level they were at BEFORE the session
  const oldLevelData = LEVELS.find(l => l.level === sessionInfo.oldLevel);
  const xpRequiredForOldLevelStart = oldLevelData?.xpRequired ?? 0;
  const previousXPWithinLevel = Math.max(0, sessionInfo.oldXP - xpRequiredForOldLevelStart);

  const handleClose = () => {
    onClose(); 
  }

  return (
    <Modal
      animationType="fade" 
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose} 
    >
      <BlurView intensity={80} tint="dark" style={styles.modalBackdrop}>
        <Pressable 
          style={styles.modalPressableArea} 
        >
          <Pressable onPress={(e) => e.stopPropagation()}> 
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.header}>
                <Ionicons name="checkmark-circle-outline" size={48} color="#34C759" />
                <ThemedText type="title" style={styles.title}>Session Complete!</ThemedText>
              </View>

              {/* Body */}
              <View style={styles.body}>
                <View style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>⏱ Time Focused:</ThemedText>
                  <ThemedText style={styles.infoValueGamification}>{sessionInfo.duration} minutes</ThemedText>
                </View>
                <View style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>⚡ XP Earned:</ThemedText>
                  <ThemedText style={styles.infoValueGamification}>
                    +{sessionInfo.baseXPEarned} XP
                  </ThemedText>
                </View>
                
                {/* Conditionally render Hard Mode Bonus Row */}
                {sessionInfo.bonusXPEarned > 0 && (
                  <View style={styles.infoRow}>
                    <ThemedText style={styles.infoLabel}>🔥 Hard Mode Bonus:</ThemedText>
                    <ThemedText style={styles.infoValueGamification}>
                      +{sessionInfo.bonusXPEarned} XP
                    </ThemedText>
                  </View>
                )}

                {/* Streak Info */}
                <View style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>🗓️ Current Streak:</ThemedText>
                  <ThemedText style={styles.infoValueGamification}>{sessionInfo.newStreak} days</ThemedText>
                </View>
                
                {/* XP Progress */}
                <View style={styles.progressSection}>
                   <ThemedText style={styles.progressLabel}>
                     {isMaxLevel ? `Level ${sessionInfo.newLevel} Progress (Max)` : `XP towards Level ${sessionInfo.newLevel + 1}`}
                   </ThemedText>
                   <XPProgressBar 
                     // @ts-ignore // Ignore style prop error
                     style={styles.progressBarInstance} // Apply direct style
                     currentLevel={sessionInfo.newLevel}
                     currentXP={sessionInfo.currentXP}
                     currentLevelXP={xpRequiredForCurrentLevelStart}
                     nextLevelXP={sessionInfo.xpRequiredForNextLevel ?? sessionInfo.currentXP}
                     previousLevelXP={previousXPWithinLevel}
                     showDetails={false}
                     compact={false}
                   />
                   <ThemedText style={styles.progressValueTextGamification}> 
                     {sessionInfo.currentXP.toLocaleString()} / {sessionInfo.xpRequiredForNextLevel?.toLocaleString() ?? sessionInfo.currentXP.toLocaleString()} XP
                   </ThemedText>
                </View>

                <ThemedText style={styles.motivationText}>
                  Keep the momentum going!
                </ThemedText>
              </View>

              {/* Footer / Actions */}
              <View style={styles.footer}>
                 <Pressable style={[styles.button, styles.continueButton]} onPress={handleClose}>
                  <ThemedText style={[styles.buttonText, styles.continueButtonText]}>Continue</ThemedText>
                </Pressable>
              </View>

            </View>
          </Pressable>
        </Pressable>
      </BlurView>
    </Modal>
  );
};

// B8.6: Restore Full Styles Object
const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPressableArea: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#111111',
    borderRadius: 26,
    padding: 40,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  body: {
    width: '100%',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 5, 
  },
  infoLabel: {
    fontSize: 16,
    color: '#AEAEB2',
    fontFamily: 'Inter-Regular',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoValueGamification: {
    fontFamily: 'ChakraPetch-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressSection: {
    marginTop: 20, 
    marginBottom: 16,
    width: '100%',
  },
  progressBarInstance: {
    width: '100%',
    marginBottom: 4, 
  },
  progressLabel: {
    fontSize: 14,
    color: '#AEAEB2',
    marginBottom: 8, 
    textAlign: 'center',
    width: '100%',
    fontFamily: 'Inter-Regular',
  },
  progressValueTextGamification: { 
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    width: '100%',
    marginTop: 4, 
    fontFamily: 'ChakraPetch-SemiBold', 
  },
  motivationText: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'Inter-Regular', 
  },
  footer: {
    width: '100%',
    marginTop: 10,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
  },
  continueButton: {
    borderWidth: 2,
    borderColor: '#333333',
    backgroundColor: 'transparent',
  },
  buttonText: { 
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'ChakraPetch-SemiBold',
    textTransform: 'uppercase',
  },
});

export default SessionSummaryModal; 
