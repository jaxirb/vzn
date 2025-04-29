import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Achievement } from '../../lib/types/Achievement'; // Assuming Achievement type path

type AchievementUnlockedModalProps = {
  achievement: Achievement | null;
  onClose: () => void;
};

const AchievementUnlockedModal: React.FC<AchievementUnlockedModalProps> = ({ achievement, onClose }) => {
  if (!achievement) {
    return null; // Don't render if no achievement is provided
  }

  // TODO: Map achievement.icon (string) to actual icon component or image source
  const iconName = achievement.icon || 'trophy-award'; // Default icon

  return (
    <Modal
      animationType="fade" // Or "slide"
      transparent={true}
      visible={!!achievement} // Show modal when achievement is not null
      onRequestClose={onClose} // For Android back button
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          {/* Header */}
          <Text style={styles.modalHeader}>Achievement Unlocked!</Text>
          
          {/* Icon */}
          <View style={styles.iconContainer}>
            {/* Placeholder for icon - needs mapping logic */}
             <MaterialCommunityIcons name={iconName as any} size={80} color="#FFD700" /> 
          </View>

          {/* Details */}
          <Text style={styles.achievementTitle}>{achievement.title}</Text>
          <Text style={styles.achievementDescription}>{achievement.description}</Text>
          <Text style={styles.xpReward}>+{achievement.xpReward || 0} XP</Text>

          {/* Close Button */}
          <Pressable 
            style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]} 
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Awesome!</Text>
          </Pressable>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)', // Darker overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#222', // Dark background for the modal card
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%', // Max width
    maxWidth: 400,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  iconContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#333', // Slightly different background for icon area
    borderRadius: 60, // Make it circular
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  achievementDescription: {
    fontSize: 15,
    color: '#B0B0B0', // Lighter grey for description
    textAlign: 'center',
    marginBottom: 15,
  },
  xpReward: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ADE80', // Green for XP
    marginBottom: 25,
  },
  closeButton: {
    backgroundColor: '#8A2BE2', // Use theme purple
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  closeButtonPressed: {
    backgroundColor: '#7a1dc1', // Darker purple on press
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AchievementUnlockedModal; 