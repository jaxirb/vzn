import React from 'react';
import { View, Text, StyleSheet, Modal, Dimensions, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { 
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface AchievementPopupProps {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    xpReward: number;
    progress?: {
      current: number;
      target: number;
    };
    unlockedAt?: string | Date;
  };
  visible: boolean;
  onClose: () => void;
}

export default function AchievementPopup({ achievement, visible, onClose }: AchievementPopupProps) {
  const scale = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 90,
      });
    } else {
      scale.value = withSpring(0);
    }
  }, [visible]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const isUnlocked = !!achievement.unlockedAt;
  const progress = achievement.progress ? (achievement.progress.current / achievement.progress.target) * 100 : 0;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView 
        intensity={40} 
        tint="dark" 
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalOverlay} onPress={onClose}>
          <Animated.View 
            style={[styles.modalContent, rStyle]}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons 
                  name={achievement.icon} 
                  size={48} 
                  color={isUnlocked ? '#FFFFFF' : '#666666'} 
                />
              </View>

              <View style={styles.titleContainer}>
                <Text style={styles.title}>{achievement.title}</Text>
                <Text style={styles.description}>{achievement.description}</Text>
              </View>

              {achievement.progress && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>
                    {achievement.progress.current} / {achievement.progress.target}
                  </Text>
                </View>
              )}

              <View style={[
                styles.rewardContainer,
                !isUnlocked && styles.rewardContainerInactive
              ]}>
                <Text style={[
                  styles.rewardText,
                  !isUnlocked && styles.rewardTextInactive
                ]}>{achievement.xpReward} XP</Text>
              </View>

              {isUnlocked && achievement.unlockedAt && (
                <View style={styles.unlockedContainer}>
                  <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" />
                  <Text style={styles.unlockedText}>
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#111111',
    borderRadius: 24,
    width: '85%',
    aspectRatio: 1,
    maxWidth: 360,
    maxHeight: 360,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
  progressContainer: {
    width: '100%',
    gap: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2C2C2E',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rewardContainerInactive: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
  },
  rewardText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '500',
  },
  rewardTextInactive: {
    color: '#9CA3AF',
  },
  unlockedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  unlockedText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
}); 