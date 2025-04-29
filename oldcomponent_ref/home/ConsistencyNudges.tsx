import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Suggestion = {
  id: string;
  type: 'streak' | 'goal' | 'competition' | 'optimal';
  message: string;
  icon: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  timeWindow?: string;
};

type ConsistencyNudgesProps = {
  suggestions: Suggestion[];
  onDismiss: (id: string) => void;
};

export default function ConsistencyNudges({
  suggestions,
  onDismiss,
}: ConsistencyNudgesProps) {
  const getIconColor = (type: Suggestion['type']) => {
    switch (type) {
      case 'streak':
        return '#FF9500';
      case 'goal':
        return '#6366F1';
      case 'competition':
        return '#10B981';
      case 'optimal':
        return '#8B5CF6';
      default:
        return '#9CA3AF';
    }
  };

  return (
    <View style={styles.container}>
      {suggestions.map((suggestion) => (
        <View key={suggestion.id} style={styles.suggestionCard}>
          <View style={styles.suggestionHeader}>
            <MaterialCommunityIcons
              name={suggestion.icon as any}
              size={24}
              color={getIconColor(suggestion.type)}
            />
            <Pressable
              style={styles.dismissButton}
              onPress={() => onDismiss(suggestion.id)}
            >
              <MaterialCommunityIcons name="close" size={20} color="#9CA3AF" />
            </Pressable>
          </View>

          <Text style={styles.message}>{suggestion.message}</Text>

          {suggestion.timeWindow && (
            <Text style={styles.timeWindow}>{suggestion.timeWindow}</Text>
          )}

          {suggestion.action && (
            <Pressable
              style={styles.actionButton}
              onPress={suggestion.action.onPress}
            >
              <Text style={styles.actionButtonText}>
                {suggestion.action.label}
              </Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color="#FFFFFF"
              />
            </Pressable>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  suggestionCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dismissButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  timeWindow: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 