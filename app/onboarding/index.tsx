import React from 'react';
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient'; // Remove import

export default function OnboardingScreen1() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/onboarding/step2');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Remove Gradient wrapper */}
      {/* 
      <LinearGradient
        colors={[Colors.dark.inputBackground, Colors.dark.background]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
      */}
        <ThemedView style={styles.container}>
          {/* Main Content Area */}
          <View style={styles.contentContainer}>
            {/* Add Emoji */}
            <Text style={styles.emojiStyle}>⚡️</Text> 
            <Text style={styles.headerText}>
              Reclaim your focus.
            </Text>
            <Text style={styles.bodyText}>Distractions kill momentum.</Text>
            <Text style={styles.bodyText}>Focus is your edge.</Text>
            <Text style={styles.bodyText}>Vzn helps you sharpen it.</Text>
            <Text style={styles.bodyText}>One session at a time.</Text>
            
            {/* Remove Icon */}
            {/* 
            <MaterialCommunityIcons 
              name="arrow-down" 
              size={32} 
              color={Colors.dark.textOff} 
              style={styles.iconStyle} 
            />
            */}
          </View>

          {/* CTA Button Area */}
          <View style={styles.ctaContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleNext}
            >
              <Text style={styles.buttonText}>Let's Go</Text>
            </Pressable>
          </View>
        </ThemedView>
      {/* Remove Gradient wrapper end */}
      {/* </LinearGradient> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  // gradient style removed
  /*
  gradient: { 
    flex: 1,
  },
  */
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background, // Restore background color
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
  emojiStyle: { // Style for the emoji
    fontSize: 60, // Make emoji large
    marginBottom: 20, // Space below emoji
  },
  headerText: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 36,
  },
  bodyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 17,
    color: Colors.dark.textOff,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  ctaContainer: {
    paddingBottom: 20,
  },
  button: {
    backgroundColor: Colors.dark.inputBackground, // Dark grey background
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonPressed: {
    backgroundColor: Colors.dark.buttonDisabled, // Slightly lighter grey press
  },
  buttonText: {
    color: Colors.dark.tint, // White text
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
  },
  // Remove styles for sign out button
  /*
  signOutButton: {
    position: 'absolute',
    top: 60, // Adjust position as needed
    right: 20,
    padding: 8,
    backgroundColor: '#555', // Simple background
    borderRadius: 5,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 12,
  },
  */
  // Remove icon style
  /*
  iconStyle: {
    marginTop: 30,
  },
  */
}); 