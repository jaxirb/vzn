import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert, View, Pressable, Text, Image, Platform } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { supabase } from '@/services/supabase'; // Import the Supabase client
import { Colors } from '@/constants/Colors'; // Assuming Colors constant exists
import ComplianceModal from '@/components/modals/ComplianceModal'; // Import the modal
import { PLACEHOLDER_TERMS, PLACEHOLDER_PRIVACY } from '@/app/compliance'; // Import content
import { FontAwesome } from '@expo/vector-icons'; // For Google icon
import * as WebBrowser from 'expo-web-browser'; // Import WebBrowser
import * as AppleAuthentication from 'expo-apple-authentication'; // Import AppleAuthentication

// Simple email validation regex
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// --- App Review Demo Account --- 
const DEMO_EMAIL = 'vzntest02@gmail.com';
const DEMO_PASSWORD = 'VznDemoPass123!'; // Ensure this matches the password set via Edge Function
// --- End App Review --- 

// Helper function to parse URL fragment
function parseUrlFragment(fragmentString: string | undefined): { [key: string]: string } {
  const params: { [key: string]: string } = {};
  if (fragmentString) {
    const hash = fragmentString.startsWith('#') ? fragmentString.substring(1) : fragmentString;
    const items = hash.split('&');
    items.forEach(item => {
      const parts = item.split('=');
      if (parts.length === 2) {
        params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
      }
    });
  }
  return params;
}

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false); // New loading state for Apple
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

  // --- Google Sign-In Function ---
  async function signInWithGoogle() {
    console.log('[Auth Index] signInWithGoogle called. Current googleLoading state:', googleLoading);
    if (googleLoading) {
      console.log('[Auth Index] Google Sign-In already in progress, aborting duplicate call.');
      return;
    }
    setGoogleLoading(true);
    console.log('[Auth Index] Attempting Google Sign-In... setGoogleLoading(true).');
    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'myapp://oauth/callback', // Your app's custom scheme
          // queryParams: { access_type: 'offline', prompt: 'consent', } // Optional
          skipBrowserRedirect: true, // Important: tells Supabase we will handle the redirect
        },
      });

      console.log('[Auth Index] Supabase signInWithOAuth call completed.');
      if (oauthError) {
        Alert.alert('Google Sign-In Error', oauthError.message);
        console.error('Supabase signInWithOAuth (Google) error:', oauthError);
        setGoogleLoading(false); // Reset loading on error
        return;
      }

      if (data.url) {
        console.log('[Auth Index] Got URL from Supabase, attempting to open with WebBrowser:', data.url);
        const result = await WebBrowser.openAuthSessionAsync(data.url, 'myapp://oauth/callback');
        console.log('[Auth Index] WebBrowser.openAuthSessionAsync result:', result);

        if (result.type === 'success' && result.url) {
          console.log('[Auth Index] WebBrowser success, raw URL:', result.url);
          const urlParts = result.url.split('#');
          if (urlParts.length > 1) {
            const fragment = urlParts[1];
            const params = parseUrlFragment(fragment); // Use our helper

            const { access_token, refresh_token } = params; // We primarily need these two

            if (access_token && refresh_token) {
              console.log('[Auth Index] Extracted access_token and refresh_token from URL fragment.');
              try {
                const { data: sessionData, error: setError } = await supabase.auth.setSession({
                  access_token,
                  refresh_token,
                });

                if (setError) {
                  console.error('[Auth Index] Error calling supabase.auth.setSession:', setError.message);
                  Alert.alert('Google Sign-In Error', 'Could not establish session. Please try again. (' + setError.message + ')');
                } else {
                  console.log('[Auth Index] supabase.auth.setSession successful. Session data user:', sessionData?.user?.id);
                  // At this point, onAuthStateChange in ProfileContext should have been triggered with SIGNED_IN
                  // and handled navigation. The user object might be in sessionData.user.
                }
              } catch (e: any) {
                console.error('[Auth Index] Exception during supabase.auth.setSession:', e?.message || String(e));
                Alert.alert('Google Sign-In Exception', 'An unexpected error occurred during Google Sign-In. (' + (e?.message || String(e)) + ')');
              }
            } else {
              console.error('[Auth Index] access_token or refresh_token not found in URL fragment. Params:', params);
              Alert.alert('Google Sign-In Error', 'Incomplete authentication response from Google.');
            }
          } else {
            console.error('[Auth Index] No fragment found in callback URL from WebBrowser:', result.url);
            Alert.alert('Google Sign-In Error', 'Invalid authentication response format from Google.');
          }
        } else if (result.type === 'cancel' || result.type === 'dismiss') {
          console.log('[Auth Index] OAuth flow cancelled or dismissed by user.');
          Alert.alert('Cancelled', 'Google Sign-In was cancelled.');
        } else {
          console.log('[Auth Index] WebBrowser returned an unexpected result type or no URL.');
        }
      } else {
        console.log('[Auth Index] No URL returned from Supabase signInWithOAuth.');
        Alert.alert('Google Sign-In Error', 'Could not get Google authentication URL.');
      }
    } catch (e) {
      Alert.alert('Google Sign-In Exception', e instanceof Error ? e.message : String(e));
      console.error('[Auth Index] Exception during Google signInWithOAuth:', e);
    }
    setGoogleLoading(false);
    console.log('[Auth Index] Google Sign-In process finished. setGoogleLoading(false).');
  }
  // --- End Google Sign-In Function ---

  // --- Apple Sign-In Function ---
  async function signInWithApple() {
    console.log('[Auth Index] signInWithApple called. Current appleLoading state:', appleLoading);
    if (appleLoading) {
      console.log('[Auth Index] Apple Sign-In already in progress, aborting duplicate call.');
      return;
    }
    setAppleLoading(true);
    console.log('[Auth Index] Attempting Apple Sign-In... setAppleLoading(true).');
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log('[Auth Index] AppleAuthentication.signInAsync successful:', credential);

      if (credential.identityToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });

        console.log('[Auth Index] Supabase signInWithIdToken (Apple) call completed.');
        if (error) {
          Alert.alert('Apple Sign-In Error', error.message);
          console.error('Supabase signInWithIdToken (Apple) error:', error);
        } else {
          console.log('[Auth Index] Apple Sign-In with Supabase successful. User:', data?.user?.id);
          // onAuthStateChange in ProfileContext should handle navigation
        }
      } else {
        console.log('[Auth Index] No identityToken received from Apple.');
        Alert.alert('Apple Sign-In Error', 'Could not get identity token from Apple.');
      }
    } catch (e: any) {
      if (e.code === 'ERR_REQUEST_CANCELED') {
        console.log('[Auth Index] Apple Sign-In cancelled by user.');
        // Alert.alert('Cancelled', 'Apple Sign-In was cancelled.'); // Optional: can be noisy
      } else {
        Alert.alert('Apple Sign-In Exception', e?.message || String(e));
        console.error('[Auth Index] Exception during Apple Sign-In:', e);
      }
    } finally {
      setAppleLoading(false);
      console.log('[Auth Index] Apple Sign-In process finished. setAppleLoading(false).');
    }
  }
  // --- End Apple Sign-In Function ---

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

          {/* Divider Text */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <ThemedText style={styles.dividerText}>OR</ThemedText>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign-In Button */}
          {!appleLoading && ( // Hide Google button if Apple is loading, and vice-versa
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.googleButton,
                googleLoading && styles.buttonDisabled,
                pressed && !googleLoading && styles.buttonPressed,
              ]}
              onPress={signInWithGoogle}
              disabled={googleLoading}
            >
              <FontAwesome name="google" size={20} color={Colors.dark.text} style={styles.googleIcon} />
              <ThemedText style={styles.buttonText}>Sign in with Google</ThemedText>
            </Pressable>
          )}

          {/* Apple Sign-In Button - Only for iOS */} 
          {Platform.OS === 'ios' && !googleLoading && ( // Only show on iOS and hide if Google is loading
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={10}
              style={[styles.appleButton, appleLoading && styles.buttonDisabled]} // Apply styling for disabled look
              onPress={signInWithApple} // The signInWithApple function already checks appleLoading
            />
          )}
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
      paddingHorizontal: 15,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
  },
  buttonDisabled: {
    backgroundColor: Colors.dark.buttonDisabled,
    opacity: 0.7,
  },
  buttonPressed: {
    backgroundColor: Colors.dark.tintPressed,
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
  // --- Add Google Button Styles ---
  googleButton: {
    backgroundColor: Colors.dark.inputBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.dark.inputBorder,
    borderWidth: 1,
  },
  googleIcon: {
    marginRight: 10,
  },
  // --- End Google Button Styles ---
  // --- Add Divider Styles ---
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginVertical: 16, // Reduced margin slightly if Apple button is also there
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.dark.inputBorder,
  },
  dividerText: {
    marginHorizontal: 10,
    color: Colors.dark.textMuted,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  // --- End Divider Styles ---
  // --- Add Apple Button Styles ---
  appleButton: {
    width: '100%',
    height: 50, // Match typical button height from styles.button or input
    marginTop: 15, // Space from Google button or divider
    // Note: Internal text/icon of Apple button is controlled by Apple's component.
    // We primarily control container size and corner radius here.
  },
  // --- End Apple Button Styles ---
}); 