import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '@/services/supabase';
import { Session } from '@supabase/supabase-js';
import { useProfile } from '@/contexts/ProfileContext';

// Define the bullet points content (Updated Again)
const bulletPoints = [
  'Set your focus time',
  'Start a session',
  'Track your progress',
  'Build streaks over time',
  'Earn XP, level up',
];

// Define a helper function for async delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function OnboardingScreen2() {
  const router = useRouter();
  const { setIsOnboarded } = useOnboarding();
  const { fetchProfile } = useProfile();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const handleComplete = async () => {
    if (loading || !session?.user?.id) {
      console.log('[Onboarding Step 2] Complete action aborted. Loading: ', loading, ' Session User ID:', session?.user?.id);
      return;
    }

    setLoading(true);
    console.log('[Onboarding Step 2] Attempting to mark onboarding complete in Supabase for user:', session.user.id);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', session.user.id);

      if (error) {
        console.error('[Onboarding Step 2] Error updating profile:', error);
      } else {
        console.log('[Onboarding Step 2] Supabase profile updated successfully. Waiting briefly before fetching...');
        
        // Add a small delay (e.g., 200ms) before fetching profile
        await delay(200);
        
        console.log('[Onboarding Step 2] Fetching latest profile...');
        // Explicitly refresh the profile context after successful DB update and delay
        await fetchProfile(); 
        setIsOnboarded(true); // Keep this for potential local UI changes
        console.log('[Onboarding Step 2] Profile context refreshed.');
        // Navigation should now be triggered by the layout watcher reacting to the updated context
      }
    } catch (e) {
      console.error('[Onboarding Step 2] Unexpected error during update:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        {/* Main Content Area */}
        <View style={styles.contentContainer}>
          {/* Add Emoji */}
          <Text style={styles.emojiStyle}>🧠</Text> 
          <Text style={styles.headerText}>
            How Vzn helps you win
          </Text>
          
          {/* Bullet Points List */}
          <View style={styles.bulletListContainer}>
            {bulletPoints.map((point, index) => (
              <View key={index} style={styles.bulletItem}>
                <MaterialCommunityIcons 
                  name="check-circle-outline" 
                  size={20} 
                  color={Colors.dark.textOff} 
                  style={styles.bulletIcon}
                />
                <Text style={styles.bulletText}>{point}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Button Area */}
        <View style={styles.ctaContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              (loading || !session) && styles.buttonDisabled,
              pressed && !loading && !session && styles.buttonPressed,
            ]}
            onPress={handleComplete}
            disabled={loading || !session}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Saving...' : 'Start My First Session'}
            </Text>
          </Pressable>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

// Styles adapted from Screen 1 and Auth screens
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  emojiStyle: { // Style for the emoji (consistent with Screen 1)
    fontSize: 60, 
    marginBottom: 20, 
  },
  headerText: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 32, // More space before bullet points
    lineHeight: 36,
  },
  bulletListContainer: {
    alignSelf: 'stretch', 
    paddingLeft: 30, // Increase left padding for more indentation
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bulletIcon: {
    color: Colors.dark.textOff,
    marginRight: 10,
  },
  bulletText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 17,
    color: Colors.dark.textOff,
    lineHeight: 24,
  },
  ctaContainer: {
    paddingBottom: 20,
  },
  button: {
    backgroundColor: Colors.dark.inputBackground, // Dark button like screen 1
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonPressed: {
    backgroundColor: Colors.dark.buttonDisabled, // Consistent pressed state
  },
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: Colors.dark.inputBackground,
  },
  buttonText: {
    color: Colors.dark.tint, // White text
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
  },
}); 