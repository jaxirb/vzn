import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  Share,
  Platform,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';

type Props = {
  visible: boolean;
  onClose: () => void;
  inviteMessage?: string;
  profileShareMessage?: string;
};

type SearchResult = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  level: number;
};

type Screen = 'main' | 'search' | 'contacts';

const DEFAULT_INVITE_MESSAGE = 'Join me on VZN! Download the app: [App Store/Play Store Link]';
const DEFAULT_PROFILE_SHARE_MESSAGE = 'Check out my profile on VZN! [Profile Link]';

export default function AddFriendsModal({ 
  visible, 
  onClose,
  inviteMessage = DEFAULT_INVITE_MESSAGE,
  profileShareMessage = DEFAULT_PROFILE_SHARE_MESSAGE,
}: Props) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);

  const handleBack = () => {
    setCurrentScreen('main');
    setSearchQuery('');
    setContactSearchQuery('');
    setSearchResults([]);
  };

  const handleImportContacts = async () => {
    try {
      const { status: existingStatus } = await Contacts.getPermissionsAsync();
      
      if (existingStatus === 'denied') {
        // If they previously denied, show an alert with option to open settings
        Alert.alert(
          'Permission Required',
          'Please enable contacts access in your settings to invite friends',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Open Settings',
              onPress: () => {
                Platform.OS === 'ios' 
                  ? Linking.openURL('app-settings:')
                  : Linking.openSettings();
              }
            }
          ]
        );
        return;
      }

      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        setIsLoading(true);
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        });
        setContacts(data);
        setIsLoading(false);
      } else {
        Alert.alert(
          'Permission Required',
          'Please enable contacts access to invite friends',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Open Settings',
              onPress: () => {
                Platform.OS === 'ios' 
                  ? Linking.openURL('app-settings:')
                  : Linking.openSettings();
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error importing contacts:', error);
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 3) {
      setIsLoading(true);
      // TODO: Replace with actual API call
      setTimeout(() => {
        setSearchResults([
          {
            id: '1',
            name: 'John Smith',
            username: '@johnsmith',
            avatar: 'https://i.pravatar.cc/150?img=1',
            level: 15,
          },
          {
            id: '2',
            name: 'Jane Doe',
            username: '@janedoe',
            avatar: 'https://i.pravatar.cc/150?img=2',
            level: 22,
          },
        ]);
        setIsLoading(false);
      }, 1000);
    } else {
      setSearchResults([]);
    }
  };

  const handleInviteContact = async (contact: Contacts.Contact) => {
    try {
      const phoneNumber = contact.phoneNumbers?.[0]?.number;
      
      if (Platform.OS === 'ios') {
        const url = `sms:${phoneNumber}&body=${inviteMessage}`;
        await Share.share({
          url,
        });
      } else {
        await Share.share({
          message: inviteMessage,
        });
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
    }
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: profileShareMessage,
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  };

  const handleSendFriendRequest = async (userId: string) => {
    setIsLoading(true);
    // TODO: Replace with actual API call
    setTimeout(() => {
      Alert.alert('Success', 'Friend request sent!');
      setIsLoading(false);
    }, 500);
  };

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => {
    const searchLower = contactSearchQuery.toLowerCase();
    const name = contact.name?.toLowerCase() || '';
    const phoneNumber = contact.phoneNumbers?.[0]?.number?.toLowerCase() || '';
    const email = contact.emails?.[0]?.email?.toLowerCase() || '';
    
    return name.includes(searchLower) || 
           phoneNumber.includes(searchLower) || 
           email.includes(searchLower);
  });

  const renderMainScreen = () => (
    <View style={styles.mainContent}>
      <Pressable
        style={styles.optionButton}
        onPress={() => setCurrentScreen('search')}
      >
        <MaterialCommunityIcons name="magnify" size={24} color="#FFFFFF" />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>Search Users</Text>
          <Text style={styles.optionDescription}>Find friends by username or name</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
      </Pressable>

      <Pressable
        style={styles.optionButton}
        onPress={() => {
          setCurrentScreen('contacts');
          handleImportContacts();
        }}
      >
        <MaterialCommunityIcons name="contacts" size={24} color="#FFFFFF" />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>Import Contacts</Text>
          <Text style={styles.optionDescription}>Invite friends from your contacts</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
      </Pressable>

      <Pressable
        style={styles.optionButton}
        onPress={handleShareProfile}
      >
        <MaterialCommunityIcons name="share-variant" size={24} color="#FFFFFF" />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>Share Profile</Text>
          <Text style={styles.optionDescription}>Share your profile link with friends</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
      </Pressable>
    </View>
  );

  const renderSearchScreen = () => (
    <View style={styles.content}>
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by username or name"
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <ScrollView style={styles.resultsList}>
        {isLoading ? (
          <ActivityIndicator style={styles.loader} color="#FFFFFF" />
        ) : (
          searchResults.map((user) => (
            <View key={user.id} style={styles.userItem}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userUsername}>{user.username}</Text>
                <Text style={styles.userLevel}>Level {user.level}</Text>
              </View>
              <Pressable
                style={styles.addButton}
                onPress={() => handleSendFriendRequest(user.id)}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderContactsScreen = () => (
    <View style={styles.content}>
      {contacts.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      ) : (
        <>
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts"
              placeholderTextColor="#6B7280"
              value={contactSearchQuery}
              onChangeText={setContactSearchQuery}
            />
            {contactSearchQuery.length > 0 && (
              <Pressable
                style={styles.clearButton}
                onPress={() => setContactSearchQuery('')}
              >
                <MaterialCommunityIcons name="close-circle" size={20} color="#6B7280" />
              </Pressable>
            )}
          </View>

          <ScrollView style={styles.resultsList}>
            {filteredContacts.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="account-search" size={32} color="#6B7280" />
                <Text style={styles.emptyStateText}>No contacts found</Text>
              </View>
            ) : (
              filteredContacts.map((contact, index) => (
                <View key={index} style={styles.userItem}>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{contact.name}</Text>
                    <Text style={styles.userContact}>
                      {contact.phoneNumbers?.[0]?.number}
                    </Text>
                  </View>
                  <Pressable
                    style={styles.inviteButton}
                    onPress={() => handleInviteContact(contact)}
                  >
                    <Text style={styles.inviteButtonText}>Invite</Text>
                  </Pressable>
                </View>
              ))
            )}
          </ScrollView>
        </>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            {currentScreen !== 'main' && (
              <Pressable style={styles.backButton} onPress={handleBack}>
                <MaterialCommunityIcons name="chevron-left" size={24} color="#FFFFFF" />
              </Pressable>
            )}
            <Text style={[
              styles.headerTitle,
              currentScreen !== 'main' && styles.headerTitleWithBack
            ]}>
              {currentScreen === 'main' ? 'Add Friends' :
               currentScreen === 'search' ? 'Search Users' :
               'Import Contacts'}
            </Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Content */}
          {currentScreen === 'main' && renderMainScreen()}
          {currentScreen === 'search' && renderSearchScreen()}
          {currentScreen === 'contacts' && renderContactsScreen()}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerTitleWithBack: {
    textAlign: 'left',
    marginLeft: 8,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
  },
  mainContent: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    gap: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#FFFFFF',
  },
  resultsList: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  loader: {
    marginTop: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    marginBottom: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  userLevel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  userContact: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2C2C2E',
    borderRadius: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  inviteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2C2C2E',
    borderRadius: 6,
  },
  inviteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  clearButton: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
}); 