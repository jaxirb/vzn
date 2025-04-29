import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Platform, ScrollView, ActivityIndicator, Alert, Modal, TextInput, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../lib/context/AuthContext'; // Import useAuth
import { getSettings, updateSettings, UserSettings } from '../../lib/services/settings'; // Import settings service
import { supabase } from '../../lib/services/supabase'; // Import supabase client
import { useRouter } from 'expo-router'; // Import useRouter
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import useSafeAreaInsets

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

const SettingsSection = ({ title, children }: SettingsSectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

type SettingsRowProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  disabled?: boolean;
  titleColor?: string; // Add optional titleColor prop
};

const SettingsRow = ({ icon, title, subtitle, onPress, rightElement, disabled = false, titleColor }: SettingsRowProps) => (
  <Pressable 
    style={({ pressed }) => [
      styles.row,
      (pressed && !disabled) && styles.rowPressed,
      disabled && styles.rowDisabled
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <View style={styles.rowIcon}>
      <MaterialCommunityIcons name={icon} size={22} color={disabled ? '#555' : titleColor ?? '#FFFFFF'} />
    </View>
    <View style={styles.rowContent}>
      <Text style={[
          styles.rowTitle, 
          disabled && styles.rowTitleDisabled, 
          titleColor && { color: titleColor } // Apply titleColor if provided
      ]}>
        {title}
      </Text>
      {subtitle && <Text style={[styles.rowSubtitle, disabled && styles.rowSubtitleDisabled]}>{subtitle}</Text>}
    </View>
    {rightElement ? (
      <View style={disabled ? styles.rightElementDisabled : {}}>{rightElement}</View>
    ) : (
      <MaterialCommunityIcons 
        name="chevron-right" 
        size={20} 
        color={disabled ? '#444' : '#6B7280'} 
      />
    )}
  </Pressable>
);

type SettingsProps = {
  onClose: () => void;
};

const Settings = ({ onClose }: SettingsProps) => {
  const { user, signOut } = useAuth(); // Get user and signOut function
  const insets = useSafeAreaInsets(); // Get safe area insets
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false); // Add deleting state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const router = useRouter(); // Get router instance

  // Fetch settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      const fetchedSettings = await getSettings();
      setSettings(fetchedSettings);
      setIsLoading(false);
    };
    loadSettings();
  }, []);

  // Generic handler to update a setting
  const handleSettingChange = async (key: keyof UserSettings, value: any) => {
    if (!settings) return;

    // Optimistic UI update
    const oldSettings = settings;
    setSettings(prev => prev ? { ...prev, [key]: value } : null);

    try {
      const updated = await updateSettings({ [key]: value });
      if (!updated) {
        // Revert if update failed
        Alert.alert('Error', 'Failed to save setting. Please try again.');
        setSettings(oldSettings);
      }
    } catch (error) {
      console.error('Failed to update setting:', error);
      Alert.alert('Error', 'Failed to save setting. Please try again.');
      setSettings(oldSettings); // Revert on error
    }
  };

  // Handler for sign out
  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            onClose(); // Close settings modal after sign out
          },
        },
      ]
    );
  };

  // Updated handler for Edit Profile
  const handleEditProfile = () => {
    onClose(); // Close the modal first
    router.push('/edit-profile'); // Then navigate
  };

  const handleChangePassword = () => Alert.alert('Navigate', 'Go to Change Password Screen (TODO)');

  // --- Delete Account Logic ---
  // Opens the confirmation modal
  const promptDeleteAccount = () => {
    setConfirmText(''); // Clear previous input
    setDeleteModalVisible(true);
  };

  // Actual deletion logic, called from modal
  const executeDeleteAccount = async () => {
    setDeleteModalVisible(false); // Close modal immediately
    setIsDeleting(true);
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('delete-user', {
          // No body needed as function gets user from JWT
      });

      if (error) {
        console.error('[Settings] Error invoking delete-user function:', error);
        throw new Error(error.message || 'Failed to invoke delete function.');
      }

      if (data?.error) { // Check for errors returned in the function's response body
          console.error('[Settings] Error returned from delete-user function:', data.error);
          throw new Error(data.error || 'An error occurred during account deletion.');
      }

      console.log('[Settings] delete-user function success:', data);
      Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
      await signOut(); // Sign the user out
      onClose(); // Close the settings modal

    } catch (err) {
      console.error('[Settings] Failed to delete account:', err);
      Alert.alert('Error', err instanceof Error ? err.message : 'Could not delete account. Please try again.');
    } finally {
      setIsDeleting(false);
      setConfirmText(''); // Clear text field
    }
  };

  const handleDefaultDuration = () => Alert.alert('Info', 'Editing default duration is not yet implemented.');

  // Handler for Contact Support
  const handleContactSupport = async () => {
    const email = 'hi@vzn.one';
    const mailtoUrl = `mailto:${email}`;
    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
      } else {
        Alert.alert('Error', 'Could not open email app. Please send an email manually to hi@vzn.one');
      }
    } catch (error) {
      console.error('[Settings] Failed to open mailto link:', error);
      Alert.alert('Error', 'An error occurred while trying to open the email app.');
    }
  };

  // Handler for Help Center
  const handleHelpCenter = async () => {
    const helpUrl = 'https://vzn.one'; // Target URL
    try {
      const canOpen = await Linking.canOpenURL(helpUrl);
      if (canOpen) {
        await Linking.openURL(helpUrl);
      } else {
        Alert.alert('Error', 'Could not open web browser.');
      }
    } catch (error) {
      console.error('[Settings] Failed to open help URL:', error);
      Alert.alert('Error', 'An error occurred while trying to open the link.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A2BE2" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          style={styles.closeButton} 
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Settings Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Uncomment Account Section */}
        <SettingsSection title="Account">
          <SettingsRow
            icon="account"
            title="Profile"
            subtitle="Edit your profile information"
            onPress={handleEditProfile}
            disabled={!settings}
          />
          <SettingsRow
            icon="key"
            title="Change Password"
            onPress={handleChangePassword}
            disabled={!settings}
          />
        </SettingsSection>
        {/* Restore the rest of the sections */}
        <SettingsSection title="Accessibility">
          <SettingsRow
            icon="bell"
            title="Push Notifications"
            disabled={!settings}
            rightElement={
              <Switch
                value={settings?.notifications_enabled ?? true}
                onValueChange={(value) => handleSettingChange('notifications_enabled', value)}
                trackColor={{ false: '#3A3A3C', true: '#32D74B' }}
                thumbColor="#FFFFFF"
                disabled={!settings}
              />
            }
          />
          {/* TODO: Add Notification Frequency Row */}
          <SettingsRow
            icon="volume-high"
            title="Sound"
            disabled={!settings}
            rightElement={
              <Switch
                value={settings?.sound_enabled ?? true}
                onValueChange={(value) => handleSettingChange('sound_enabled', value)}
                trackColor={{ false: '#3A3A3C', true: '#32D74B' }}
                thumbColor="#FFFFFF"
                disabled={!settings}
              />
            }
          />
          <SettingsRow
            icon="vibrate"
            title="Vibration"
            disabled={!settings}
            rightElement={
              <Switch
                value={settings?.vibration_enabled ?? true}
                onValueChange={(value) => handleSettingChange('vibration_enabled', value)}
                trackColor={{ false: '#3A3A3C', true: '#32D74B' }}
                thumbColor="#FFFFFF"
                disabled={!settings}
              />
            }
          />
        </SettingsSection>

        {/* TODO: Add Profile Visibility Section/Row */}

        {/* Support Section - Stays Static */}
        <SettingsSection title="Support">
          <SettingsRow 
            icon="help-circle" 
            title="Help Center" 
            onPress={handleHelpCenter} // Attach handler
          />
          <SettingsRow 
            icon="message-text" 
            title="Contact Support" 
            onPress={handleContactSupport} // Attach handler
          />
          <SettingsRow icon="information" title="About" subtitle="Version 1.0.0" />
        </SettingsSection>

        {/* Account Actions */}
        <SettingsSection title="Account Actions">
          <SettingsRow
            icon="logout"
            title="Sign Out"
            onPress={handleSignOut}
            disabled={isDeleting} // Disable while deleting
          />
          <SettingsRow
            icon="delete"
            title="Delete Account"
            subtitle="This action cannot be undone"
            onPress={promptDeleteAccount} // Changed onPress to open modal
            disabled={isDeleting} // Disable while deleting
            titleColor="#FF6347" // Pass red color here
          />
          {/* Optional: Add loading indicator for delete */} 
          {isDeleting && !deleteModalVisible && <ActivityIndicator style={styles.deleteLoadingIndicator} color="#FF6347" />}
        </SettingsSection>
        
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => {
          setDeleteModalVisible(false);
          setConfirmText('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Account Deletion</Text>
            <Text style={styles.modalText}>
              This action is permanent and cannot be undone. All your data will be lost. 
              To confirm, please type "CONFIRM" in the box below.
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Type CONFIRM here"
              placeholderTextColor="#888"
              value={confirmText}
              onChangeText={setConfirmText}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <View style={styles.modalButtonRow}>
              <Pressable 
                style={[styles.modalButton, styles.modalCancelButton]} 
                onPress={() => { setDeleteModalVisible(false); setConfirmText(''); }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={[
                  styles.modalButton, 
                  styles.modalDeleteButton, 
                  confirmText !== 'CONFIRM' && styles.modalButtonDisabled // Disable if text doesn't match
                ]} 
                onPress={executeDeleteAccount}
                disabled={confirmText !== 'CONFIRM' || isDeleting}
              >
                {isDeleting ? 
                  <ActivityIndicator color="#fff" size="small" /> : 
                  <Text style={styles.modalButtonText}>Delete My Account</Text>
                }
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {isDeleting && (
        <View style={styles.deleteOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.deleteOverlayText}>Deleting Account...</Text>
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111111',
  },
  rowDisabled: {
    opacity: 0.5,
  },
  rowTitleDisabled: {
    color: '#555', // Grey out text when disabled
  },
  rowSubtitleDisabled: {
    color: '#444',
  },
  rightElementDisabled: {
    opacity: 0.5,
  },
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
    minHeight: 52,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 0,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    zIndex: 1,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  section: {
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  rowPressed: {
    backgroundColor: '#2C2C2E',
  },
  rowIcon: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  rowSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  deleteLoadingIndicator: {
      marginTop: 10,
      alignSelf: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2C2C2E',
    borderRadius: 14,
    padding: 20,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 14,
    color: '#E5E5EA',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalInput: {
    backgroundColor: '#1C1C1E',
    color: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3A3A3C',
    marginBottom: 20,
    width: '100%',
    textAlign: 'center',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  modalCancelButton: {
      backgroundColor: '#48484A', // Greyish button
  },
  modalDeleteButton: {
      backgroundColor: '#FF3B30', // Red button
  },
  modalButtonDisabled: {
      backgroundColor: '#555', 
      opacity: 0.7,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteOverlayText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
});

export default Settings; 