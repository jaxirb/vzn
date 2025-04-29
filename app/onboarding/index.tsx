import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';

export default function OnboardingIndexScreen() {
  const router = useRouter();

  const handleNext = () => {
    console.log("Proceeding from onboarding index to problem...");
    router.push('/onboarding/problem');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title">Welcome to Onboarding!</ThemedText>
        <ThemedText style={styles.text}>
          This is the placeholder onboarding screen.
        </ThemedText>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          Continue
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Pushes button to bottom
    padding: 20,
  },
  content: {
    flex: 1, // Allows content to take up space
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#0A7EA4', // Example color
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16, // Margin at the bottom
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
}); 