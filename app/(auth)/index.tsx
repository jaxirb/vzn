import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { supabase } from '@/services/supabase'; // Import the Supabase client

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true);
    // Revert back to signInWithOtp as signIn is not available on auth client
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: true,
        // Optionally add emailRedirectTo if needed later
      },
    });

    if (error) {
      Alert.alert('Error', error.message);
      console.error('Supabase signInWithOtp error:', error);
    } else {
      Alert.alert('Check your email!', `An OTP code has been sent to ${email}`);
      // Navigate to OTP verification screen within the (auth) group
      router.push({
        pathname: '/(auth)/verify-otp',
        params: { email: email },
      });
    }
    setLoading(false);
  }

  // --- Add Sign Out Handler ---
  async function handleSignOut() {
    setLoading(true); // Optional: show loading state
    console.log('[Auth Index] Attempting sign out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', `Sign out failed: ${error.message}`);
      console.error('Supabase signOut error:', error);
    } else {
      Alert.alert('Success', 'You have been signed out.');
      console.log('[Auth Index] Sign out successful.');
      // No navigation needed, onAuthStateChange in layout handles it.
    }
    setLoading(false);
  }
  // --- End Add Sign Out Handler ---

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome to Vzn</ThemedText>
      <ThemedText style={styles.subtitle}>Enter your email to sign in or sign up</ThemedText>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#888"
        />
      </View>
      <Button
        title={loading ? 'Sending...' : 'Send OTP Code'}
        onPress={signInWithEmail}
        disabled={loading || !email}
      />
      {/* --- Add Sign Out Button --- */}
      <View style={styles.signOutButtonContainer}>
        <Button
          title="Sign Out (Clear Session)"
          onPress={handleSignOut}
          disabled={loading}
          color="#888" // Use a different color to distinguish
        />
      </View>
      {/* --- End Add Sign Out Button --- */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  subtitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff', // Adapt for dark mode if needed
    color: '#000', // Adapt for dark mode if needed
  },
  signOutButtonContainer: {
    marginTop: 20, // Add some space above the sign out button
  },
}); 