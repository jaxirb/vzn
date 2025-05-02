import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments, Href } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Platform, View } from 'react-native';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { superwallService } from '@/services/superwall';
import { useColorScheme } from '@/hooks/useColorScheme';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { supabase } from '@/services/supabase';
import { Session } from '@supabase/supabase-js';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { Colors } from '@/constants/Colors';

// Prevent the splash screen from auto-hiding.
SplashScreen.preventAutoHideAsync();

// Custom hook to manage auth state and DECIDE navigation target
function useProtectedRoute(
  session: Session | null,
  isReady: boolean,
  firstRun: React.MutableRefObject<boolean>,
  setNavigationTarget: (target: string | null) => void,
  setIsNavigationResolved: (value: boolean) => void
) {
  const segments = useSegments();

  useEffect(() => {
    if (!isReady || !firstRun.current) {
      console.log(`[Auth Guard] Effect skipped: Ready=${isReady}, FirstRun=${firstRun.current}`);
      return;
    }

    console.log(`[Auth Guard] Scheduling check for next tick. Session: ${!!session}, Ready: ${isReady}, FirstRun: ${firstRun.current}`);

    // *** Delay the core logic slightly ***
    const timerId = setTimeout(() => {
      console.log('[Auth Guard] Timeout executing...');
      if (!firstRun.current) { // Check again in case state changed rapidly
          console.log('[Auth Guard] Aborting timeout execution, first run already completed.')
          return;
      }

      const currentSegments = segments; // Capture segments at the time of execution
      const inAuthGroup = currentSegments[0] === '(auth)';
      const inOnboardingGroup = currentSegments[0] === 'onboarding';
      // @ts-ignore - Check for initial empty segments array
      const isAtRootIndex = currentSegments.length === 0 || currentSegments[0] === '';
      console.log(`[Auth Guard Timeout] Running checks. Segments: ${currentSegments.join('/') || '(root)'}, InAuth: ${inAuthGroup}, InOnboarding: ${inOnboardingGroup}, IsRoot: ${isAtRootIndex}, Session: ${!!session}`);

      const setTarget = (target: string) => {
        console.log(`[Auth Guard Timeout] Setting navigation target to ${target}`);
        setNavigationTarget(target);
      };

      // --- Step 1: Handle No Session ---
      if (!session) {
        if (!inAuthGroup) {
          console.log('[Auth Guard Timeout] No session and outside Auth group. Setting target: /(auth).');
          setTarget('/(auth)');
        } else {
          console.log('[Auth Guard Timeout] No session and already in Auth group. Staying. Resolving navigation.');
          setIsNavigationResolved(true);
          setNavigationTarget(null);
          firstRun.current = false;
        }
      }
      // --- Step 2: Handle Existing Session ---
      else { // Session exists
        console.log('[Auth Guard Timeout] Session exists. Checking onboarding...');
        (async () => {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('onboarding_completed')
              .eq('id', session.user.id)
              .single();

            if (error && error.code !== 'PGRST116') {
              console.error('[Auth Guard Timeout] Error fetching profile:', error);
               setIsNavigationResolved(true);
               setNavigationTarget(null);
               firstRun.current = false;
              return;
            }

            const onboardingComplete = profile?.onboarding_completed ?? false;
            console.log(`[Auth Guard Timeout] Profile check complete. OnboardingComplete: ${onboardingComplete}`);

            if (!onboardingComplete) {
              if (!inOnboardingGroup) {
                console.log(`[Auth Guard Timeout] Needs Onboarding & NOT in Onboarding Group -> Setting target: /onboarding`);
                setTarget('/onboarding');
              } else {
                console.log(`[Auth Guard Timeout] Needs Onboarding & ALREADY in Onboarding Group -> Staying. Resolving navigation.`);
                setIsNavigationResolved(true);
                setNavigationTarget(null);
                firstRun.current = false;
              }
            } else { // Onboarding IS complete
              if (inAuthGroup || inOnboardingGroup || isAtRootIndex) {
                console.log(`[Auth Guard Timeout] Onboarding Complete & in Auth/Onboarding/Root -> Setting target: /(tabs)`);
                setTarget('/(tabs)');
              } else {
                console.log(`[Auth Guard Timeout] Onboarding Complete & NOT in Auth/Onboarding/Root -> Staying. Resolving navigation.`);
                setIsNavigationResolved(true);
                setNavigationTarget(null);
                firstRun.current = false;
              }
            }
          } catch (e) {
            console.error('[Auth Guard Timeout] Exception during onboarding check:', e);
             setIsNavigationResolved(true);
             setNavigationTarget(null);
             firstRun.current = false;
          }
        })();
      }
    }, 0); // Execute after current stack clears

    // Cleanup the timeout if dependencies change or component unmounts before it runs
    return () => clearTimeout(timerId);

  }, [session, isReady, segments, setNavigationTarget, setIsNavigationResolved]); // Keep dependencies
}

