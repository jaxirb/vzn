import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/services/supabase'; // Import Supabase client
// import { PhoneOtpType } from '@supabase/supabase-js'; // Type not needed for email OTP

export default function VerifyOtpScreen() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const { email } = useLocalSearchParams<{ email: string }>(); // Get email from query params
  const router = useRouter(); // Keep router if needed for other actions, but not for post-login nav

  async function verifyOtpCode() {
    if (!email) {
      Alert.alert('Error', 'Email parameter is missing.');
      // Optionally navigate back or handle error appropriately
      // router.back(); 
      return;
    }
    setLoading(true);
    
    // Call Supabase verifyOtp
    const { data, error } = await supabase.auth.verifyOtp({
      email: email, // Use email for email OTP
      token: token,
      type: 'email', // Specify type as 'email' for email OTP
      // Note: For phone OTP use: phone: phone, token: token, type: 'sms'
    });

    if (error) {
      Alert.alert('Error', error.message);
      console.error('Supabase verifyOtp error:', error);
    } else {
      // Success! Session should be established.
      // The onAuthStateChange listener in _layout.tsx will handle navigation.
      Alert.alert('Success!', 'You have been signed in.');
      // No explicit navigation here, rely on root layout listener
      // router.replace('/(tabs)'); 
    }
    setLoading(false);
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Verify Code</ThemedText>
      <ThemedText style={styles.subtitle}>
        Enter the 6-digit code sent to {email || 'your email'}
      </ThemedText>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setToken}
          value={token}
          placeholder="123456"
          autoCapitalize="none"
          keyboardType="number-pad"
          maxLength={6}
          placeholderTextColor="#888"
        />
      </View>
      <Button
        title={loading ? 'Verifying...' : 'Verify Code'}
        onPress={verifyOtpCode}
        disabled={loading || token.length !== 6}
      />
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
    textAlign: 'center', // Center OTP code
    backgroundColor: '#fff', // Adapt for dark mode if needed
    color: '#000', // Adapt for dark mode if needed
  },
}); 