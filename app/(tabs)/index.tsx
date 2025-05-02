import { StyleSheet, Platform, View, Text, Modal, Pressable, Animated, LayoutChangeEvent, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect, useRef, useCallback } from 'react';
import * as Haptics from 'expo-haptics'; // Import Haptics
import { BlurView } from 'expo-blur'; // Import BlurView
import { AppState } from 'react-native'; // Task 20.1: Import AppState
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'; // Task 24.2: Import keep-awake functions
import Svg, { Circle } from 'react-native-svg'; // Task 25.2: Import SVG components
import { ProfileContext, useProfile } from '@/contexts/ProfileContext'; // Import useProfile hook
import { LEVELS } from '@/lib/levels'; // Import level definitions (Corrected name)
import { supabase } from '@/services/supabase'; // Import supabase client
import { Profile } from '@/services/supabase'; // Ensure Profile type is imported
import { Colors } from '@/constants/Colors'; // Import Colors
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
// import { LinearGradient } from 'expo-linear-gradient'; // Reverted: Removed import

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView'; // Restore import
import CustomDurationPicker from '@/components/focus/CustomDurationPicker'; // Import Picker
import StreakModal from '@/components/StreakModal'; // Task 26.2: Import StreakModal
import LevelingSystem from '@/components/LevelingSystem'; // Task 27.2: Import LevelingSystem
import SettingsModal from '@/components/SettingsModal'; // M2.2: Import SettingsModal

// Import the new modals
import SessionSummaryModal from '@/components/modals/SessionSummaryModal';
import StreakIncreaseModal from '@/components/modals/StreakIncreaseModal';
import LevelUpModal from '@/components/modals/LevelUpModal';

// Define the structure of a level object based on usage from LevelingSystem
type Level = {
  level: number;
  xpRequired: number;
  title?: string;
};

// --- Types --- //
type FocusMode = 'easy' | 'hard';

// --- B8.1: Types for Post-Session Modals ---
type ModalType = 'summary' | 'streak' | 'level';

type PostSessionData = {
  duration: number;
  xpEarned: number; // Total XP awarded by the function
  baseXPEarned: number; // XP before hard mode bonus
  bonusXPEarned: number; // Extra XP from hard mode bonus
  wasHardMode: boolean;
  oldLevel: number;
  newLevel: number;
  levelChanged: boolean;
  oldStreak: number;
  newStreak: number;
  streakChanged: boolean;
  oldXP: number;
  currentXP: number; 
  xpRequiredForNextLevel: number | null; // Null if max level
};

// --- Vibration Setting Key ---
const VIBRATION_SETTING_KEY = '@AppSettings:vibrationEnabled';

// --- Helper Functions --- //
const formatDuration = (totalSeconds: number): string => {
  if (totalSeconds < 0) totalSeconds = 0;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
};

// --- Define placeholder components --- //
const TimerDisplay = () => {
  return (
    <View style={styles.timerCircle}>
      {/* Start button moved inside the circle */}
      <StartFocusButton />
      {/* Timer Text - MOVED below circle */}
    </View>
  );
};

const StartFocusButton = () => {
  return (
    // Use new style for icon-only button
    <TouchableOpacity style={styles.startButtonIconContainer}>
      <Ionicons name="play" size={24} color="white" />
    </TouchableOpacity>
  );
};
// ----------------------------------- //

// Task 25.6: Create Animated SVG Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// --- Constants for SVG Circle --- //
const CIRCLE_SIZE = 250;
const STROKE_WIDTH = 5;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = RADIUS * 2 * Math.PI;
const CIRCLE_CENTER = CIRCLE_SIZE / 2;
const BACKGROUND_COLOR = '#333333'; // Match old border color
const FOREGROUND_COLOR = '#FFFFFF'; // White progress

const MAX_DISPLAY_LEVEL = 20; // Define max level for display

