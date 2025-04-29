import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type User = {
  id: string;
  name: string;
  avatar: string;
  level: number;
  isConnected?: boolean;
};

type Challenge = {
  duration: number;
  mode: 'Flow' | 'Deep Dive';
  reward?: number;
  consequence?: string;
};

type SocialConnectionProps = {
  searchResults: User[];
  activeConnections: User[];
  onSearch: (query: string) => void;
  onConnect: (userId: string) => void;
  onDisconnect: (userId: string) => void;
  onCreateChallenge: (users: string[], challenge: Challenge) => void;
  onInviteContacts: () => void;
};

export default function SocialConnection({
  searchResults,
  activeConnections,
  onSearch,
  onConnect,
  onDisconnect,
  onCreateChallenge,
  onInviteContacts,
}: SocialConnectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [challenge, setChallenge] = useState<Challenge>({
    duration: 25,
    mode: 'Flow',
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateChallenge = () => {
    if (selectedUsers.length > 0) {
      onCreateChallenge(selectedUsers, challenge);
      setSelectedUsers([]);
      setShowChallengeForm(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Search Results */}
      {searchQuery !== '' && (
        <View style={styles.resultsContainer}>
          {searchResults.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userInfo}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <View>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userLevel}>Level {user.level}</Text>
                </View>
              </View>
              <Pressable
                style={[
                  styles.connectButton,
                  user.isConnected && styles.disconnectButton,
                ]}
                onPress={() =>
                  user.isConnected
                    ? onDisconnect(user.id)
                    : onConnect(user.id)
                }
              >
                <MaterialCommunityIcons
                  name={user.isConnected ? 'account-minus' : 'account-plus'}
                  size={20}
                  color={user.isConnected ? '#F87171' : '#FFFFFF'}
                />
                <Text
                  style={[
                    styles.connectButtonText,
                    user.isConnected && styles.disconnectButtonText,
                  ]}
                >
                  {user.isConnected ? 'Disconnect' : 'Connect'}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {/* Active Connections */}
      <View style={styles.connectionsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Connections</Text>
          <Pressable
            style={styles.inviteButton}
            onPress={onInviteContacts}
          >
            <MaterialCommunityIcons name="account-plus" size={20} color="#6366F1" />
            <Text style={styles.inviteButtonText}>Invite</Text>
          </Pressable>
        </View>

        {activeConnections.map((connection) => (
          <View key={connection.id} style={styles.connectionCard}>
            <View style={styles.userInfo}>
              <Image source={{ uri: connection.avatar }} style={styles.avatar} />
              <Text style={styles.userName}>{connection.name}</Text>
            </View>
            <Pressable
              style={styles.selectButton}
              onPress={() => toggleUserSelection(connection.id)}
            >
              <MaterialCommunityIcons
                name={selectedUsers.includes(connection.id) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
                color={selectedUsers.includes(connection.id) ? '#6366F1' : '#9CA3AF'}
              />
            </Pressable>
          </View>
        ))}
      </View>

      {/* Challenge Form */}
      {showChallengeForm && selectedUsers.length > 0 && (
        <View style={styles.challengeForm}>
          <Text style={styles.formTitle}>Create Challenge</Text>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Duration (minutes)</Text>
            <TextInput
              style={styles.fieldInput}
              keyboardType="number-pad"
              value={challenge.duration.toString()}
              onChangeText={(value) =>
                setChallenge((prev) => ({ ...prev, duration: parseInt(value) || 25 }))
              }
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Mode</Text>
            <View style={styles.modeSelector}>
              <Pressable
                style={[
                  styles.modeOption,
                  challenge.mode === 'Flow' && styles.selectedMode,
                ]}
                onPress={() => setChallenge((prev) => ({ ...prev, mode: 'Flow' }))}
              >
                <Text style={styles.modeText}>Flow</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modeOption,
                  challenge.mode === 'Deep Dive' && styles.selectedMode,
                ]}
                onPress={() => setChallenge((prev) => ({ ...prev, mode: 'Deep Dive' }))}
              >
                <Text style={styles.modeText}>Deep Dive</Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            style={styles.createButton}
            onPress={handleCreateChallenge}
          >
            <Text style={styles.createButtonText}>Create Challenge</Text>
          </Pressable>
        </View>
      )}

      {/* Challenge Button */}
      {selectedUsers.length > 0 && !showChallengeForm && (
        <Pressable
          style={styles.challengeButton}
          onPress={() => setShowChallengeForm(true)}
        >
          <MaterialCommunityIcons name="sword-cross" size={20} color="#FFFFFF" />
          <Text style={styles.challengeButtonText}>
            Challenge Selected ({selectedUsers.length})
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: '#FFFFFF',
    fontSize: 16,
  },
  resultsContainer: {
    gap: 8,
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  userLevel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  disconnectButton: {
    backgroundColor: '#991B1B',
  },
  connectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disconnectButtonText: {
    color: '#F87171',
  },
  connectionsContainer: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  inviteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  connectionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 12,
  },
  selectButton: {
    padding: 4,
  },
  challengeForm: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  formField: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  fieldInput: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  modeOption: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingVertical: 12,
    borderRadius: 8,
  },
  selectedMode: {
    backgroundColor: '#6366F1',
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  createButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  challengeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  challengeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 