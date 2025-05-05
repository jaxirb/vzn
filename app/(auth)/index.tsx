import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert, View, Pressable, Text, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { supabase } from '@/services/supabase'; // Import the Supabase client
import { Colors } from '@/constants/Colors'; // Assuming Colors constant exists
import ComplianceModal from '@/components/modals/ComplianceModal'; // Import the modal
import { PLACEHOLDER_TERMS, PLACEHOLDER_PRIVACY } from '@/app/compliance'; // Import content

// Simple email validation regex
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// --- App Review Demo Account --- 
const DEMO_EMAIL = 'vzntest02@gmail.com';
const DEMO_PASSWORD = 'VznDemoPass123!'; // Ensure this matches the password set via Edge Function
// --- End App Review --- 

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // State for the compliance modal
  const [isComplianceModalVisible, setIsComplianceModalVisible] = useState(false);
  const [complianceModalTitle, setComplianceModalTitle] = useState('');
  const [complianceModalContent, setComplianceModalContent] = useState('');

  async function signInWithEmail() {
    setLoading(true);
    const enteredEmail = email.trim().toLowerCase(); // Normalize email

    // --- App Review Demo Account Logic ---
    if (enteredEmail === DEMO_EMAIL) {
      console.log('[Auth Index] Demo email detected, attempting password sign-in...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });

      if (error) {
        Alert.alert('Demo Login Error', error.message);
        console.error('Supabase signInWithPassword error (Demo Account):', error);
      } else {
        // Success! Session is established.
        // onAuthStateChange listener in _layout.tsx handles navigation.
        console.log('[Auth Index] Demo account sign-in successful.');
      }
      setLoading(false);
      return; // Stop here for demo account
    }
    // --- End Demo Account Logic ---

    // --- Standard OTP Flow ---
    console.log('[Auth Index] Standard email detected, attempting OTP sign-in...');
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: enteredEmail, // Use normalized email
      options: {
        shouldCreateUser: true,
      },
    });

    if (otpError) {
      Alert.alert('Error', otpError.message);
      console.error('Supabase signInWithOtp error:', otpError);
      setLoading(false); // Ensure loading is reset on error
    } else {
      // Navigate to OTP screen for standard users
      router.push({
        pathname: '/(auth)/verify-otp',
        params: { email: enteredEmail }, // Pass normalized email
      });
      setLoading(false); // Reset loading after initiating navigation
    }
    // --- End Standard OTP Flow ---
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

  // Function to open the modal
  const openComplianceModal = (title: string, content: string) => {
    setComplianceModalTitle(title);
    setComplianceModalContent(content);
    setIsComplianceModalVisible(true);
  };

  // Function to close the modal
  const closeComplianceModal = () => {
    setIsComplianceModalVisible(false);
    // Optionally clear content/title after closing
    // setComplianceModalTitle('');
    // setComplianceModalContent('');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Image
            source={require('@/assets/images/splash-icon.png')}
            style={styles.logo}
          />
          <ThemedText type="title" style={styles.title}>Welcome to Vzn</ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>Build focus. Earn XP. Level up.</ThemedText>
          {/* Remove Description Line */}
          {/* <ThemedText style={styles.description}>
            Your journey to deep work and discipline starts here.
          </ThemedText> */}
        </View>

        <View style={styles.inputSection}>
          <ThemedText style={styles.inputLabel}>Enter your email to sign in</ThemedText>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="email@address.com"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor={Colors.dark.textMuted}
              textContentType="emailAddress"
            />
          </View>
          <Pressable
              style={({ pressed }) => [
                  styles.button,
                  (loading || !isValidEmail(email)) && styles.buttonDisabled,
              ]}
              onPress={signInWithEmail}
              disabled={loading || !isValidEmail(email)}
              >
              <Text style={styles.buttonText}>
                  {loading ? 'Sending...' : 'Continue'}
              </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our{' '}
          <Text style={styles.linkText} onPress={() => openComplianceModal('Terms of Service', PLACEHOLDER_TERMS)}>
            Terms of Service
          </Text>
          {' '}
and{' '}
          <Text style={styles.linkText} onPress={() => openComplianceModal('Privacy Policy', PLACEHOLDER_PRIVACY)}>
            Privacy Policy
          </Text>
          .
        </Text>
      </View>

      {/* Render the Compliance Modal */}
      <ComplianceModal
        isVisible={isComplianceModalVisible}
        onClose={closeComplianceModal}
        title={complianceModalTitle}
        content={complianceModalContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 100,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 34,
    color: Colors.dark.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 17,
    color: Colors.dark.textOff,
    marginBottom: 0,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  // description style removed
  /*
  description: {
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    color: Colors.dark.textOff,
    fontSize: 17,
    lineHeight: 22,
  },
  */
  inputSection: {
    width: '100%',
    alignItems: 'center',
  },
  inputLabel: {
      fontSize: 13,
      color: Colors.dark.textMuted,
      marginBottom: 12,
      textAlign: 'center',
      fontFamily: 'Inter-Medium',
  },
  inputContainer: {
    marginBottom: 12,
    width: '100%',
  },
  input: {
    height: 50,
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.dark.inputText,
    borderWidth: 0,
  },
  button: {
      backgroundColor: 'transparent',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
  },
  buttonDisabled: {
      opacity: 0.5,
  },
  buttonText: {
      color: Colors.dark.tint,
      fontSize: 17,
      fontFamily: 'Inter-SemiBold',
  },
  footerContainer: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 12,
    color: Colors.dark.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
  linkText: {
    color: Colors.dark.textMuted,
    textDecorationLine: 'underline',
    fontFamily: 'Inter-Medium',
  },
}); 