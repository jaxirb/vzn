import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
// Consider adding Lottie for animation later if desired

interface StreakIncreaseModalProps {
  isVisible: boolean;
  onClose: () => void; // Triggers next step in queue
  oldStreak: number;
  newStreak: number;
}

const StreakIncreaseModal: React.FC<StreakIncreaseModalProps> = ({
  isVisible,
  onClose,
  oldStreak,
  newStreak,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current; // Initial scale
  const opacityAnim = useRef(new Animated.Value(0)).current; // Initial opacity

  useEffect(() => {
    if (isVisible) {
      // Trigger haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Reset animations
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);

      // Sequence: Fade in, then spring scale
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200, // Quick fade in
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4, // Bounciness
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();
    } 
  }, [isVisible, scaleAnim, opacityAnim]);

  // Don't render if not visible or if streak didn't actually increase
  if (!isVisible || newStreak <= oldStreak) { 
    return null; 
  }

  const handleClose = () => {
    // Start fade out animation before closing
    Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
    }).start(() => {
        onClose(); // Advance the modal queue after animation
    });
  }

  return (
    <Modal
      animationType="none" // Use custom animation
      transparent={true}
      visible={isVisible} 
      onRequestClose={handleClose} 
    >
      <BlurView intensity={80} tint="dark" style={styles.modalBackdrop}>
        {/* Use Pressable backdrop for closing */}
        <Pressable 
          style={styles.modalPressableArea} 
          onPress={handleClose}
        >
          <Animated.View 
            style={[
              styles.modalContent,
              {
                opacity: opacityAnim, // Apply fade animation
                transform: [{ scale: scaleAnim }] // Apply scale animation
              }
            ]}
          >
            {/* Prevent closing modal when clicking inside content */}
            <Pressable onPress={(e) => e.stopPropagation()}> 
                {/* Header */}
                <View style={styles.header}>
                  {/* Change icon to lightning, keep color for now */}
                  <Animated.View style={{ transform: [{ scale: scaleAnim }] }}> 
                      <Ionicons name="flash" size={60} color="#FFD700" />
                  </Animated.View>
                  {/* Use Inter font for title - Removed ! */}
                  <Text style={styles.title}>Streak Increased</Text>
                </View>

                {/* Body */}
                <View style={styles.body}>
                  <View style={styles.streakDisplay}>
                    {/* Use Chakra font for number */}
                    <Text style={styles.streakNumber}>{newStreak}</Text>
                    {/* Use Chakra font, capitalize, remove !, adjust styling */}
                    <Text style={styles.streakLabel}>DAY{newStreak !== 1 ? 'S' : ''}</Text>
                  </View>
                  {/* Change text, use Inter font */}
                  <Text style={styles.motivationText}>
                    Keep that fire burning!
                  </Text>
                </View>

                {/* Footer - Centered Button */}
                <Pressable style={styles.continueButton} onPress={handleClose}>
                  <Text style={styles.continueButtonText}>Continue</Text>
                </Pressable>
             </Pressable>
          </Animated.View>
        </Pressable>
      </BlurView>
    </Modal>
  );
};

// Styles inspired by SessionSummaryModal but adapted
const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPressableArea: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#111111', // Darker background
    borderRadius: 16,
    padding: 20, 
    paddingBottom: 20, 
    width: '85%', // Ensure consistent width
    maxWidth: 350, // Ensure consistent max width
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 16, 
  },
  header: {
    alignItems: 'center',
    marginBottom: 16, // Reduced margin
  },
  title: {
    fontSize: 26, 
    fontFamily: 'Inter-Bold', // Use Inter Bold
    color: '#FFFFFF',
    marginTop: 12,
    textAlign: 'center',
  },
  body: {
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  streakDisplay: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  streakNumber: {
    fontSize: 24, 
    fontFamily: 'ChakraPetch-SemiBold',
    color: '#FFFFFF', 
  },
  streakLabel: {
    fontSize: 24, 
    fontFamily: 'ChakraPetch-SemiBold',
    color: '#FFFFFF', 
    textTransform: 'uppercase',
  },
  motivationText: {
    fontSize: 16,
    color: '#AEAEB2', 
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Inter-Regular',
    width: '100%',
  },
  continueButton: { 
    marginTop: 20, 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: { 
    color: 'white',
    fontSize: 18,
    fontFamily: 'ChakraPetch-SemiBold',
    textTransform: 'uppercase',
  }
});

export default StreakIncreaseModal; 