import React from 'react';
import { Modal, View, StyleSheet, Pressable, TouchableOpacity, Switch, ScrollView, Text, Platform, Alert, Linking } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons'; // Or your preferred icon library
import { Colors } from '@/constants/Colors';
import { supabase } from '@/services/supabase'; // M3.1: Import supabase
import { useRouter } from 'expo-router'; // M4.3: Import useRouter
import AsyncStorage from '@react-native-async-storage/async-storage'; // M5.1: Import AsyncStorage
import { useState, useEffect, Dispatch, SetStateAction } from 'react'; // M5.2: Import hooks + Dispatch/SetStateAction

// M5.3: Define keys for AsyncStorage
const SETTINGS_KEYS = {
  NOTIFICATIONS: '@AppSettings:notificationsEnabled',
  SOUNDS: '@AppSettings:soundEnabled',
  VIBRATIONS: '@AppSettings:vibrationEnabled',
};

// Support Email
const SUPPORT_EMAIL = 'hi@vzn.one';

type SettingsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  isVibrationEnabled: boolean;
  onVibrationToggle: Dispatch<SetStateAction<boolean>>;
};

export default function SettingsModal({ isVisible, onClose, isVibrationEnabled, onVibrationToggle }: SettingsModalProps) {
  // Force dark mode for this modal
  const colorScheme = 'dark';
  const styles = getStyles(colorScheme);
  const router = useRouter(); // M4.3: Get router instance

  // M5.2: Add state for toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // Default to true
  const [soundEnabled, setSoundEnabled] = useState(true);             // Default to true

  // M3.2 & M3.3: Logout Handler
  const handleLogout = async () => {
    onClose(); // Close the modal first
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      // Navigation to auth screen is handled by the root _layout based on auth state change
      console.log('User signed out successfully.');
    } catch (error: any) {
      console.error('Error signing out:', error);
      Alert.alert('Logout Failed', error.message || 'An error occurred while signing out.');
    }
  };

  // M5.3 & M5.5: Save Setting Handler
  const saveSetting = async (key: string, value: boolean) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to save setting.', e);
      // Optional: Show user feedback
    }
  };

  // M5.4: Load settings on modal visible
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const notifications = await AsyncStorage.getItem(SETTINGS_KEYS.NOTIFICATIONS);
        const sounds = await AsyncStorage.getItem(SETTINGS_KEYS.SOUNDS);

        setNotificationsEnabled(notifications !== null ? JSON.parse(notifications) : true);
        setSoundEnabled(sounds !== null ? JSON.parse(sounds) : true);
        console.log('Settings loaded from AsyncStorage (excluding vibration, handled by parent)');
      } catch (e) {
        console.error('Failed to load settings.', e);
      }
    };

    if (isVisible) {
      loadSettings();
    }
    // Reload settings every time modal becomes visible
  }, [isVisible]);

  // Handler for Email Support
  const handleEmailSupport = async () => {
    const url = `mailto:${SUPPORT_EMAIL}`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      try {
        await Linking.openURL(url);
      } catch (error) {
        console.error('Failed to open email client:', error);
        Alert.alert('Error', 'Could not open email client.');
      }
    } else {
      Alert.alert('Error', 'Cannot open email client on this device.');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose} // For Android back button
    >
      <View style={styles.modalContainer}>
        <ThemedView style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={30} color={Colors[colorScheme].icon} />
          </TouchableOpacity>

          <ThemedText type="title" style={styles.title}>Settings</ThemedText>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Preferences Section */}
            <ThemedText type="subtitle" style={styles.sectionTitle}>Preferences</ThemedText>
            <View style={styles.settingRow}>
              <ThemedText style={{ color: Colors.dark.icon }}>Notifications</ThemedText>
              <Switch
                trackColor={{ false: Colors.dark.tabIconDefault, true: Colors.dark.text }}
                thumbColor={Platform.OS === 'ios' ? Colors.dark.background : Colors.dark.text}
                ios_backgroundColor={Colors.dark.tabIconDefault}
                onValueChange={(newValue) => {
                  setNotificationsEnabled(newValue);
                  saveSetting(SETTINGS_KEYS.NOTIFICATIONS, newValue);
                }}
                value={notificationsEnabled}
              />
            </View>
            <View style={styles.separator} />
            <View style={styles.settingRow}>
              <ThemedText style={{ color: Colors.dark.icon }}>Sounds</ThemedText>
              <Switch
                trackColor={{ false: Colors.dark.tabIconDefault, true: Colors.dark.text }}
                thumbColor={Platform.OS === 'ios' ? Colors.dark.background : Colors.dark.text}
                ios_backgroundColor={Colors.dark.tabIconDefault}
                onValueChange={(newValue) => {
                  setSoundEnabled(newValue);
                  saveSetting(SETTINGS_KEYS.SOUNDS, newValue);
                }}
                value={soundEnabled}
              />
            </View>
            <View style={styles.separator} />
            <View style={styles.settingRow}>
              <ThemedText style={{ color: Colors.dark.icon }}>Vibrations</ThemedText>
              <Switch
                trackColor={{ false: Colors.dark.tabIconDefault, true: Colors.dark.text }}
                thumbColor={Platform.OS === 'ios' ? Colors.dark.background : Colors.dark.text}
                ios_backgroundColor={Colors.dark.tabIconDefault}
                onValueChange={async (newValue) => {
                  onVibrationToggle(newValue);
                  await saveSetting(SETTINGS_KEYS.VIBRATIONS, newValue);
                }}
                value={isVibrationEnabled}
              />
            </View>

            {/* Legal Section */}
            <ThemedText type="subtitle" style={styles.sectionTitle}>Legal</ThemedText>
            <TouchableOpacity 
              style={styles.linkRow} 
              onPress={() => {
                onClose(); // Close modal before navigating
                router.push({ pathname: '/compliance', params: { screen: 'privacy', title: 'Privacy Policy' } });
              }} 
            >
              <ThemedText style={{ color: Colors.dark.icon }}>Privacy Policy</ThemedText>
              <Ionicons name="chevron-forward" size={20} color={Colors[colorScheme].icon} />
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity 
              style={styles.linkRow} 
              onPress={() => {
                onClose(); // Close modal before navigating
                router.push({ pathname: '/compliance', params: { screen: 'terms', title: 'Terms of Service' } });
              }}
            >
              <ThemedText style={{ color: Colors.dark.icon }}>Terms of Service</ThemedText>
              <Ionicons name="chevron-forward" size={20} color={Colors[colorScheme].icon} />
            </TouchableOpacity>

            {/* Support Section */}
            <ThemedText type="subtitle" style={styles.sectionTitle}>Support</ThemedText>
            <TouchableOpacity 
              style={styles.linkRow} 
              onPress={handleEmailSupport}
            >
              <ThemedText style={{ color: Colors.dark.icon }}>Help & Support</ThemedText>
              <Ionicons name="chevron-forward" size={20} color={Colors[colorScheme].icon} />
            </TouchableOpacity>

            {/* Account Section (Moved to Bottom) */}
            <ThemedText type="subtitle" style={styles.sectionTitle}>Account</ThemedText>
            <TouchableOpacity style={styles.linkRow} onPress={handleLogout}>
              <ThemedText style={styles.logoutText}>Logout</ThemedText>
              <Ionicons name="log-out-outline" size={22} color={Colors.dark.icon} />
            </TouchableOpacity>

          </ScrollView>

        </ThemedView>
      </View>
    </Modal>
  );
}

const getStyles = (colorScheme: 'light' | 'dark') => StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#111111',
  },
  modalContent: {
    flex: 1, 
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 30 : 60,
    backgroundColor: '#111111',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 35 : 65, 
    right: 15,
    zIndex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 25,
    color: Colors[colorScheme].text,
    fontSize: 24,
    fontWeight: '600',
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    color: Colors[colorScheme].text,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors[colorScheme].tabIconDefault,
    opacity: 0.3,
    marginHorizontal: 0,
    marginVertical: 4,
  },
  logoutText: {
      color: Colors.dark.text,
  },
}); 