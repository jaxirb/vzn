import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  closeConnections: Array<{
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
  }>;
  onSendEncouragement: (partnerId: string) => void;
  onSendChallenge: (partnerId: string) => void;
};

export default function SocialEngagement({
  closeConnections,
  onSendEncouragement,
  onSendChallenge,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.sectionTitleContainer}>
          <MaterialCommunityIcons name="account-group" size={20} color="#FFFFFF" />
          <Text style={styles.sectionTitle}>Friend Activity</Text>
        </View>
      </View>

      <View style={styles.friendList}>
        {closeConnections.map((friend) => (
          <View key={friend.id} style={styles.friendItem}>
            <View style={styles.friendInfo}>
              <Image source={{ uri: friend.avatar }} style={styles.avatar} />
              {friend.isOnline && <View style={styles.onlineIndicator} />}
              <Text style={styles.friendName}>{friend.name}</Text>
            </View>
            <View style={styles.actionButtons}>
              <Pressable 
                style={styles.actionButton}
                onPress={() => onSendEncouragement(friend.id)}
              >
                <MaterialCommunityIcons name="heart" size={20} color="#34D399" />
              </Pressable>
              <Pressable 
                style={styles.actionButton}
                onPress={() => onSendChallenge(friend.id)}
              >
                <MaterialCommunityIcons name="sword" size={20} color="#F87171" />
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#141414',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  friendList: {
    gap: 12,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34D399',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#1A1A1A',
  },
  friendName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 18,
  },
}); 