export default function HomeScreen() {
  // --- State Variables --- //
  const [selectedDuration, setSelectedDuration] = useState<number>(25);
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);
  const [focusMode, setFocusMode] = useState<FocusMode>('easy');
  const [xpSectionHeight, setXpSectionHeight] = useState<number>(0);

  // --- Consume Profile Context using the hook --- //
  const { profile, loading, fetchProfile } = useProfile();

  // Task 14: Timer State
  const [isActive, setIsActive] = useState<boolean>(false); // Timer active?
  const [isPaused, setIsPaused] = useState<boolean>(false); // Timer paused?
  // Initialize remainingTime (in seconds) based on default selectedDuration
  const [remainingTime, setRemainingTime] = useState<number>(selectedDuration * 60);
  // B6.3: State to store duration when timer starts
  const [completedSessionDuration, setCompletedSessionDuration] = useState<number>(0);

  // Task 26.1: Streak Modal State
  const [isStreakModalVisible, setIsStreakModalVisible] = useState<boolean>(false);

  // Task 27.1: Leveling System Modal State
  const [isLevelModalVisible, setIsLevelModalVisible] = useState<boolean>(false);

  // M2.1: Settings Modal State
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false);

  // --- B8.1: State for Modal Orchestration ---
  const [postSessionInfo, setPostSessionInfo] = useState<PostSessionData | null>(null);
  const [modalQueue, setModalQueue] = useState<ModalType[]>([]);

  // Placeholder state for actual user progress (Task: Max Level Display)
  const [userLevel, setUserLevel] = useState<number>(1); // Reverted placeholder
  const [userXP, setUserXP] = useState<number>(50); // Reverted placeholder

  const [showTooltipArea, setShowTooltipArea] = useState<boolean>(false);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipOpacity = useRef(new Animated.Value(0)).current;

  // Ref to store the interval ID
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // Task 20: Ref to track if pause was due to app backgrounding
  const appStatePausedRef = useRef<boolean>(false);

  // Represents the progress of the WHITE circle (0=empty, 1=full)
  const progressAnimation = useRef(new Animated.Value(0)).current; 

  // --- Calculate derived values (using reverted field names) --- //
  const currentLevel = profile?.level ?? 1;
  const currentXP = profile?.xp ?? 0;

  // --- Calculate progress for main screen bar --- //
  const currentLevelData = LEVELS.find(l => l.level === currentLevel);
  const nextLevelInfo = LEVELS.find(l => l.level === currentLevel + 1);
  const currentLevelXP = currentLevelData?.xpRequired ?? 0;
  const nextLevelXP = nextLevelInfo?.xpRequired ?? currentXP; // If no next level, use current XP as max
  const isMaxLevel = !nextLevelInfo;

  const calculateProgressPercentage = () => {
    if (isMaxLevel) return 100;
    const xpIntoCurrentLevel = currentXP - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    if (xpNeededForLevel <= 0) return xpIntoCurrentLevel >= 0 ? 100 : 0;
    const progress = (xpIntoCurrentLevel / xpNeededForLevel) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };
  const progressPercentage = calculateProgressPercentage();

  // --- State for Vibration Setting ---
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(true); // Default true

  // --- Load Vibration Setting --- //
  useEffect(() => {
    const loadVibrationSetting = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(VIBRATION_SETTING_KEY);
        setIsVibrationEnabled(storedValue !== null ? JSON.parse(storedValue) : true);
        console.log('[Vibration] Setting loaded:', storedValue);
      } catch (e) {
        console.error('[Vibration] Failed to load setting:', e);
      }
    };
    loadVibrationSetting();
    // Load only once on mount
  }, []);

  // --- Callback Functions --- //
  const handleReset = useCallback(() => {
    if (isVibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
    setIsPaused(false);
    setRemainingTime(selectedDuration * 60);
    setCompletedSessionDuration(0); // B6.5: Reset stored duration
    console.log("Timer reset.");
  }, [selectedDuration, isVibrationEnabled]);

  // --- B7.2: Handler for Development Complete Button ---
  const handleDevCompleteSession = async () => {
    if (!isActive) {
      console.warn("[Dev Button] Pressed when timer wasn't active.");
      return;
    }

    const durationCompleted = selectedDuration; // Use the duration set for the active session
    const modeCompletedIn = focusMode; // Get the current focus mode
    const oldLevelBeforeFetch = profile?.level ?? 1; 
    const oldStreakBeforeFetch = profile?.streak ?? 0;
    const oldXPBeforeFetch = profile?.xp ?? 0; // Capture old XP

    console.log(`[Dev Button] Simulating session completion. Duration: ${durationCompleted} mins, Mode: ${modeCompletedIn}`);
    if (isVibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // Haptic feedback for dev action
    }

    try {
      console.log(`[Dev Button] Invoking award-xp function...`);
      const { data: functionData, error } = await supabase.functions.invoke('award-xp', { // Capture data here
        body: { 
          sessionDurationMinutes: durationCompleted,
          focusMode: modeCompletedIn // Pass current focus mode
        }
      });

      if (error) {
        throw error; // Throw to be caught by catch block
      }

      console.log('[Dev Button] award-xp function succeeded:', functionData);
      
      // B8.1: Fetch updated profile AFTER function success
      const updatedProfileData = await fetchProfile();
      console.log('[Dev Button] Profile refetched.');

      // B8.1: Process results AFTER profile is refetched
      const newLevel = updatedProfileData?.level ?? oldLevelBeforeFetch;
      const newStreak = updatedProfileData?.streak ?? oldStreakBeforeFetch;
      const currentXP = updatedProfileData?.xp ?? 0;
      
      // Ensure functionData exists before accessing its properties
      const levelChanged = functionData?.levelChanged ?? (newLevel > oldLevelBeforeFetch);
      const streakChanged = newStreak > oldStreakBeforeFetch; // Recalculate based on updated newStreak
      const totalXpAwarded = functionData?.xpEarned ?? 0; // Corrected field name

      // Calculate base and bonus XP based on total awarded and mode
      const wasHardMode = modeCompletedIn === 'hard';
      const bonusXPEarned = wasHardMode ? Math.floor(totalXpAwarded / 2) : 0;
      const baseXPEarned = totalXpAwarded - bonusXPEarned;

      // Calculate XP required for next level based on the *new* level
      const nextLevelDataAfterUpdate = LEVELS.find(l => l.level === newLevel + 1);
      // Ensure a valid number is passed, defaulting to currentXP if max level
      const xpRequiredForNextLevelAfterUpdate = nextLevelDataAfterUpdate?.xpRequired ?? currentXP;

      const sessionInfo: PostSessionData = {
          duration: durationCompleted,
          xpEarned: totalXpAwarded, // Keep total for potential other uses
          baseXPEarned: baseXPEarned,
          bonusXPEarned: bonusXPEarned,
          wasHardMode: modeCompletedIn === 'hard',
          oldLevel: oldLevelBeforeFetch,
          newLevel: newLevel,
          levelChanged: levelChanged,
          oldStreak: oldStreakBeforeFetch,
          newStreak: newStreak,
          streakChanged: streakChanged,
          oldXP: oldXPBeforeFetch,
          currentXP: currentXP,
          xpRequiredForNextLevel: xpRequiredForNextLevelAfterUpdate,
      };
      
      // --- Removed DEBUG Log --- //
      
      console.log('[B8.1] Dev Post Session Info:', sessionInfo);
      console.log(`[B8.1] Dev Calculated XP: total=${totalXpAwarded}, base=${baseXPEarned}, bonus=${bonusXPEarned}`); // DEBUG
      setPostSessionInfo(sessionInfo); // Store the data

      // Build modal queue
      const queue: ModalType[] = ['summary'];
      if (streakChanged) {
          queue.push('streak');
      }
      if (levelChanged) {
          queue.push('level');
      }
      console.log('[B8.1] Dev Setting Modal Queue:', queue);
      setModalQueue(queue);

    } catch (error: any) {
      console.error('[Dev Button] Error invoking award-xp function:', error);
      Alert.alert('Dev Error', `Failed to award XP: ${error.message}`);
      if (isVibrationEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

    } finally {
      // Reset the timer UI regardless of success/failure
      console.log('[Dev Button] Resetting timer UI.');
      handleReset(); // Use existing reset logic
    }
  };

  // --- B8.5: Modal Queue Processing ---
  const processNextModal = () => {
    setModalQueue(prev => {
        const nextQueue = prev.slice(1);
        console.log('[B8.5] Advancing modal queue. Next queue:', nextQueue);
        // If queue becomes empty, clear the session info
        if (nextQueue.length === 0) { 
            setPostSessionInfo(null);
            console.log('[B8.5] Modal queue empty, clearing post session info.');
        }
        return nextQueue;
    }); 
  };

  // Handler for Summary Modal "Start New" button
  const handleStartNewFromSummary = () => {
      // Reset timer immediately (using existing handleReset which sets isActive=false etc.)
      handleReset(); 
      // Clear the modal queue completely and reset info
      setModalQueue([]); 
      setPostSessionInfo(null);
      console.log('[B8.5] Start New pressed, resetting timer and clearing modal queue.');
      // Optional: Auto-select default duration?
      // setSelectedDuration(25); 
  };

  // Handler for Summary Modal "View Progress" button
  const handleViewProgressFromSummary = () => {
      // Clear the modal queue first
      setModalQueue([]);
      setPostSessionInfo(null);
      // Then show the existing LevelingSystem modal
      setIsLevelModalVisible(true); 
      console.log('[B8.5] View Progress pressed, clearing queue and showing LevelingSystem modal.');
  };

  // --- Effect to sync remainingTime with selectedDuration when timer is NOT active --- //
  useEffect(() => {
    if (!isActive) {
      setRemainingTime(selectedDuration * 60);
      // Also ensure animation reflects the potential new duration when inactive (shows empty circle)
      progressAnimation.setValue(0); 
    }
    // No cleanup needed, depends on duration changes or timer becoming inactive
  }, [selectedDuration, isActive, progressAnimation]); 

  // --- Timer Logic --- //
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        // Use a variable to track if completion logic is running
        let completionRunning = false; 

        setRemainingTime((prevTime) => {
          // Prevent completion logic from running multiple times if interval fires again quickly
          if (completionRunning) return prevTime; 

          if (prevTime <= 1) {
            completionRunning = true; // Mark as running
            clearInterval(intervalRef.current!); 
            intervalRef.current = null; // Clear ref immediately
            
            const durationCompleted = completedSessionDuration; // Use the stored duration
            const modeCompletedIn = focusMode; // Use the current focus mode
            const oldLevelBeforeFetch = profile?.level ?? 1; 
            const oldStreakBeforeFetch = profile?.streak ?? 0;
            const oldXPBeforeFetch = profile?.xp ?? 0; // Capture old XP

            console.log(`Timer finished! Duration: ${durationCompleted} mins, Mode: ${modeCompletedIn}.`);

            // B6.6: Call Edge Function if duration is valid
            if (durationCompleted > 0) {
              // const previousLevel = profile?.level; // No longer needed here, captured above
              console.log(`[award-xp] Invoking function with duration: ${durationCompleted}, mode: ${modeCompletedIn}`);
              supabase.functions.invoke('award-xp', {
                body: { 
                  sessionDurationMinutes: durationCompleted,
                  focusMode: modeCompletedIn // B6.4: Pass focusMode
                }
              })
              .then(async (result: any) => { // Make the success handler async
                // B6.7: Handle success
                if (result.error) {
                  throw result.error; // Propagate error to catch block
                }
                const functionData = result.data;
                console.log('Session completed, function result:', functionData);

                // B8.1: Fetch updated profile AFTER function success
                const updatedProfileDataAfterTimer = await fetchProfile();
                console.log('[Timer] Profile refetched.');

                // B8.1: Process results AFTER profile is refetched
                const newLevel = updatedProfileDataAfterTimer?.level ?? oldLevelBeforeFetch;
                const newStreak = updatedProfileDataAfterTimer?.streak ?? oldStreakBeforeFetch;
                const currentXP = updatedProfileDataAfterTimer?.xp ?? 0;
                
                // Ensure functionData exists before accessing its properties
                const levelChanged = functionData?.levelChanged ?? (newLevel > oldLevelBeforeFetch);
                const streakChanged = newStreak > oldStreakBeforeFetch; // Recalculate based on updated newStreak
                const totalXpAwarded = functionData?.xpEarned ?? 0; // Corrected field name

                // Calculate base and bonus XP based on total awarded and mode
                const wasHardMode = modeCompletedIn === 'hard';
                const bonusXPEarned = wasHardMode ? Math.floor(totalXpAwarded / 2) : 0;
                const baseXPEarned = totalXpAwarded - bonusXPEarned;

                // Calculate XP required for next level based on the *new* level
                const nextLevelDataAfterUpdate = LEVELS.find(l => l.level === newLevel + 1);
                // Ensure a valid number is passed, defaulting to currentXP if max level
                const xpRequiredForNextLevelAfterUpdate = nextLevelDataAfterUpdate?.xpRequired ?? currentXP;

                const sessionInfo: PostSessionData = {
                    duration: durationCompleted,
                    xpEarned: totalXpAwarded, // Keep total for potential other uses
                    baseXPEarned: baseXPEarned,
                    bonusXPEarned: bonusXPEarned,
                    wasHardMode: modeCompletedIn === 'hard',
                    oldLevel: oldLevelBeforeFetch,
                    newLevel: newLevel,
                    levelChanged: levelChanged,
                    oldStreak: oldStreakBeforeFetch,
                    newStreak: newStreak,
                    streakChanged: streakChanged,
                    oldXP: oldXPBeforeFetch,
                    currentXP: currentXP,
                    xpRequiredForNextLevel: xpRequiredForNextLevelAfterUpdate,
                };
                
                // --- Removed DEBUG Log --- //
                
                console.log('[B8.1] Post Session Info:', sessionInfo);
                console.log(`[B8.1] Timer Calculated XP: total=${totalXpAwarded}, base=${baseXPEarned}, bonus=${bonusXPEarned}`); // DEBUG
                setPostSessionInfo(sessionInfo); // Store the data

                // Build modal queue
                const queue: ModalType[] = ['summary'];
                if (streakChanged) {
                    queue.push('streak');
                }
                if (levelChanged) {
                    queue.push('level');
                }
                console.log('[B8.1] Setting Modal Queue:', queue);
                setModalQueue(queue);

                // Remove the old Alert - modals will handle this
                // if (oldLevelBeforeFetch && newLevel && newLevel > oldLevelBeforeFetch) {
                //     Alert.alert('Level Up!', `Congratulations! You reached level ${newLevel}!`);
                // }
                if (isVibrationEnabled) {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }

              })
              // Removed the second .then() block as logic moved into the first one
              .catch((error: any) => {
                // B6.7: Handle failure
                console.error('Error awarding XP or processing result:', error);
                Alert.alert('Error', 'Could not save session progress. Please try again later.');
                if (isVibrationEnabled) {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                }
              })
              .finally(() => {
                // B6.7: Reset UI state regardless of success/failure
                console.log('Resetting timer UI after function call.');
                setIsActive(false);
                setRemainingTime(selectedDuration * 60); // Reset to initial duration for next run
                setCompletedSessionDuration(0); // Clear the completed duration
                completionRunning = false; // Allow completion logic again
              });
            } else {
              // If duration was 0, just reset UI immediately
              console.log('Timer finished with 0 duration, resetting UI.');
              setIsActive(false);
              setRemainingTime(selectedDuration * 60);
              setCompletedSessionDuration(0);
              completionRunning = false; 
            }

            // Return the reset duration, though UI update is handled in finally()
            return selectedDuration * 60; 
          }
          // Normal decrement
          return prevTime - 1; 
        });
      }, 1000);
    } else {
      // Clear interval if timer becomes inactive or paused
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    // Cleanup function for the effect itself
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // Dependencies: Include profile for level up check, fetchProfile, completedSessionDuration, focusMode
  }, [isActive, isPaused, selectedDuration, supabase, fetchProfile, completedSessionDuration, profile, focusMode]); 

  // --- Animation Effect for Progress Circle --- //
  useEffect(() => {
    let targetProgress = 0; // Default to 0 (grey track) when inactive
    if (isActive) {
      const totalDurationSeconds = selectedDuration * 60;
      const currentProgress = totalDurationSeconds > 0 ? remainingTime / totalDurationSeconds : 0;
      targetProgress = Math.max(0, Math.min(1, currentProgress)); 
    }
    
    // Animate the progress value
    Animated.timing(progressAnimation, {
      toValue: targetProgress, 
      duration: 300, 
      useNativeDriver: false, 
    }).start();

  }, [isActive, remainingTime, selectedDuration, progressAnimation]);

  // --- Confirmation Dialog for Reset --- //
  const handleConfirmReset = () => {
    Alert.alert(
      "Cancel Session?", // Title
      "Are you sure you want to stop this focus session?", // Message
      [
        {
          text: "Keep Focusing", // Button text
          onPress: () => console.log("Reset cancelled"), // Action (optional logging)
          style: "cancel" // Style for cancel button (iOS)
        },
        {
          text: "Cancel Session",
          onPress: handleReset, // Call the original reset handler
          style: "destructive" // Style for destructive action (iOS)
        }
      ],
      { cancelable: true } // Allows dismissing by tapping outside on Android
    );
  };

  // Task 26.7: Close handler for Streak Modal
  const handleCloseStreakModal = () => {
    setIsStreakModalVisible(false);
  };

  // Task 27.7: Close handler for Leveling System Modal
  const handleCloseLevelModal = () => {
    setIsLevelModalVisible(false);
  };

  // --- Task 24: Keep Screen Awake While Timer Active --- //
  useEffect(() => {
    let isActivated = false; // Track if we successfully activated
    if (isActive) {
      const activate = async () => {
        try {
          await activateKeepAwakeAsync();
          isActivated = true;
          console.log('Screen keep-awake activated.');
        } catch (error) {
          console.error('Failed to activate screen keep-awake:', error);
        }
      };
      activate();
    } else {
      // Ensure deactivation if timer becomes inactive
      deactivateKeepAwake();
      isActivated = false; // Reset flag
      console.log('Screen keep-awake deactivated (timer inactive).');
    }

    // Cleanup function: deactivate if it was activated
    return () => {
      if (isActivated) {
        deactivateKeepAwake();
        console.log('Screen keep-awake deactivated (component unmount/cleanup).');
      }
    };
  }, [isActive]); // Depend only on isActive

  // --- Task 20 & 23: App State Handling (Mode-Specific) --- //
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // Handle app going to background or becoming inactive
      if (nextAppState.match(/inactive|background/) && isActive) {
        if (focusMode === 'hard') {
          // Hard Mode: Cancel the session immediately
          console.log("App backgrounded in Hard Mode, cancelling session.");
          handleReset(); // Call the reset function
        } else {
          // Easy Mode: Pause the timer only if it wasn't already manually paused
          if (!isPaused) {
            setIsPaused(true);
            appStatePausedRef.current = true; // Mark pause as due to app state
            console.log("App backgrounded in Easy Mode, timer paused.");
          } else {
            console.log("App backgrounded in Easy Mode, timer was already paused.");
          }
        }
      }
      // Handle app returning to foreground
      else if (nextAppState === 'active') {
        if (isActive && appStatePausedRef.current) { 
          // Only resume if timer is active and was paused *by the app state change*
          setIsPaused(false);
          appStatePausedRef.current = false; // Reset the flag
          console.log("App foregrounded in Easy Mode, timer resumed.");
        } else if (appStatePausedRef.current) {
          // If the timer became inactive while backgrounded (e.g., hard mode reset),
          // still clear the flag.
          appStatePausedRef.current = false;
          console.log("App foregrounded, clearing background pause flag.");
        }
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.remove();
    };
  }, [isActive, isPaused, focusMode, handleReset]); // Add focusMode and handleReset to dependency array

  // --- Event Handlers --- // 

  // Task 16: Handle Start/Pause/Resume (Revised for Mode)
  const handleStartPauseResume = () => {
    // Haptics can be triggered once if any action is taken
    let hapticTriggered = false;

    if (!isActive) {
      // Start (Applies to both modes)
      if (selectedDuration <= 0) { // Check selectedDuration, not remainingTime
        Alert.alert("Select Duration", "Please select a focus duration first.");
        return;
      }
      if (isVibrationEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Haptic on start
        hapticTriggered = true;
      }
      setCompletedSessionDuration(selectedDuration); // B6.4: Store duration
      // Ensure remainingTime is correctly set based on stored duration before starting
      setRemainingTime(selectedDuration * 60);
      setIsActive(true);
      setIsPaused(false); 
      console.log(`Timer started for ${selectedDuration} minutes.`);
    } else { // Timer is Active
        if (focusMode === 'easy') { // Only Easy mode allows pause/resume
            if (!isPaused) {
                // --- Pause Logic ---
                if (isVibrationEnabled && !hapticTriggered) { 
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); 
                }
                setIsPaused(true);
                console.log("Timer paused.");
            } else {
                // --- Resume Logic ---
                if (isVibrationEnabled && !hapticTriggered) { 
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); 
                }
                setIsPaused(false);
                console.log("Timer resumed.");
            }
        } 
        // If Hard Mode and active, button does nothing, so no haptic/state change
    }
  };

  // Task 17: Handle Reset/Cancel - MOVED UP
  // const handleReset = () => { ... };

  const handlePresetSelect = (duration: number) => {
    if (isVibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Add haptic feedback
    }
    setSelectedDuration(duration);
  };

  // Task 9.7: Define handler for picker selection
  const handleDurationSelect = (duration: number) => {
    setSelectedDuration(duration);
    setIsPickerVisible(false); // Close modal on selection
  };

  // Task 12.1: Handler for mode select
  const handleModeSelect = (mode: FocusMode) => {
    if (isVibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Add haptic feedback
    }
    setFocusMode(mode);

    // Always clear existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    // Immediately start fade-out if changing mode
    Animated.timing(tooltipOpacity, {
      toValue: 0,
      duration: 300, // Fast fade out
      useNativeDriver: true,
    }).start(() => {
        // Reset the 'presence' state only after fade-out completes if we changed *from* hard mode
        if (mode !== 'hard') {
            setShowTooltipArea(false);
        }
    }); 

    if (mode === 'hard') {
      setShowTooltipArea(true); // Mark that tooltip area should be active
      // Start fade-in animation
      Animated.timing(tooltipOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Set timeout to start fade-out later
      tooltipTimeoutRef.current = setTimeout(() => {
        Animated.timing(tooltipOpacity, {
          toValue: 0,
          duration: 500, // Slower fade out
          useNativeDriver: true,
        }).start(() => {
            setShowTooltipArea(false); // Reset presence state after fade out
        });
        tooltipTimeoutRef.current = null;
      }, 4500); // Start fade out slightly before 5s total
    }
  };

  const handleOpenPicker = () => {
    if (isVibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Add haptic feedback
    }
    setIsPickerVisible(true);
  }

  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  const handleXpSectionLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setXpSectionHeight(height);
  };

  // --- Render Functions --- //
  const renderHeader = () => (
    <View style={styles.topBar}>
      {/* Left: Level Indicator - REMOVED */}
      {/* <Pressable style={styles.levelContainer} onPress={() => setIsLevelModalVisible(true)}>
        <Ionicons name="ribbon" size={20} color="#FFD700" />
        <ThemedText style={styles.levelText}>{loading ? '...' : profile?.level ?? '-'}</ThemedText>
      </Pressable> */}

      {/* Right: Streak Indicator - Conditionally rendered */}
      {isActive ? (
        <View style={{ height: 24 }} /> // Placeholder height
      ) : (
        <Pressable onPress={() => setIsStreakModalVisible(true)} style={styles.streakContainer}>
          <Ionicons name="flash" size={20} color="#FFD700" />
          <ThemedText style={styles.streakText}>{loading ? '...' : profile?.streak ?? '-'}</ThemedText>
        </Pressable>
      )}
      {/* Spacer */}
      <View style={{ flex: 1 }} /> 
      {/* Settings Icon */}
      <TouchableOpacity onPress={() => setIsSettingsModalVisible(true)} style={styles.settingsIcon} disabled={isActive}>
        <MaterialCommunityIcons 
          name="cog"
          size={24} 
          color={isActive ? 'transparent' : Colors.dark.icon} 
        />
      </TouchableOpacity>
    </View>
  );

  // --- Main Return --- //
  return (
    <View style={styles.container}>
      {/* Render Header - Call the function */} 
      {renderHeader()}

      {/* XP Section with exact height matching */}
      {isActive ? (
        <View style={{ height: xpSectionHeight, marginBottom: 16 }} /> // Add marginBottom to match
      ) : (
        <Pressable onPress={() => setIsLevelModalVisible(true)}>
          <View 
            style={styles.xpSectionContainer}
            onLayout={handleXpSectionLayout}
          >
            <View style={styles.xpContainer}>
              {/* XP Bar structure */}
              <View style={styles.xpLevelHeader}>
                <ThemedText style={styles.xpCurrentLevelText}>LVL {loading ? '...' : profile?.level ?? '-'}</ThemedText>
                <ThemedText style={[
                    styles.xpNextLevelText,
                    // Calculate isUserMaxLevel inline
                    !(LEVELS.find(l => l.level === currentLevel + 1)) && styles.maxLevelText 
                  ]}>
                    {/* Calculate isUserMaxLevel inline */} 
                    {!(LEVELS.find(l => l.level === currentLevel + 1)) ? 'MAX' : `LVL ${currentLevel + 1}`}
                </ThemedText>
              </View>
              <View style={styles.xpProgressContainer}>
                <View style={styles.xpProgressBar}>
                  <View
                    // Use calculated progress percentage for width
                    style={[styles.xpProgress, { width: `${progressPercentage}%` }]} 
                  />
                </View>
                <View style={styles.xpInfoContainer}>
                  <ThemedText style={styles.xpRemaining}>
                    {/* Calculate isUserMaxLevel and xpForNextLevel inline */} 
                    {!(LEVELS.find(l => l.level === currentLevel + 1)) 
                      ? `${currentXP.toLocaleString()} / ${currentXP.toLocaleString()} XP`
                      : `${currentXP.toLocaleString()} / ${(LEVELS.find(l => l.level === currentLevel + 1)?.xpRequired ?? currentXP).toLocaleString()} XP`}
                  </ThemedText>
                  <Ionicons name="chevron-forward-outline" size={16} color="#8e8e93" />
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      )}

      {/* Center Timer Section */}
      <View style={styles.centerContent}>
        <View style={styles.timerDisplayGroup}>
          {/* Task 25.6: SVG Implementation */}
          {/* Applying width/height inline, borderRadius from styles */}
          <View style={[styles.timerCircle, { width: CIRCLE_SIZE, height: CIRCLE_SIZE }]}>
            <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}>
              {/* Static Grey Background Circle */}
              <Circle
                cx={CIRCLE_CENTER}
                cy={CIRCLE_CENTER}
                r={RADIUS}
                stroke={BACKGROUND_COLOR} // Grey
                strokeWidth={STROKE_WIDTH}
                fill="transparent"
              />
              {/* Animated White Foreground Circle (Appears/Disappears Counter-Clockwise) */}
              <AnimatedCircle
                cx={CIRCLE_CENTER}
                cy={CIRCLE_CENTER}
                r={RADIUS}
                stroke={FOREGROUND_COLOR} // White
                strokeWidth={STROKE_WIDTH}
                fill="transparent"
                strokeDasharray={CIRCUMFERENCE} 
                strokeDashoffset={progressAnimation.interpolate({
                  inputRange: [0, 1],
                  // progress=0 -> offset=CIRCUMFERENCE (white invisible)
                  // progress=1 -> offset=0 (white full)
                  outputRange: [CIRCUMFERENCE, 0], // Back to original range
                  extrapolate: 'clamp',
                })}
                transform={`rotate(-90 ${CIRCLE_CENTER} ${CIRCLE_CENTER})`}
              />
            </Svg>
            {/* Timer Text - Rendered on top */}
            <View style={styles.timerTextContainer}>
              <Text style={styles.timerText}>
                {formatDuration(remainingTime)}
              </Text>
            </View>
          </View>
        </View> 
        {/* End of timerDisplayGroup */}

        {/* Task 27: New Button Area */}
        <View style={styles.buttonArea}>
          {/* Conditionally render Start/Pause/Resume Button */}
          {(!isActive || focusMode === 'easy') && (
            <TouchableOpacity
              style={styles.mainActionButton} // Use a new style
              onPress={handleStartPauseResume}
              disabled={isActive && focusMode === 'hard'} // Already handled by outer condition, but good practice
            >
              {/* Container for Icon and Text */}
              <View style={styles.mainActionButtonContent}>
                {/* Icon removed */}
                <ThemedText style={styles.mainActionButtonText}>
                  {!isActive ? 'Start' : isPaused ? 'Resume' : 'Pause'}
                </ThemedText>
              </View>
            </TouchableOpacity>
          )}

          {/* Conditionally render Reset Button OR Placeholder */}
          {isActive ? (
            <TouchableOpacity
              onPress={handleConfirmReset}
              style={styles.resetButtonContainer}
            >
              <Ionicons name="close" size={24} color="#8e8e93" />
            </TouchableOpacity>
          ) : (
            // Placeholder to maintain layout when timer is inactive
            <View style={[styles.resetButtonContainer, { opacity: 0 }]} pointerEvents="none">
              {/* Content doesn't matter, just needs same dimensions */}
              <Ionicons name="close" size={24} color="transparent" />
            </View>
          )}
        </View>

        {/* Group the controls - Conditionally Render based on isActive */}
        {!isActive && (
          <View style={styles.controlsGroup}>
            {/* Duration Buttons */}
            <View style={styles.durationContainer}>
              {/* Preset Buttons */}
              <TouchableOpacity
                style={[styles.controlButton, selectedDuration === 25 && styles.controlButtonSelected]}
                onPress={() => handlePresetSelect(25)}
              >
                <Text style={[styles.controlButtonText, selectedDuration === 25 && styles.controlButtonSelectedText]}>
                  25m
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlButton, selectedDuration === 50 && styles.controlButtonSelected]}
                onPress={() => handlePresetSelect(50)}
              >
                <Text style={[styles.controlButtonText, selectedDuration === 50 && styles.controlButtonSelectedText]}>
                  50m
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlButton, selectedDuration === 90 && styles.controlButtonSelected]}
                onPress={() => handlePresetSelect(90)}
              >
                <Text style={[styles.controlButtonText, selectedDuration === 90 && styles.controlButtonSelectedText]}>
                  90m
                </Text>
              </TouchableOpacity>
              {/* + Button */}
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleOpenPicker}
              >
                <Text style={[styles.controlButtonText, { fontSize: 20, lineHeight: 20 }]}>+</Text>
              </TouchableOpacity>
            </View>
            {/* Mode Buttons */}
            <View style={styles.modeContainer}>
              <TouchableOpacity
                style={[styles.controlButton, focusMode === 'easy' && styles.controlButtonSelected]}
                onPress={() => handleModeSelect('easy')}
              >
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={16}
                  color={focusMode === 'easy' ? "#34C759" : "#8e8e93"}
                  style={styles.modeIcon}
                />
                <Text style={[styles.controlButtonText, focusMode === 'easy' && styles.controlButtonSelectedModeText]}>
                  Easy Mode
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlButton, focusMode === 'hard' && styles.controlButtonSelected]}
                onPress={() => handleModeSelect('hard')}
              >
                <MaterialCommunityIcons
                  name="shield-outline"
                  size={16}
                  color={focusMode === 'hard' ? "#FF3B30" : "#8e8e93"}
                  style={styles.modeIcon}
                />
                <Text style={[styles.controlButtonText, focusMode === 'hard' && styles.controlButtonSelectedHardModeText]}>
                  Hard Mode
                </Text>
              </TouchableOpacity>
            </View>
            {/* Tooltip Area */}
            <View style={styles.tooltipContainer}>
              <Animated.View style={{ opacity: tooltipOpacity }}>
                <Text style={styles.hardModeTooltip}>
                  2XP for completion, canceling session loses progress
                </Text>
              </Animated.View>
            </View>
          </View>
        )}

      </View> // End of centerContent

      {/* Modal for Custom Duration Picker */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isPickerVisible}
        onRequestClose={() => { // Handle hardware back button on Android
          setIsPickerVisible(false);
        }}
      >
        {/* Replace Pressable background with BlurView + Pressable */}
        <BlurView intensity={50} tint="dark" style={styles.modalBackdrop}>
            <Pressable 
              style={styles.modalPressableArea} // Use a style that fills the area for pressing
              onPress={() => setIsPickerVisible(false)} // Close on backdrop press
            >
                {/* Prevent closing modal when clicking inside picker area */}
                <Pressable onPress={(e) => e.stopPropagation()}>
                    <View style={styles.modalContentContainer}>
                        <CustomDurationPicker 
                        onSelectDuration={handleDurationSelect}
                        onClose={() => setIsPickerVisible(false)}
                        initialDuration={0}
                        />
                    </View>
                </Pressable>
            </Pressable>
        </BlurView>
      </Modal>

      {/* App State Tooltip - Appears only when timer is active */}
      {isActive && (
        <View style={styles.appStateTooltipContainer}>
          <Text style={styles.appStateTooltipText}>
            {focusMode === 'hard' 
              ? "Closing the app will cancel the session and lose progress."
              : "Timer will pause if you leave the app."
            }
          </Text>
        </View>
      )}

      {/* Task 26.5: Streak Modal */}
      <Modal
        visible={isStreakModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseStreakModal} // Use the new handler
      >
        {/* Task 26.6: Render StreakModal Component Here */}
        <StreakModal 
          onClose={handleCloseStreakModal} // Pass the close handler
          currentStreak={profile?.streak ?? 0} // Use actual data
          longestStreak={profile?.longest_streak ?? 0} // Use actual data
          nextMilestone={7} // Placeholder - TODO: Calculate actual next milestone
        />
      </Modal>

      {/* Task 27.5: Leveling System Modal */}
      <Modal
        visible={isLevelModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseLevelModal} // Use the new handler
      >
        {/* Task 27.6: Render LevelingSystem Component Here */}
        <LevelingSystem 
          onClose={handleCloseLevelModal} // Pass the close handler
          currentLevel={currentLevel}
          currentXP={currentXP}
          xpForNextLevel={nextLevelXP}
        />
      </Modal>

      {/* M2.5: Render Settings Modal */}
      <SettingsModal 
        isVisible={isSettingsModalVisible}
        onClose={() => setIsSettingsModalVisible(false)}
      />

      {/* --- B8.5: Post-Session Modals --- */}
      {postSessionInfo && (
        <>
          <SessionSummaryModal
            isVisible={modalQueue[0] === 'summary'}
            onClose={processNextModal} // Advance queue
            onStartNew={handleStartNewFromSummary} // Fix linter error
            onViewProgress={handleViewProgressFromSummary} // Fix linter error
            sessionInfo={postSessionInfo}
          />
          <StreakIncreaseModal
            isVisible={modalQueue[0] === 'streak'}
            onClose={processNextModal} // Advance queue
            oldStreak={postSessionInfo.oldStreak}
            newStreak={postSessionInfo.newStreak}
          />
          <LevelUpModal
            isVisible={modalQueue[0] === 'level'}
            onClose={processNextModal} // Advance queue (ends sequence)
            oldLevel={postSessionInfo.oldLevel}
            newLevel={postSessionInfo.newLevel}
            newLevelTitle={LEVELS.find(l => l.level === postSessionInfo.newLevel)?.title}
          />
        </>
      )}

      {/* Conditional Development Button */}
      {__DEV__ && isActive && (
        <Pressable
          style={styles.devCompleteButton}
          onPress={handleDevCompleteSession} // Use the new handler
        >
          <Ionicons name="bug-outline" size={18} color="rgba(255, 255, 255, 0.6)" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingHorizontal: 16,
    backgroundColor: '#111111', 
    position: 'relative', // Keep for absolute positioning
  },
  topBar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'ChakraPetch-SemiBold',
  },
  centerContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  controlsGroup: {
    alignItems: 'center',
    width: '90%',
    marginTop: 15,
  },
  timerCircle: {
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  timerText: {
    fontSize: 30,
    color: '#FFFFFF',
    fontFamily: 'ChakraPetch-SemiBold',
    fontWeight: '600',
    pointerEvents: 'none',
  },
  modeText: {
    fontSize: 18,
    color: '#34C759',
    fontWeight: '600',
  },
  bottomControls: {
    justifyContent: 'center',
    height: 60,
    textAlign: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: '#141414',
    borderRadius: 12,
    padding: 5,
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    backgroundColor: '#141414',
    borderRadius: 12,
    padding: 5,
  },
  controlButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  controlButtonText: {
    color: '#8e8e93',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  controlButtonSelected: {
    backgroundColor: 'rgba(44, 44, 46, 0.8)',
  },
  controlButtonSelectedText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  controlButtonSelectedModeText: {
    color: '#34C759',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  controlButtonSelectedHardModeText: {
    color: '#FF3B30', 
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  modeIcon: {
  },
  xpSectionContainer: {
    backgroundColor: '#141414',
    borderRadius: 12,
    marginBottom: 16,
  },
  xpContainer: {
    gap: 4,
    padding: 12,
  },
  xpLevelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  xpCurrentLevelText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'ChakraPetch-SemiBold',
    fontWeight: '500',
  },
  xpNextLevelText: {
    fontSize: 14,
    color: '#8e8e93',
    fontFamily: 'ChakraPetch-SemiBold',
    fontWeight: '500',
  },
  xpProgressContainer: {
    gap: 4,
  },
  xpProgressBar: {
    height: 6,
    backgroundColor: '#333333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  xpInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpRemaining: {
    fontSize: 12,
    color: '#8e8e93',
    fontFamily: 'ChakraPetch-SemiBold',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalPressableArea: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalContentContainer: {
  },
  tooltipContainer: {
    height: 30,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hardModeTooltip: {
    fontSize: 12,
    color: '#8e8e93',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  resetButtonContainer: {
    padding: 10,
  },
  buttonArea: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    minHeight: 60,
    width: '100%',
    gap: 20,
  },
  mainActionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainActionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mainActionButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'ChakraPetch-SemiBold',
    textTransform: 'uppercase',
  },
  timerDisplayGroup: {
    alignItems: 'center',
    marginTop: 50,
  },
  startButtonIconContainer: {
    padding: 12,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appStateTooltipContainer: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    alignItems: 'center',
    paddingVertical: 5,
  },
  appStateTooltipText: {
    fontSize: 12,
    color: '#8e8e93',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  timerTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none', 
  },
  maxLevelText: {
    color: '#34C759',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'ChakraPetch-SemiBold',
  },
  devCompleteButton: {
    position: 'absolute',
    bottom: 20, // Adjusted position slightly
    right: 20,
    backgroundColor: 'rgba(50, 50, 50, 0.7)', // Darker background
    width: 36, // Make it small and square
    height: 36,
    borderRadius: 18, // Make it circular
    alignItems: 'center', // Center icon horizontally
    justifyContent: 'center', // Center icon vertically
    zIndex: 10,
  },
  settingsIcon: {
    padding: 10,
  },
});
