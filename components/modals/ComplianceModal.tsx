import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type ComplianceModalProps = {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  content: string;
};

export default function ComplianceModal({
  isVisible,
  onClose,
  title,
  content,
}: ComplianceModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      {/* Use SafeAreaView for content within the modal */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.modalContentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons
                name="close"
                size={28}
                color={Colors.dark.icon}
              />
            </Pressable>
          </View>

          {/* Scrollable Content */}
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.contentText}>{content}</Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background, // Use app background
  },
  modalContentContainer: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Adjust for Android status bar if needed
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.inputBorder, // Use subtle separator
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.dark.text,
    flex: 1, // Allow title to take space
    textAlign: 'center', // Center title
    marginLeft: 30, // Offset for close button area
  },
  closeButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
    marginTop: 15,
  },
  scrollContent: {
    paddingBottom: 20, // Ensure spacing at the bottom
  },
  contentText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.dark.textOff,
    lineHeight: 20,
  },
}); 