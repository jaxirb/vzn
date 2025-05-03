import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments, Href } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Platform, View } from 'react-native';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { superwallService } from '@/services/superwall';
import { useColorScheme } from '@/hooks/useColorScheme';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { supabase } from '@/services/supabase';
import { Session } from '@supabase/supabase-js';
import { ProfileProvider, useProfile } from '@/contexts/ProfileContext';
import { Colors } from '@/constants/Colors';
import { Profile } from '@/services/supabase';

// Prevent the splash screen from auto-hiding.
SplashScreen.preventAutoHideAsync();

// Custom hook to manage auth state and DECIDE navigation target
function useProtectedRoute(
  session: Session | null,
  profile: Profile | null,
  profileLoading: boolean,
  isLayoutReady: boolean,
  firstRun: React.MutableRefObject<boolean>,
  setNavigationTarget: (target: string | null) => void,
  setIsNavigationResolved: (value: boolean) => void
) {
  const segments = useSegments();

  // Determine if the profile data is definitively loaded (or if there's no session)
  const isProfileCheckReady = !profileLoading || !session;

  useEffect(() => {
    // Wait for auth session, fonts (via isLayoutReady), AND profile check to be ready
    if (!isLayoutReady || !isProfileCheckReady) { 
      console.log(`[Auth Guard Inner] Effect skipped: LayoutReady=${isLayoutReady}, ProfileCheckReady=${isProfileCheckReady}`);
      return;
    }

    console.log(`[Auth Guard Inner] Scheduling check for next tick. Session: ${!!session}, Profile: ${!!profile}, ProfileLoading: ${profileLoading}, LayoutReady: ${isLayoutReady}, FirstRun: ${firstRun.current}`);

    // *** Delay the core logic slightly ***
    const timerId = setTimeout(() => {
      console.log('[Auth Guard Inner] Timeout executing...');
      if (!firstRun.current && !profileLoading) { // Add !profileLoading check here too
          console.log('[Auth Guard Inner] Aborting timeout execution, not first run or profile is stable.')
          // We might need to re-resolve navigation if profile updated but target didn't change
          // Let's check if navigation IS resolved AND target is null
          // This part gets tricky, let's simplify for now and only check firstRun inside timeout
          // return; 
      }

      const currentSegments = segments; // Capture segments at the time of execution
      const inAuthGroup = currentSegments[0] === '(auth)';
      const inOnboardingGroup = currentSegments[0] === 'onboarding';
      // @ts-ignore - Check for initial empty segments array
      const isAtRootIndex = currentSegments.length === 0 || currentSegments[0] === '';
      console.log(`[Auth Guard Inner Timeout] Running checks. Segments: ${currentSegments.join('/') || '(root)'}, InAuth: ${inAuthGroup}, InOnboarding: ${inOnboardingGroup}, IsRoot: ${isAtRootIndex}, Session: ${!!session}, Profile: ${!!profile}`);

      const setTarget = (target: string) => {
        console.log(`[Auth Guard Inner Timeout] Setting navigation target to ${target}`);
        setNavigationTarget(target);
        // Resolve navigation here, as the target is now definitively set
        setIsNavigationResolved(true); 
        firstRun.current = false; // Mark first run complete only after target is set or stayed
      };

      const stayAndResolve = () => {
          console.log(`[Auth Guard Inner Timeout] Staying in current location. Resolving navigation.`);
          setIsNavigationResolved(true);
          setNavigationTarget(null);
          firstRun.current = false; // Mark first run complete
      }

      // --- Step 1: Handle No Session ---
      if (!session) {
        if (!inAuthGroup) {
          console.log('[Auth Guard Inner Timeout] No session and outside Auth group. Setting target: /(auth).');
          setTarget('/(auth)');
        } else {
          stayAndResolve();
        }
        return; // Exit early if no session
      }

      // --- Step 2: Handle Existing Session (Profile should be loaded or loading is false) ---
      console.log('[Auth Guard Inner Timeout] Session exists. Checking onboarding status from context profile...');

      const onboardingComplete = profile?.onboarding_completed ?? false;
      console.log(`[Auth Guard Inner Timeout] Profile check complete (from context). OnboardingComplete: ${onboardingComplete}`);

      if (!onboardingComplete) {
        if (!inOnboardingGroup) {
          console.log(`[Auth Guard Inner Timeout] Needs Onboarding & NOT in Onboarding Group -> Setting target: /onboarding`);
          setTarget('/onboarding');
        } else {
          stayAndResolve();
        }
      } else { // Onboarding IS complete
        if (inAuthGroup || inOnboardingGroup || isAtRootIndex) {
          console.log(`[Auth Guard Inner Timeout] Onboarding Complete & in Auth/Onboarding/Root -> Setting target: /(tabs)`);
          setTarget('/(tabs)');
        } else {
          stayAndResolve();
        }
      }

    }, 0); // Execute after current stack clears

    // Cleanup the timeout if dependencies change or component unmounts before it runs
    return () => clearTimeout(timerId);

  // Add profile and profileLoading to dependencies!
  }, [session, profile, profileLoading, isLayoutReady, isProfileCheckReady, segments, firstRun, setNavigationTarget, setIsNavigationResolved]);
}

