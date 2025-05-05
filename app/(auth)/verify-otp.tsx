import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert, View, Pressable, Text, SafeAreaView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/services/supabase'; // Import Supabase client
import { Colors } from '@/constants/Colors'; // Import Colors
// import { PhoneOtpType } from '@supabase/supabase-js'; // Type not needed for email OTP

export default function VerifyOtpScreen() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const { email } = useLocalSearchParams<{ email: string }>(); // Get email from query params
  const router = useRouter(); // Keep router if needed for other actions, but not for post-login nav

  async function verifyOtpCode() {
    if (!email) {
      Alert.alert('Error', 'Email parameter is missing.');
      return;
    }
    if (token.length !== 6) { // Add check for token length before API call
      Alert.alert('Invalid Code', 'Please enter the 6-digit code.');
      return;
    }
    setLoading(true);

    // Removed App Store Review Bypass Check logic
    
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
      console.log('[verifyOtpCode] Supabase verifyOtp successful. Relying on listener for navigation.');
      // Alert.alert('Success!', 'You have been signed in.');
      // No explicit navigation here
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <ThemedText type="title" style={styles.title}>Verify Code</ThemedText>
            <ThemedText style={styles.subtitle}>
              Enter the 6-digit code sent to {email || 'your email'}
            </ThemedText>
          </View>

          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                onChangeText={setToken}
                value={token}
                placeholder="123456"
                autoCapitalize="none"
                keyboardType="number-pad"
                maxLength={6}
                placeholderTextColor={Colors.dark.textMuted}
                textContentType="oneTimeCode"
              />
            </View>
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    (loading || token.length !== 6) && styles.buttonDisabled,
                ]}
                onPress={verifyOtpCode}
                disabled={loading || token.length !== 6}
                >
                <Text style={styles.buttonText}>
                    {loading ? 'Verifying...' : 'Verify Code'}
                </Text>
            </Pressable>
          </View>
        </View>

        {/* Optional: Add a Resend code button/link later? */}
        {/* Optional: Add legal footer if needed */}

      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 30,
    color: Colors.dark.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 17,
    color: Colors.dark.textOff,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 0,
  },
  inputSection: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 16,
    width: '80%',
  },
  input: {
    height: 50,
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: Colors.dark.inputText,
    borderWidth: 0,
    textAlign: 'center',
    letterSpacing: 5,
  },
  button: {
      backgroundColor: 'transparent',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginTop: 10,
  },
  buttonDisabled: {
      opacity: 0.5,
  },
  buttonText: {
      color: Colors.dark.tint,
      fontSize: 17,
      fontFamily: 'Inter-SemiBold',
  },
}); 