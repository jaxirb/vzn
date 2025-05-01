import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

interface LevelUpModalProps {
  isVisible: boolean;
  onClose: () => void; // Triggers sequence end
  oldLevel: number;
  newLevel: number;
  newLevelTitle?: string; // Optional title from levels.ts
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isVisible,
  onClose,
  oldLevel,
  newLevel,
  newLevelTitle,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current; 
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);

      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, scaleAnim, opacityAnim]);

  // Don't render if not visible or if level didn't actually increase
  if (!isVisible || newLevel <= oldLevel) { 
    return null; 
  }

  const handleClose = () => {
    Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
    }).start(() => {
        onClose(); // End the modal sequence
    });
  }

  return (
    <Modal
      animationType="none" 
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <BlurView intensity={80} tint="dark" style={styles.modalBackdrop}>
        <Pressable 
          style={styles.modalPressableArea} 
          onPress={handleClose}
        >
          <Animated.View 
            style={[
              styles.modalContent,
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <Pressable onPress={(e) => e.stopPropagation()}> 
                {/* Header */}
                <View style={styles.header}>
                   {/* Use lock-open icon */}
                  <Animated.View style={{ transform: [{ scale: scaleAnim }] }}> 
                      <MaterialCommunityIcons name="lock-open-outline" size={60} color="#34C759" />
                  </Animated.View>
                  <Text style={styles.title}>Level Up!</Text>
                </View>

                {/* Body */}
                <View style={styles.body}>
                  <View style={styles.levelDisplay}>
                    <Text style={styles.levelLabel}>LVL</Text>
                    <Text style={styles.levelNumber}>{newLevel}</Text>
                  </View>
                  {newLevelTitle && (
                      <Text style={styles.levelTitleText}>You've achieved the rank of "{newLevelTitle}"!</Text>
                  )}
                  <Text style={styles.motivationText}>
                    Keep climbing!
                  </Text>
                </View>

                {/* Footer - Apply button style */}
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

// Styles similar to Streak modal, adjusted for level
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
    backgroundColor: '#111111', // Match other modals
    borderRadius: 16,
    padding: 20,
    paddingBottom: 20,
    width: '85%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 12,
    textAlign: 'center',
  },
  body: {
    width: '100%',
    marginBottom: 16,
    alignItems: 'center',
    alignSelf: 'center',
  },
  levelDisplay: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelLabel: {
      fontSize: 18,
      fontFamily: 'ChakraPetch-SemiBold',
      color: '#FFFFFF',
      textAlign: 'center',
  },
  levelNumber: {
    fontSize: 35,
    fontFamily: 'ChakraPetch-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  levelTitleText: {
      fontSize: 16,
      color: '#FFFFFF',
      textAlign: 'center',
      marginTop: 5, 
      marginBottom: 10,
      fontFamily: 'Inter-SemiBold',
      fontStyle: 'italic',
  },
  motivationText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Inter-Regular',
  },
  continueButton: { // Use consistent style name and properties
      marginTop: 20, 
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: '#333333',
      alignItems: 'center',
      justifyContent: 'center',
  },
  continueButtonText: { // Use consistent style name and properties
      color: 'white',
      fontSize: 18,
      fontFamily: 'ChakraPetch-SemiBold',
      textTransform: 'uppercase',
  }
});

export default LevelUpModal; 