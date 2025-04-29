import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Modal, TextInput, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { Picker } from '@react-native-picker/picker';

type SessionPreset = {
  id: string;
  duration: number;
  mode: 'Easy' | 'Hard';
  label?: string;
  completedAt?: string;
  xpEarned?: number;
};

type QuickActionProps = {
  onStartSession: (duration: number, mode: 'Easy' | 'Hard', label?: string) => void;
  recentPresets: SessionPreset[];
};

const PRESET_DURATIONS = [25, 50, 90];

// Add the relative time formatter
const getRelativeTime = (timestamp: string) => {
  const now = new Date();
  const completedDate = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - completedDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks}w ago`;
};

// Add helper function to filter today's sessions
const getTodaySessions = (sessions: SessionPreset[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return sessions.filter(session => {
    if (!session.completedAt) return false;
    const sessionDate = new Date(session.completedAt);
    return sessionDate >= today;
  });
};

// Add helper function to group sessions by date
const groupSessionsByDate = (sessions: SessionPreset[]) => {
  const grouped = sessions.reduce((acc, session) => {
    if (!session.completedAt) return acc;
    
    const date = new Date(session.completedAt);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(session);
    return acc;
  }, {} as Record<string, SessionPreset[]>);
  
  return Object.entries(grouped)
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
    .slice(0, 7); // Last 7 days only
};

export default function QuickAction({ onStartSession, recentPresets }: QuickActionProps) {
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [selectedMode, setSelectedMode] = useState<'Easy' | 'Hard'>('Easy');
  const [sessionLabel, setSessionLabel] = useState('');
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [isCustomTimeModalVisible, setIsCustomTimeModalVisible] = useState(false);
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(25);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  const todaySessions = getTodaySessions(recentPresets);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Circle properties
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Create a complete ring with 12 segments
  const totalSegments = 12;
  const segmentLength = circumference / totalSegments - 2; // Subtract small gap for rounded ends
  const gapLength = 2; // Minimal gap to create separation with rounded ends
  const pattern = [...Array(totalSegments)].map(() => `${segmentLength} ${gapLength}`).join(' ');

  const HistoryModal = () => {
    const groupedSessions = groupSessionsByDate(recentPresets);
    
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (dateStr === today.toISOString().split('T')[0]) return 'Today';
      if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isHistoryModalVisible}
        onRequestClose={() => setIsHistoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Session History</Text>
              <Pressable
                onPress={() => setIsHistoryModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.iconContainer}>
                  <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
                </Text>
              </Pressable>
            </View>
            
            <View style={styles.modalList}>
              {groupedSessions.map(([date, sessions]) => (
                <View key={date} style={styles.dateGroup}>
                  <Text style={styles.dateHeader}>{formatDate(date)}</Text>
                  {sessions.map((session) => (
                    <Pressable
                      key={session.id}
                      style={styles.modalListItem}
                      onPress={() => {
                        setSelectedDuration(session.duration);
                        setSelectedMode(session.mode);
                        if (session.label) setSessionLabel(session.label);
                        setIsHistoryModalVisible(false);
                      }}
                    >
                      <View style={styles.modalItemLeft}>
                        <Text style={styles.iconContainer}>
                          <MaterialCommunityIcons 
                            name="monitor"
                            size={20}
                            color="#9CA3AF"
                          />
                        </Text>
                        <View style={styles.modalItemInfo}>
                          <Text style={styles.modalItemLabel}>
                            {session.label || `${session.duration}m Focus`}
                          </Text>
                          <View style={styles.modalItemDetails}>
                            <Text style={styles.modalDetailText}>{session.duration}m</Text>
                            <Text style={styles.detailDot}>•</Text>
                            <Text style={[
                              styles.modalDetailText,
                              { color: session.mode === 'Easy' ? '#4ADE80' : '#F87171' }
                            ]}>
                              {session.mode}
                            </Text>
                            {session.xpEarned && (
                              <>
                                <Text style={styles.detailDot}>•</Text>
                                <Text style={[styles.modalDetailText, { color: '#FCD34D' }]}>
                                  +{session.xpEarned} XP
                                </Text>
                              </>
                            )}
                          </View>
                        </View>
                      </View>
                      {session.completedAt && (
                        <Text style={styles.completedAt}>
                          {new Date(session.completedAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </Text>
                      )}
                    </Pressable>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const CustomTimeModal = () => {
    const hours = Array.from({ length: 5 }, (_, i) => i);
    const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
    const itemHeight = 44;

    const hoursScrollRef = useRef<ScrollView>(null);
    const minutesScrollRef = useRef<ScrollView>(null);

    const handleScroll = (type: 'hours' | 'minutes', y: number) => {
      const selectedIndex = Math.round(y / itemHeight);
      if (type === 'hours') {
        setCustomHours(hours[selectedIndex] || 0);
      } else {
        setCustomMinutes(minutes[selectedIndex] || 0);
      }
    };

    const renderPickerColumn = (
      type: 'hours' | 'minutes',
      data: number[],
      scrollRef: React.RefObject<ScrollView>,
      selected: number
    ) => (
      <View style={styles.pickerColumn}>
        <ScrollView
          ref={scrollRef}
          style={styles.pickerScrollView}
          contentContainerStyle={styles.pickerScrollContent}
          showsVerticalScrollIndicator={false}
          snapToInterval={itemHeight}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => handleScroll(type, e.nativeEvent.contentOffset.y)}
        >
          <View style={{ height: itemHeight * 2 }} />
          {data.map((value) => (
            <Pressable
              key={value}
              style={[styles.pickerItem, { height: itemHeight }]}
              onPress={() => {
                scrollRef.current?.scrollTo({
                  y: data.indexOf(value) * itemHeight,
                  animated: true
                });
                if (type === 'hours') setCustomHours(value);
                else setCustomMinutes(value);
              }}
            >
              <Text style={[
                styles.pickerItemText,
                value === selected && styles.pickerItemTextSelected
              ]}>
                {type === 'minutes' ? value.toString().padStart(2, '0') : value.toString()}
              </Text>
            </Pressable>
          ))}
          <View style={{ height: itemHeight * 2 }} />
        </ScrollView>
        <View style={styles.pickerSelectionOverlay} pointerEvents="none">
          <View style={styles.pickerSelectionBand} />
        </View>
      </View>
    );

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isCustomTimeModalVisible}
        onRequestClose={() => setIsCustomTimeModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setIsCustomTimeModalVisible(false)}
        >
          <Pressable 
            style={styles.timePickerContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.timePickerHeader}>
              <Text style={styles.timePickerTitle}>Custom Duration</Text>
              <Pressable
                onPress={() => setIsCustomTimeModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
              </Pressable>
            </View>

            <View style={styles.timePickerContent}>
              {renderPickerColumn('hours', hours, hoursScrollRef, customHours)}
              <Text style={styles.timePickerLabel}>hours</Text>
              {renderPickerColumn('minutes', minutes, minutesScrollRef, customMinutes)}
              <Text style={styles.timePickerLabel}>min</Text>
            </View>

            <Pressable
              style={[
                styles.timePickerButton,
                (customHours === 0 && customMinutes === 0) && styles.timePickerButtonDisabled
              ]}
              onPress={() => {
                const totalMinutes = (customHours * 60) + customMinutes;
                if (totalMinutes > 0) {
                  setSelectedDuration(totalMinutes);
                  setIsCustomTimeModalVisible(false);
                }
              }}
              disabled={customHours === 0 && customMinutes === 0}
            >
              <Text style={styles.timePickerButtonText}>Set Duration</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* Timer Preview Circle */}
      <View style={styles.timerPreviewContainer}>
        <Svg width={size} height={size}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1C1C1E"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Segmented Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#6366F1"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={pattern}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        
        {/* Timer Display */}
        <View style={styles.timerContent}>
          <Text style={styles.timerText}>{selectedDuration}:00</Text>
          <Text style={[
            styles.modeText,
            selectedMode === 'Easy' && styles.easyModeText,
            selectedMode === 'Hard' && styles.hardModeText,
          ]}>
            {selectedMode === 'Easy' ? 'Easy Mode' : 'Hard Mode'}
          </Text>
        </View>
      </View>

      {/* Start Focus Button */}
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Pressable
          style={styles.startButton}
          onPress={() => onStartSession(selectedDuration, selectedMode, sessionLabel)}
        >
          <MaterialCommunityIcons name="play-circle" size={24} color="#FFFFFF" />
          <Text style={styles.startButtonText}>Start Focus</Text>
        </Pressable>
      </Animated.View>

      {/* Combined Duration and Mode Selector Block */}
      <View style={styles.selectorBlock}>
        {/* Duration Row */}
        <View style={styles.durationSelector}>
          {PRESET_DURATIONS.map((duration) => (
            <Pressable
              key={duration}
              style={[
                styles.durationOption,
                selectedDuration === duration && styles.selectedDuration,
              ]}
              onPress={() => setSelectedDuration(duration)}
            >
              <Text style={[
                styles.durationText,
                selectedDuration === duration && styles.selectedDurationText,
              ]}>
                {duration}m
              </Text>
            </Pressable>
          ))}
          <Pressable
            style={[
              styles.durationOption,
              styles.customDurationOption,
              !PRESET_DURATIONS.includes(selectedDuration) && styles.selectedDuration,
            ]}
            onPress={() => setIsCustomTimeModalVisible(true)}
          >
            <MaterialCommunityIcons
              name="plus"
              size={20}
              color={!PRESET_DURATIONS.includes(selectedDuration) ? '#FFFFFF' : '#9CA3AF'}
            />
          </Pressable>
        </View>

        {/* Mode Switch */}
        <View style={styles.modeSwitch}>
          <View style={styles.modeSwitchColumn}>
            <Pressable
              style={[
                styles.modeSwitchOption,
                selectedMode === 'Easy' && styles.selectedMode,
                { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }
              ]}
              onPress={() => setSelectedMode('Easy')}
            >
              <MaterialCommunityIcons
                name="timer-outline"
                size={20}
                color={selectedMode === 'Easy' ? '#4ADE80' : '#6B7280'}
              />
              <Text style={[
                styles.modeSwitchText,
                selectedMode === 'Easy' && styles.selectedModeText,
                selectedMode === 'Easy' && styles.easyModeText,
              ]}>
                Easy Mode
              </Text>
            </Pressable>
            <Text style={[styles.modeDescription, styles.easyModeDescription]}>
              Can pause anytime
            </Text>
          </View>

          <View style={styles.modeSwitchColumn}>
            <Pressable
              style={[
                styles.modeSwitchOption,
                selectedMode === 'Hard' && styles.selectedMode,
                { borderTopRightRadius: 12, borderBottomRightRadius: 12 }
              ]}
              onPress={() => setSelectedMode('Hard')}
            >
              <MaterialCommunityIcons
                name="shield-lock-outline"
                size={20}
                color={selectedMode === 'Hard' ? '#F87171' : '#6B7280'}
              />
              <Text style={[
                styles.modeSwitchText,
                selectedMode === 'Hard' && styles.selectedModeText,
                selectedMode === 'Hard' && styles.hardModeText,
              ]}>
                Hard Mode
              </Text>
            </Pressable>
            <Text style={[styles.modeDescription, styles.hardModeDescription]}>
              No pauses, 2x XP
            </Text>
          </View>
        </View>
      </View>

      {/* Recent Sessions */}
      {todaySessions.length > 0 && (
        <View style={styles.presetsContainer}>
          <View style={styles.presetsHeader}>
            <Text style={styles.presetsTitle}>Today's Sessions</Text>
            <Pressable
              onPress={() => setIsHistoryModalVisible(true)}
              style={styles.seeMoreButton}
            >
              <Text style={styles.seeMoreText}>See More</Text>
            </Pressable>
          </View>
          <View style={styles.presetsList}>
            {todaySessions.map((preset) => (
              <Pressable
                key={preset.id}
                style={styles.presetItem}
                onPress={() => {
                  setSelectedDuration(preset.duration);
                  setSelectedMode(preset.mode);
                  if (preset.label) setSessionLabel(preset.label);
                }}
              >
                <View style={styles.presetMainInfo}>
                  <MaterialCommunityIcons 
                    name="monitor"
                    size={18}
                    color="#9CA3AF"
                  />
                  <View style={styles.presetInfo}>
                    <Text style={styles.presetLabel}>{preset.label || `${preset.duration}m Focus`}</Text>
                    <View style={styles.presetDetails}>
                      <Text style={styles.presetDetail}>{preset.duration}m</Text>
                      <Text style={styles.presetDot}>•</Text>
                      <Text style={[
                        styles.presetDetail,
                        { color: preset.mode === 'Easy' ? '#4ADE80' : '#F87171' }
                      ]}>
                        {preset.mode}
                      </Text>
                      {preset.xpEarned && (
                        <>
                          <Text style={styles.presetDot}>•</Text>
                          <Text style={[styles.presetDetail, { color: '#FCD34D' }]}>
                            +{preset.xpEarned} XP
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>
                {preset.completedAt && (
                  <Text style={styles.presetTime}>
                    {getRelativeTime(preset.completedAt)}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <CustomTimeModal />
      <HistoryModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  timerPreviewContainer: {
    width: 200,
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  timerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  modeText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 8,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 100,
    gap: 8,
    marginBottom: 32,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  selectorBlock: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 8,
    width: '100%',
    maxWidth: 400,
    gap: 8,
  },
  durationSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    padding: 4,
  },
  durationOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 100,
    alignItems: 'center',
  },
  selectedDuration: {
    backgroundColor: '#2C2C2E',
  },
  durationText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedDurationText: {
    color: '#FFFFFF',
  },
  modeSwitch: {
    flexDirection: 'row',
  },
  modeSwitchColumn: {
    flex: 1,
    alignItems: 'center',
  },
  modeSwitchOption: {
    width: '100%',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#000000',
  },
  selectedMode: {
    backgroundColor: '#2C2C2E',
  },
  modeSwitchText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedModeText: {
    color: '#FFFFFF',
  },
  modeDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  presetsContainer: {
    width: '100%',
    maxWidth: 400,
    marginTop: 24,
  },
  presetsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  presetsTitle: {
    color: '#9CA3AF',
    fontSize: 15,
    fontWeight: '500',
  },
  presetsList: {
    gap: 8,
  },
  presetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 12,
  },
  presetInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  presetLabel: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  presetDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  presetDetail: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  presetDot: {
    fontSize: 13,
    color: '#4B5563',
  },
  xpText: {
    color: '#FCD34D',
  },
  presetTime: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
  },
  easyModeText: {
    color: '#4ADE80',
  },
  hardModeText: {
    color: '#F87171',
  },
  easyModeDescription: {
    color: '#6B7280',
  },
  hardModeDescription: {
    color: '#6B7280',
  },
  seeMoreButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  seeMoreText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '500',
  },
  presetMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#000000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  modalList: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  modalListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
  },
  modalItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  modalItemInfo: {
    flex: 1,
  },
  modalItemLabel: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  modalItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  completedAt: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 'auto', // This ensures it stays on the right
    minWidth: 55, // This ensures consistent width for time stamps
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  modalDetailText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  detailDot: {
    fontSize: 13,
    color: '#4B5563',
  },
  customDurationOption: {
    width: 44,
    flex: 0,
  },
  customTimeContainer: {
    padding: 16,
  },
  timePickerContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    width: '85%',
    maxWidth: 360,
    padding: 20,
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  timePickerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    gap: 12,
  },
  pickerColumn: {
    width: 72,
    height: 132,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  pickerScrollView: {
    height: '100%',
  },
  pickerScrollContent: {
    paddingVertical: 44,
  },
  pickerSelectionOverlay: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 44,
    marginTop: -22,
    pointerEvents: 'none',
  },
  pickerSelectionBand: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(60, 60, 62, 0.5)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#3C3C3E',
  },
  pickerItem: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerItemText: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  pickerItemTextSelected: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
  },
  timePickerLabel: {
    fontSize: 15,
    color: '#9CA3AF',
    marginHorizontal: 4,
  },
  timePickerButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  timePickerButtonDisabled: {
    backgroundColor: '#2C2C2E',
  },
  timePickerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  iconContainer: {
    padding: 4,
  },
}); 