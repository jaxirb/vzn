import { StyleSheet, Platform, View, Text, Modal, Pressable, Animated } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics'; // Import Haptics
// import { LinearGradient } from 'expo-linear-gradient'; // Reverted: Removed import

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView'; // Reverted: Uncommented import
import CustomDurationPicker from '@/components/focus/CustomDurationPicker'; // Import Picker

// --- Types --- //
type FocusMode = 'easy' | 'hard';

// --- Helper Functions --- //
const formatDuration = (totalMinutes: number): string => {
  if (totalMinutes < 0) totalMinutes = 0;
  
  const totalSeconds = Math.floor(totalMinutes * 60); // Work with seconds for consistency maybe? Or stick to minutes?
  // Let's stick to minutes input for now. Always display 00 seconds.

  const displayMinutes = Math.floor(totalMinutes);
  const displaySeconds = 0;

  if (displayMinutes >= 60) {
    const hours = Math.floor(displayMinutes / 60);
    const minutes = displayMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
  } else {
    return `${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
  }
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
  const [showTooltipArea, setShowTooltipArea] = useState<boolean>(false);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipOpacity = useRef(new Animated.Value(0)).current;

  // --- Event Handlers --- // 
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

  return (
    <ThemedView style={styles.container}>
      <View style={styles.topBar}>
        {/* Streak Indicator (Left) */}
        <View style={styles.streakContainer}>
          <Ionicons name="flash" size={20} color="#FFD700" />
          <ThemedText style={styles.streakText}>3</ThemedText>
        </View>

        {/* Settings Icon (Right) */}
        <MaterialCommunityIcons name="cog" size={20} color="white" />
      </View>

      {/* XP Section */}
      <View style={styles.xpSectionContainer}>
        {/* Re-inserting XP Bar structure here */}
        <View style={styles.xpContainer}>
          <View style={styles.xpLevelHeader}>
            <ThemedText style={styles.xpCurrentLevelText}>Level 1</ThemedText>
            <ThemedText style={styles.xpNextLevelText}>Level 2</ThemedText>
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

      {/* Center Timer Section */}
      <View style={styles.centerContent}>
        <TimerDisplay />
        {/* Main Timer Text */}
        <Text style={styles.timerText}>
          {formatDuration(selectedDuration)}
        </Text>

        {/* Group the controls */}
        <View style={styles.controlsGroup}>
          {/* Duration Buttons Container */}
          <View style={styles.durationContainer}>
            {/* Task 8: Preset Button Logic */}
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
            {/* + Button - Task 10: Add onPress handler */}
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={handleOpenPicker}
            >
              <Text style={[styles.controlButtonText, { fontSize: 20, lineHeight: 20 }]}>+</Text>
            </TouchableOpacity>
          </View>
          {/* Mode Buttons Container - Task 12 Logic */}
          <View style={styles.modeContainer}>
            <TouchableOpacity 
              style={[styles.controlButton, focusMode === 'easy' && styles.controlButtonSelected]}
              onPress={() => handleModeSelect('easy')}
            >
              <MaterialCommunityIcons 
                name="clock-outline" 
                size={16} 
                // Task 12.4: Conditional Icon Color
                color={focusMode === 'easy' ? "#34C759" : "#8e8e93"} 
                style={styles.modeIcon} 
              />
              {/* Task 12.3: Conditional Text Style */}
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
                // Changed selected color to red
                color={focusMode === 'hard' ? "#FF3B30" : "#8e8e93"} 
                style={styles.modeIcon} 
              />
              {/* Apply new red style when selected */}
              <Text style={[styles.controlButtonText, focusMode === 'hard' && styles.controlButtonSelectedHardModeText]}>
                Hard Mode
              </Text>
            </TouchableOpacity>
          </View>
          {/* Tooltip Area */}
          <View style={styles.tooltipContainer}>
            {/* Render Animated.View, control visibility via opacity */}
            <Animated.View style={{ opacity: tooltipOpacity }}>
              <Text style={styles.hardModeTooltip}>
                Canceling session loses progress, 2XP for completion
              </Text>
            </Animated.View>
          </View>
        </View>

      </View>

      {/* Bottom Controls Section (Start Button REMOVED) */}
      <View style={styles.bottomControls}>
        {/* <StartFocusButton /> */}
      </View>

      {/* Task 9: Add Modal for Custom Duration Picker */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isPickerVisible}
        onRequestClose={() => { // Handle hardware back button on Android
          setIsPickerVisible(false);
        }}
      >
        {/* Task 9.4: Backdrop */}
        <Pressable 
          style={styles.modalBackdrop} 
          onPress={() => setIsPickerVisible(false)} // Close on backdrop press
        >
          {/* Task 9.5: Content Container */}
          <Pressable onPress={(e) => e.stopPropagation()}> 
            {/* Prevent closing modal when clicking inside picker area */}
             <View style={styles.modalContentContainer}> 
                {/* Task 9.6: Render Picker */}
                <CustomDurationPicker 
                  onSelectDuration={handleDurationSelect}
                  onClose={() => setIsPickerVisible(false)}
                  initialDuration={0}
                />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
  },
  controlsGroup: {
    alignItems: 'center',
    width: '90%',
  },
  timerCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 5,
    borderColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'ChakraPetch-SemiBold',
    marginBottom: 15,
  },
  modeText: { // Style remains but component is removed
    fontSize: 18,
    color: '#34C759',
    fontWeight: '600',
  },
  startButtonIconContainer: {
    padding: 20,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomControls: {
    justifyContent: 'center',
    height: 60,
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
    fontFamily: 'Inter-Medium',
  },
  xpNextLevelText: {
    fontSize: 14,
    color: 'rgba(52, 199, 89, 0.7)',
    fontFamily: 'Inter-Medium',
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
    flex: 1, // Ensure it fills the screen
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black
  },
  modalContentContainer: {
     // The CustomDurationPicker already has its own container style
     // This view just ensures it's placed correctly within the backdrop pressable
     // No specific centering styles needed here if the picker itself is sized
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
});
