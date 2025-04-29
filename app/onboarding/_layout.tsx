import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';

export default function OnboardingLayout() {
  // Render the currently matched child route without a nested Stack
  return <Slot />;
} 