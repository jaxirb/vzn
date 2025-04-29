import { StyleSheet, Platform, View, Text, Modal, Pressable, Animated, LayoutChangeEvent, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect, useRef, useCallback } from 'react';
import * as Haptics from 'expo-haptics'; // Import Haptics
import { BlurView } from 'expo-blur'; // Import BlurView
import { AppState } from 'react-native'; // Task 20.1: Import AppState
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'; // Task 24.2: Import keep-awake functions
// import { LinearGradient } from 'expo-linear-gradient'; // Reverted: Removed import

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView'; // Reverted: Uncommented import
import CustomDurationPicker from '@/components/focus/CustomDurationPicker'; // Import Picker

// --- Types --- //
type FocusMode = 'easy' | 'hard';

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

export default function HomeScreen() {
  const [selectedDuration, setSelectedDuration] = useState<number>(25);
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);
  const [focusMode, setFocusMode] = useState<FocusMode>('easy');
  const [xpSectionHeight, setXpSectionHeight] = useState<number>(0);

  // Task 14: Timer State
  const [isActive, setIsActive] = useState<boolean>(false); // Timer active?
  const [isPaused, setIsPaused] = useState<boolean>(false); // Timer paused?
  // Initialize remainingTime (in seconds) based on default selectedDuration
  const [remainingTime, setRemainingTime] = useState<number>(selectedDuration * 60);

  const [showTooltipArea, setShowTooltipArea] = useState<boolean>(false);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipOpacity = useRef(new Animated.Value(0)).current;

  // Ref to store the interval ID
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // Task 20: Ref to track if pause was due to app backgrounding
  const appStatePausedRef = useRef<boolean>(false);

  // --- Timer Logic --- //
  useEffect(() => {
    if (isActive && !isPaused) {
      // Start the timer
      intervalRef.current = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            // Timer finished (Task 18 logic will go here)
            clearInterval(intervalRef.current!); // Clear interval immediately
            setIsActive(false);
            // TODO: Handle completion: show summary, play sound, etc.
            console.log("Timer finished!");
            return selectedDuration * 60; // Reset for now, or handle differently
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      // Clear the interval if timer is not active or is paused
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup function to clear interval when component unmounts or dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused]); // Removed selectedDuration from here, handled below

  // Effect to sync remainingTime with selectedDuration when timer is NOT active
  useEffect(() => {
    if (!isActive) {
      setRemainingTime(selectedDuration * 60);
    }
    // No cleanup needed for this effect
  }, [selectedDuration, isActive]); // Run when duration changes OR when timer becomes inactive

  // Task 17: Handle Reset/Cancel
  const handleReset = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Haptic feedback
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }
    setIsActive(false);
    setIsPaused(false);
    // Reset remaining time to the currently selected duration
    setRemainingTime(selectedDuration * 60);
    console.log("Timer reset.");
    // TODO: Handle XP calculation for cancelled session later
  }, [selectedDuration]); // Add selectedDuration as dependency

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
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!isActive) {
      // Start (Applies to both modes)
      if (remainingTime <= 0) {
        console.warn("Cannot start timer with 0 duration.");
        return;
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Haptic on start
      setIsActive(true);
      setIsPaused(false); 
      console.log(`Timer started with ${remainingTime} seconds.`);
    } else if (focusMode === 'easy') {
      // Pause or Resume (Easy Mode Only)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Haptic on pause/resume
      setIsPaused(!isPaused);
      console.log(isPaused ? "Timer resumed." : "Timer paused.");
    }
    // In hard mode, pressing the button while active does nothing
  };

  // Task 17: Handle Reset/Cancel - MOVED UP
  // const handleReset = () => { ... };

  const handlePresetSelect = (duration: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Add haptic feedback
    setSelectedDuration(duration);
  };

  // Task 9.7: Define handler for picker selection
  const handleDurationSelect = (duration: number) => {
    setSelectedDuration(duration);
    setIsPickerVisible(false); // Close modal on selection
  };

  // Task 12.1: Handler for mode select
  const handleModeSelect = (mode: FocusMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Add haptic feedback
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Add haptic feedback
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

  return (
    <ThemedView style={styles.container}>
      <View style={styles.topBar}>
        {/* Task 21 (Fifth Rev): Conditional Render w/ Placeholder */}
        {isActive ? (
          <View style={{ height: 24 }} /> // Placeholder height
        ) : (
          <View style={styles.streakContainer}>
            <Ionicons name="flash" size={20} color="#FFD700" />
            <ThemedText style={styles.streakText}>3</ThemedText>
          </View>
        )}
        {/* Spacer */}
        <View style={{ flex: 1 }} /> 
        {/* Settings Icon */}
        <MaterialCommunityIcons name="cog" size={20} color="white" />
      </View>

      {/* XP Section with exact height matching */}
      {isActive ? (
        <View style={{ height: xpSectionHeight, marginBottom: 16 }} /> // Add marginBottom to match
      ) : (
        <View 
          style={styles.xpSectionContainer}
          onLayout={handleXpSectionLayout}
        >
          <View style={styles.xpContainer}>
            {/* XP Bar structure */}
            <View style={styles.xpLevelHeader}>
              <ThemedText style={styles.xpCurrentLevelText}>LVL 1</ThemedText>
              <ThemedText style={styles.xpNextLevelText}>LVL 2</ThemedText>
            </View>
            <View style={styles.xpProgressContainer}>
              <View style={styles.xpProgressBar}>
                <View
                  style={[styles.xpProgress, { width: '30%' }]}
                />
              </View>
              <View style={styles.xpInfoContainer}>
                <ThemedText style={styles.xpRemaining}>50 / 150 XP</ThemedText>
                <Ionicons name="chevron-forward-outline" size={16} color="#8e8e93" />
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Center Timer Section */}
      <View style={styles.centerContent}>
        {/* Task 21 (TwentySecond Rev): Group Timer Display Elements */}
        <View style={styles.timerDisplayGroup}>
          {/* Timer Circle - Now contains the Timer Text */}
          <View style={styles.timerCircle}>
            {/* Timer Text - Moved inside */}
            <Text style={styles.timerText}>
              {formatDuration(remainingTime)}
            </Text>
          </View>
          {/* Timer Text REMOVED from here */}
        </View> // End of timerDisplayGroup

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

      {/* Bottom Controls Section REMOVED */}

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

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingHorizontal: 16,
    backgroundColor: '#111111', // Reverted: Added solid background color back
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
    // Remove flex: 1 and justifyContent - Task 26
    // flex: 1,
    // justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 20,
    // Remove paddingTop - We'll use marginTop on timer group
    // paddingTop: 20,
  },
  controlsGroup: {
    alignItems: 'center',
    width: '90%',
    // Add margin top to space it from timer section
    marginTop: 15, // Reduced further from 20
  },
  timerCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 5,
    borderColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    // Ensure button removal didn't break something, style seems ok
  },
  timerText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'ChakraPetch-SemiBold',
    fontWeight: '600',
  },
  modeText: { // Style remains but component is removed
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
  // New style for selected Hard mode text
  controlButtonSelectedHardModeText: {
    color: '#FF3B30', 
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  modeIcon: {
    // Ensure icons have contrast - using white/green directly in component
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
  },
  xpNextLevelText: {
    fontSize: 14,
    color: '#8e8e93',
    fontFamily: 'ChakraPetch-SemiBold',
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
    // No direct styling needed here, BlurView handles it
  },
  modalPressableArea: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Add darkening layer
  },
  modalContentContainer: {
     // Styles for positioning the picker within the pressable area
     // Ensure it allows the picker's own container to define size
  },
  tooltipContainer: {
    height: 30,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // Ensure it doesn't take space when invisible
    // opacity: 0, // Set initial opacity via Animated.Value
  },
  hardModeTooltip: {
    fontSize: 12,
    color: '#8e8e93',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  resetButtonContainer: {
    // Remove marginTop maybe? Spacing handled by buttonArea
    // marginTop: 20,
    // Add padding if needed for touch target
    padding: 10, // Example
  },
  // Task 27: Add buttonArea style
  buttonArea: {
    flexDirection: 'column', // Changed from row to column
    alignItems: 'center',
    justifyContent: 'center', // Center button(s) horizontally
    marginTop: 30, // Space below timer group
    minHeight: 60, // Ensure area has consistent height even if buttons change
    width: '100%', // Take full width
    gap: 20, // Space between buttons vertically now
  },
  // Task 27: Add mainActionButton style (example)
  mainActionButton: {
    // Style for the main play/pause button (Revised - Subtle)
    // backgroundColor: '#34C759', // Removed background
    paddingVertical: 10, // Reduced padding
    paddingHorizontal: 20, // Reduced padding
    borderRadius: 15, // Less rounded corners
    // minWidth: 150, // Removed minWidth
    borderWidth: 2, // Increased border thickness
    borderColor: '#333333', // Changed to match timerCircle border
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Task 27: Add style for button content
  mainActionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Space between icon and text
  },
  // Task 27: Add style for button text
  mainActionButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'ChakraPetch-SemiBold',
    textTransform: 'uppercase',
  },
  // Task 21 (TwentySecond Rev): Style for grouping timer circle/text
  timerDisplayGroup: {
    alignItems: 'center',
    // Add fixed marginTop - Task 26
    marginTop: 50, // Adjust as needed
  },
  startButtonIconContainer: {
    padding: 12,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // New style for App State Tooltip Container
  appStateTooltipContainer: {
    position: 'absolute',
    bottom: 30, // Position near the bottom
    left: 16,   // Match container horizontal padding
    right: 16,  // Match container horizontal padding
    alignItems: 'center', // Center the text horizontally
    paddingVertical: 5, // Optional: Add some vertical padding
  },
  // New style for App State Tooltip Text (matches hardModeTooltip)
  appStateTooltipText: {
    fontSize: 12,
    color: '#8e8e93',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});
