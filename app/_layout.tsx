import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments, Href } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { superwallService } from '@/services/superwall';
import { useColorScheme } from '@/hooks/useColorScheme';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { supabase } from '@/services/supabase';
import { Session } from '@supabase/supabase-js';

// Prevent the splash screen from auto-hiding.
SplashScreen.preventAutoHideAsync();

// Custom hook to manage auth state and redirection
function useProtectedRoute(
  session: Session | null, 
  isReady: boolean, 
  setIsNavigationResolved: (value: boolean) => void 
) {
  const segments = useSegments();
  const router = useRouter();
  const isNavigating = useRef(false); 
  const firstRun = useRef(true); 

  useEffect(() => {
    console.log(`[Auth Guard] Effect triggered. Session prop: ${!!session}, Ready: ${isReady}`);
    
    let resolved = false;
    const navigationTimeout = setTimeout(() => {
      isNavigating.current = false;
    }, 500); 

    if (!isReady) {
      console.log('[Auth Guard] Effect skipped: Layout not ready yet.');
      resolved = true; 
    } else {
      const inAuthGroup = segments[0] === '(auth)';
      const inOnboardingGroup = segments[0] === 'onboarding';
      // @ts-ignore - Suppress potentially incorrect linter warning about segments length
      const isAtRootIndex = segments.length === 0; 
      console.log(`[Auth Guard] Running checks. Segments: ${segments.join('/')}, InAuth: ${inAuthGroup}, InOnboarding: ${inOnboardingGroup}, IsRoot: ${isAtRootIndex}, Session: ${!!session}`);

      const navigateSafely = (target: string) => {
        if (!isNavigating.current) {
          console.log(`[Auth Guard] Attempting navigation to ${target}`);
          isNavigating.current = true; 
          router.replace(target as Href); 
        } else {
          console.log(`[Auth Guard] Navigation to ${target} skipped: Already navigating.`);
        }
        resolved = true; 
      };

      // --- Step 1: Handle No Session --- 
      if (!session) {
        if (!inAuthGroup) {
          console.log('[Auth Guard] No session and outside Auth group. Redirecting to /auth.');
          navigateSafely('/(auth)');
        } else {
          console.log('[Auth Guard] No session but already in Auth group. Staying.');
          resolved = true; 
        }
      } 
      // --- Step 2: Handle Existing Session --- 
      else { // Session exists
          console.log('[Auth Guard] Session exists. Checking onboarding...');
          (async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('onboarding_completed')
                .eq('id', session.user.id)
                .single();

              if (error && error.code !== 'PGRST116') { 
                console.error('[Auth Guard] Error fetching profile:', error);
                resolved = true; 
                return; 
              }
              const onboardingComplete = profile?.onboarding_completed ?? false;
              console.log(`[Auth Guard] Profile check complete. OnboardingComplete: ${onboardingComplete}`);

              if (!onboardingComplete) {
                if (!inOnboardingGroup) {
                   console.log(`[Auth Guard] Redirect Check: Needs Onboarding & NOT in Onboarding Group -> /onboarding`);
                   navigateSafely('/onboarding'); 
                } else {
                   console.log(`[Auth Guard] Redirect Check: Needs Onboarding & ALREADY in Onboarding Group -> Stay`);
                   resolved = true; 
                }
              } else {
                if (inAuthGroup || inOnboardingGroup || isAtRootIndex) { 
                   console.log(`[Auth Guard] Redirect Check: Onboarding Complete & in Auth/Onboarding/Root -> /(tabs)`);
                   navigateSafely('/(tabs)');
                } else {
                    console.log(`[Auth Guard] Redirect Check: Onboarding Complete & NOT in Auth/Onboarding/Root -> Stay`);
                    resolved = true; 
                }
              }
            } catch (e) {
               console.error('[Auth Guard] Exception during onboarding check:', e);
               resolved = true; 
            } finally {
              if (firstRun.current && resolved) {
                  console.log('[Auth Guard] First run resolved, calling setIsNavigationResolved.');
                  setIsNavigationResolved(true);
                  firstRun.current = false;
              }
            }
          })();
      }
    }

    // --- Cleanup --- 
    if (firstRun.current && resolved) {
        console.log('[Auth Guard] First run resolved (sync path), calling setIsNavigationResolved.');
        setIsNavigationResolved(true);
        firstRun.current = false;
    }
    return () => clearTimeout(navigationTimeout);
    
  }, [session, router, isReady, setIsNavigationResolved]);
}

export default function RootLayout() {
  console.log('RootLayout mounted - Full');
  const colorScheme = useColorScheme();
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
  const [isNavigationResolved, setIsNavigationResolved] = useState(false); // New state

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
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => { // Renamed for clarity
      console.log('Initial session fetch completed:', !!initialSession);
      setSession(initialSession);
      setAuthLoading(false); 
    }).catch(error => {
      console.error('Error fetching initial session:', error);
      setAuthLoading(false);
    });

    // Subscribe to subsequent changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => { // Renamed for clarity
        console.log('[onAuthStateChange] Event:', _event, 'New Session:', !!newSession);
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

  useEffect(() => {
    // Hide splash screen ONLY when layout is ready AND navigation is resolved
    if (isLayoutReady && isNavigationResolved) { 
      console.log('Hiding SplashScreen - Layout Ready and Navigation Resolved.');
      SplashScreen.hideAsync();
    } else {
      console.log(`SplashScreen not hidden yet: LayoutReady=${isLayoutReady}, NavResolved=${isNavigationResolved}`);
    }
  }, [isLayoutReady, isNavigationResolved]); // Depend on both

  // Auth state management and redirection hook - pass the setter
  useProtectedRoute(session, isLayoutReady, setIsNavigationResolved); 

  console.log('Checking loading states:', loaded, authLoading, isNavigationResolved);
  // Render null until BOTH layout is ready AND navigation is resolved
  if (!isLayoutReady || !isNavigationResolved) { 
    console.log('Layout or Navigation not ready, returning null (keeps splash visible)');
    return null; 
  }

  console.log('Rendering main Stack navigator');
  // The actual navigator structure. Conditional logic is handled by useProtectedRoute hook.
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OnboardingProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" /> 
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </OnboardingProvider>
    </GestureHandlerRootView>
  );
}
