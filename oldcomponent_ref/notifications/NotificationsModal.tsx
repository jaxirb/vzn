import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
  Platform,
  StatusBar,
  SafeAreaView,
  Animated,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type NotificationType = {
  type: 'friend_request' | 'streak_milestone' | 'focus_session' | 'level_up';
  id: string;
  name: string;
  avatar: string;
  timestamp: string;
  milestone?: number;
  duration?: number;
  newLevel?: number;
  level?: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  notifications: NotificationType[];
  onAcceptFriend: (id: string) => void;
  onDeclineFriend: (id: string) => void;
};

export default function NotificationsModal({
  visible,
  onClose,
  notifications,
  onAcceptFriend,
  onDeclineFriend,
}: Props) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    }
  }, [visible]);

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
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Recent Activity</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
            </Pressable>
          </View>
            
          <ScrollView 
            style={styles.notificationsList}
            contentContainerStyle={styles.notificationsContent}
            showsVerticalScrollIndicator={false}
          >
            {notifications.length > 0 ? (
              notifications.map(item => (
                <View key={item.id} style={styles.notificationItem}>
                  <View style={styles.notificationInfo}>
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationName}>{item.name}</Text>
                      {item.type === 'friend_request' && (
                        <>
                          <Text style={styles.notificationText}>Sent you a friend request</Text>
                          <View style={styles.notificationActions}>
                            <Pressable
                              style={[styles.actionButton, styles.acceptButton]}
                              onPress={() => onAcceptFriend(item.id)}
                            >
                              <Text style={styles.actionButtonText}>Accept</Text>
                            </Pressable>
                            <Pressable
                              style={[styles.actionButton, styles.declineButton]}
                              onPress={() => onDeclineFriend(item.id)}
                            >
                              <Text style={[styles.actionButtonText, styles.declineButtonText]}>
                                Decline
                              </Text>
                            </Pressable>
                          </View>
                        </>
                      )}
                      {item.type === 'streak_milestone' && (
                        <Text style={styles.notificationText}>
                          Reached a {item.milestone}-day streak! 🔥
                        </Text>
                      )}
                      {item.type === 'focus_session' && (
                        <Text style={styles.notificationText}>
                          Completed a {item.duration}min focus session
                        </Text>
                      )}
                      {item.type === 'level_up' && (
                        <Text style={styles.notificationText}>
                          Reached Level {item.newLevel}! 🎉
                        </Text>
                      )}
                      <Text style={styles.notificationTime}>{item.timestamp}</Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons 
                  name="bell-outline" 
                  size={48} 
                  color="#6B7280" 
                />
                <Text style={styles.emptyStateText}>
                  No new notifications
                </Text>
              </View>
            )}
          </ScrollView>
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
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
  },
  notificationsList: {
    flex: 1,
  },
  notificationsContent: {
    paddingVertical: 8,
  },
  notificationItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  notificationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    color: '#6B7280',
    fontSize: 12,
  },
  notificationActions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#2C2C2E',
  },
  declineButton: {
    backgroundColor: '#1A1A1A',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  declineButtonText: {
    color: '#9CA3AF',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    color: '#6B7280',
    fontSize: 16,
    marginTop: 12,
  },
}); 