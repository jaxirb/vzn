import { StyleSheet, Platform, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient'; // Reverted: Removed import

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView'; // Reverted: Uncommented import

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
        {/* Timer text moved here, below the circle */}
        <Text style={styles.timerText}>25:00</Text>

        {/* Group the controls */}
        <View style={styles.controlsGroup}>
          {/* Duration Buttons Container */}
          <View style={styles.durationContainer}>
            <TouchableOpacity style={[styles.controlButton, styles.controlButtonSelected]}>
              <Text style={styles.controlButtonSelectedText}>25m</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlButtonText}>50m</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlButtonText}>90m</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={[styles.controlButtonText, { fontSize: 20, lineHeight: 20 }]}>+</Text>
            </TouchableOpacity>
          </View>
          {/* Mode Buttons Container */}
          <View style={styles.modeContainer}>
            <TouchableOpacity style={[styles.controlButton, styles.controlButtonSelected]}>
              <MaterialCommunityIcons name="clock-outline" size={16} color="#34C759" style={styles.modeIcon} />
              <Text style={styles.controlButtonSelectedModeText}>Easy Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <MaterialCommunityIcons name="shield-outline" size={16} color="#8e8e93" style={styles.modeIcon} />
              <Text style={styles.controlButtonText}>Hard Mode</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>

      {/* Bottom Controls Section (Start Button REMOVED) */}
      <View style={styles.bottomControls}>
        {/* <StartFocusButton /> */}
      </View>
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
    marginTop: 15,
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
});