// New Inner Component that uses the context
function InnerLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const firstRun = useRef(true);
  // Get session, profile, loading from context
  const { session, profile, loading: profileLoading, fetchProfile } = useProfile(); 

  const [isNavigationResolved, setIsNavigationResolved] = useState(false);
  const [navigationTarget, setNavigationTarget] = useState<string | null>(null);

  // This state now depends on the parent RootLayout's font loading
  // We need to get the `loaded` state down here.
  // For now, let's assume layout is ready if profile check is done.
  // A better approach might pass `loaded` down as a prop.
  const isLayoutReady = true; // Placeholder - Requires passing font `loaded` state down

  // Reset navigation resolution when session changes (user logs in/out)
  useEffect(() => {
      console.log('[InnerLayout] Session changed, resetting navigation state.');
      firstRun.current = true;
      setIsNavigationResolved(false);
      setNavigationTarget(null);
      // Profile context already handles fetching profile on session change
  }, [session]);

  // Hook to determine navigation
  const stableSetNavigationTarget = useCallback(setNavigationTarget, []);
  useProtectedRoute(
    session,
    profile,
    profileLoading,
    isLayoutReady, // Pass layout readiness (needs font state)
    firstRun,
    stableSetNavigationTarget,
    setIsNavigationResolved
  );

  // Effect to Handle Navigation
  useEffect(() => {
    if (navigationTarget) { // Navigate immediately if target is set
      console.log(`[Navigation Effect Inner] Attempting to navigate to target: ${navigationTarget}`);
      router.replace(navigationTarget as Href);
      // Optionally reset target immediately after initiating navigation
      // setNavigationTarget(null); 
    }
  }, [navigationTarget, router]);

  // Hide splash screen ONLY when navigation logic is complete
  useEffect(() => {
    let hideTimeoutId: NodeJS.Timeout | null = null;
    // Hide when navigation is resolved, regardless of target (nav will handle it)
    if (isNavigationResolved) { 
      console.log('[InnerLayout] Conditions met to hide splash screen, scheduling hide...');
      hideTimeoutId = setTimeout(() => {
        console.log('[InnerLayout] Hiding SplashScreen now (after slight delay).');
        SplashScreen.hideAsync();
      }, 300); 
    } else {
      console.log(`[InnerLayout] SplashScreen not hidden yet: NavResolved=${isNavigationResolved}`);
    }
    return () => {
      if (hideTimeoutId) {
        clearTimeout(hideTimeoutId);
      }
    };
  }, [isNavigationResolved]);

  console.log(`[InnerLayout] Rendering. ProfileLoading=${profileLoading}, NavResolved=${isNavigationResolved}, Target=${navigationTarget}`);

  // Render the actual navigation stack
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen
          name="compliance"
          options={({ route }) => ({
            title: (route.params as { title?: string })?.title ?? 'Info',
            headerShown: true,
            headerBackTitle: 'Home',
            headerStyle: { backgroundColor: Colors.dark.background },
            headerTintColor: Colors.dark.text,
            headerTitleStyle: { color: Colors.dark.text },
          })}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

// Main Root Layout Component
export default function RootLayout() {
  console.log('RootLayout mounted - Outer');
  
  // Load fonts
  const [loaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Inter-Light': require('../assets/fonts/Inter/static/Inter_18pt-Light.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter/static/Inter_18pt-Medium.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter/static/Inter_18pt-Bold.ttf'),
    'ChakraPetch-Light': require('../assets/fonts/Chakra_Petch/ChakraPetch-Light.ttf'),
    'ChakraPetch-Medium': require('../assets/fonts/Chakra_Petch/ChakraPetch-Medium.ttf'),
    'ChakraPetch-SemiBold': require('../assets/fonts/Chakra_Petch/ChakraPetch-SemiBold.ttf'),
    'ChakraPetch-Bold': require('../assets/fonts/Chakra_Petch/ChakraPetch-Bold.ttf'),
  });

  // Handle font loading errors
  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  // Initialize Superwall
  useEffect(() => {
    if (Platform.OS !== 'web') {
      console.log('Initializing Superwall - Outer');
      superwallService.initialize();
    }
  }, []);

  // Only render the main layout AFTER fonts are loaded
  // Splash screen is handled inside InnerLayout based on navigation resolution
  if (!loaded) {
      console.log('[RootLayout Outer] Fonts not loaded yet, rendering null.')
      return null; // Or a minimal loading indicator if preferred
  }

  console.log('[RootLayout Outer] Fonts loaded, rendering Providers and InnerLayout.');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProfileProvider>
        <OnboardingProvider>
          {/* Render the InnerLayout which contains the ThemeProvider and Stack */}
          <InnerLayout /> 
        </OnboardingProvider>
      </ProfileProvider>
    </GestureHandlerRootView>
  );
}
