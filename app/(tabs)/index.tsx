import { StyleSheet, Platform, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// --- Define placeholder components --- //
const TimerDisplay = () => {
  return (
    <View style={styles.timerCircle}>
      {/* Timer Text - Using standard Text for debugging */}
      <Text style={styles.timerText}>25:00</Text>
      {/* Mode Text */}
      <ThemedText style={styles.modeText}>Easy Mode</ThemedText>
    </View>
  );
};

const StartFocusButton = () => {
  return (
    <TouchableOpacity style={styles.startButtonContainer}>
      <ThemedText style={styles.startButtonText}>▶ Start Focus</ThemedText>
    </TouchableOpacity>
  );
};
// ----------------------------------- //

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.streakContainer}>
          <Ionicons name="flame-outline" size={24} color="white" />
          <ThemedText style={styles.streakText}>0</ThemedText>
        </View>

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
            </View>
          </View>
        </View>

        {/* Settings Icon (Right) */}
        <Ionicons name="settings-outline" size={24} color="white" />
      </View>

      {/* Center Timer Section */}
      <View style={styles.centerContent}>
        <TimerDisplay />
        <StartFocusButton />
      </View>

      {/* Bottom Controls Section */}
      <View style={styles.bottomControls}>
        {/* Duration Buttons Container */}
        <View style={styles.durationContainer}>
          <TouchableOpacity style={styles.controlButton}>
            <ThemedText style={styles.controlButtonText}>25m</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <ThemedText style={styles.controlButtonText}>50m</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <ThemedText style={styles.controlButtonText}>90m</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <ThemedText style={styles.controlButtonText}>+</ThemedText>
          </TouchableOpacity>
        </View>
        {/* Mode Buttons Container */}
        <View style={styles.modeContainer}>
          <TouchableOpacity style={[styles.controlButton, styles.controlButtonSelected]}>
            <ThemedText style={styles.controlButtonSelectedText}>Easy Mode</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <ThemedText style={styles.controlButtonText}>Hard Mode</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingHorizontal: 16,
    backgroundColor: '#111111',
  },
  topBar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  xpContainer: {
    flex: 1,
    marginHorizontal: 15,
    gap: 4,
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
    fontWeight: 'bold',
  },
  xpNextLevelText: {
    fontSize: 14,
    color: '#8e8e93',
    fontWeight: 'bold',
  },
  xpProgressContainer: {
    gap: 4,
  },
  xpProgressBar: {
    height: 4,
    backgroundColor: '#2c2c2e',
    borderRadius: 2,
    overflow: 'hidden',
  },
  xpProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  xpInfoContainer: {
    alignItems: 'flex-end',
  },
  xpRemaining: {
    fontSize: 12,
    color: '#8e8e93',
    fontWeight: '500',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 40,
  },
  timerCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 5,
    borderColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    // May need a slight gap if text elements are too close
    gap: 5,
  },
  timerText: {
    fontSize: 72, // Large font size
    color: '#FFFFFF',
    fontWeight: 'bold',
    // Ensure text fits if time gets longer, maybe adjust letter spacing?
    // letterSpacing: -1, 
  },
  modeText: {
    fontSize: 18,
    color: '#34C759', // Green color like the screenshot
    fontWeight: '600',
  },
  startButtonContainer: {
    backgroundColor: '#2C2C2E', // Dark grey background (iOS systemGray5)
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30, // Pill shape
    // Add some elevation/shadow maybe?
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomControls: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 15,
  },
  durationContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center', // Center buttons horizontally
    width: '100%', // Ensure container takes width for centering
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center', // Center buttons horizontally
    width: '100%', // Ensure container takes width for centering
  },
  // Shared style for duration/mode buttons
  controlButton: {
    backgroundColor: '#2C2C2E', // Dark grey bg
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20, // Rounded rectangle
    minWidth: 55, // Ensure buttons have some minimum width
    alignItems: 'center', // Center text inside button
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Style for the selected button
  controlButtonSelected: {
    backgroundColor: '#34C759', // Green background for selected
  },
  controlButtonSelectedText: {
    color: '#FFFFFF', // White text for selected
    fontSize: 14,
    fontWeight: 'bold',
  },
});