export default function RootLayout() {
  console.log('RootLayout mounted - Full');
  const colorScheme = useColorScheme();
  const router = useRouter();
  const firstRun = useRef(true);
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
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isNavigationResolved, setIsNavigationResolved] = useState(false);
  const [navigationTarget, setNavigationTarget] = useState<string | null>(null);

  // Handle font loading errors
  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  // Initialize Superwall
  useEffect(() => {
    if (Platform.OS !== 'web') {
      console.log('Initializing Superwall - Full');
      superwallService.initialize();
    }
  }, []);

  // Supabase Auth Listener
  useEffect(() => {
    console.log('Setting up onAuthStateChange listener');
    // Initial check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log('Initial session fetch completed:', !!initialSession);
      setSession(initialSession);
      setAuthLoading(false);
    }).catch(error => {
      console.error('Error fetching initial session:', error);
      setAuthLoading(false);
    });

    // Subscribe to subsequent changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log('[onAuthStateChange] Event:', _event, 'New Session:', !!newSession);
        // Reset navigation resolution process when auth state changes
        firstRun.current = true;
        setIsNavigationResolved(false);
        setNavigationTarget(null);
        setSession(newSession);
      }
    );

    return () => {
      console.log('Cleaning up onAuthStateChange listener');
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Check if overall layout is ready (fonts loaded AND auth checked)
  const isLayoutReady = loaded && !authLoading;

  // Pass setters and the firstRun ref to the hook
  const stableSetNavigationTarget = useCallback(setNavigationTarget, []);
  useProtectedRoute(session, isLayoutReady, firstRun, stableSetNavigationTarget, setIsNavigationResolved);

  // Effect to Handle Navigation
  useEffect(() => {
    // *** Only navigate if target is set AND layout is ready (implicitly means navigator is mounted) ***
    if (navigationTarget && isLayoutReady) {
      console.log(`[Navigation Effect] Attempting to navigate to target: ${navigationTarget}`);
      router.replace(navigationTarget as Href);
      // Setting target back to null prevents re-navigation if something else causes a re-render
      // but might interfere if the guard hook needs to run again after navigation.
      // Let's keep it null for now and see.
      // setNavigationTarget(null); // Optional: Reset target after navigation attempt
    }
  }, [navigationTarget, isLayoutReady, router]); // Depend on target and layout readiness

  // Hide splash screen ONLY when layout is ready AND navigation is resolved AND no target is set
  useEffect(() => {
    let hideTimeoutId: NodeJS.Timeout | null = null;
    if (isLayoutReady && isNavigationResolved && navigationTarget === null) {
      console.log('Conditions met to hide splash screen, scheduling hide...');
      // Delay hiding slightly to allow navigation transition to visually complete
      hideTimeoutId = setTimeout(() => {
        console.log('Hiding SplashScreen now (after slight delay).');
        SplashScreen.hideAsync();
      }, 300); // Increased delay to 300ms
    } else {
      console.log(`SplashScreen not hidden yet: LayoutReady=${isLayoutReady}, NavResolved=${isNavigationResolved}, Target=${navigationTarget}`);
    }
    // Cleanup the timeout if conditions change before it executes
    return () => {
      if (hideTimeoutId) {
        clearTimeout(hideTimeoutId);
      }
    };
    // Depend on navigationTarget as well
  }, [isLayoutReady, isNavigationResolved, navigationTarget]);

  console.log('Checking loading states:', loaded, authLoading, isNavigationResolved, 'Target:', navigationTarget);

  // Always render the Stack navigator
  console.log('Rendering main Stack navigator (always rendered)');
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProfileProvider>
      <OnboardingProvider>
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
      </OnboardingProvider>
      </ProfileProvider>
    </GestureHandlerRootView>
  );
}
