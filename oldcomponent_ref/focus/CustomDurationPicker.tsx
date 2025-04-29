import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type CustomDurationPickerProps = {
  onSelectDuration: (duration: number) => void;
  onClose: () => void;
  initialDuration?: number;
};

export default function CustomDurationPicker({ onSelectDuration, onClose, initialDuration = 25 }: CustomDurationPickerProps) {
  const hours = Array.from({ length: 5 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
  const itemHeight = 50;

  const hoursScrollRef = useRef<ScrollView>(null);
  const minutesScrollRef = useRef<ScrollView>(null);
  
  // Calculate initial hours and minutes from initialDuration
  const initialHours = Math.floor(initialDuration / 60);
  const initialMinutes = Math.round((initialDuration % 60) / 5) * 5;
  
  const [selectedHour, setSelectedHour] = useState(initialHours);
  const [selectedMinute, setSelectedMinute] = useState(initialMinutes);

  useEffect(() => {
    // Set initial scroll positions with a slight delay to ensure layout is complete
    setTimeout(() => {
      const hourIndex = hours.indexOf(selectedHour);
      const minuteIndex = minutes.indexOf(selectedMinute);

      if (hourIndex !== -1) {
        hoursScrollRef.current?.scrollTo({
          y: hourIndex * itemHeight,
          animated: false
        });
      }

      if (minuteIndex !== -1) {
        minutesScrollRef.current?.scrollTo({
          y: minuteIndex * itemHeight,
          animated: false
        });
      }
    }, 100);
  }, []);

  const handleScroll = (type: 'hours' | 'minutes', y: number) => {
    const dataArray = type === 'hours' ? hours : minutes;
    
    // Calculate the maximum scroll position
    const maxScroll = (dataArray.length - 1) * itemHeight;
    
    // Constrain the scroll position to valid range
    const boundedY = Math.max(0, Math.min(y, maxScroll));
    const selectedIndex = Math.round(boundedY / itemHeight);
    const value = dataArray[selectedIndex];

    // Update scroll position if it's out of bounds
    const scrollRef = type === 'hours' ? hoursScrollRef : minutesScrollRef;
    if (y < 0 || y > maxScroll) {
      scrollRef.current?.scrollTo({
        y: boundedY,
        animated: true
      });
    }

    if (type === 'hours') {
      setSelectedHour(value);
    } else {
      setSelectedMinute(value);
    }
  };

  const renderPickerColumn = (
    type: 'hours' | 'minutes',
    data: number[],
    scrollRef: React.RefObject<ScrollView>,
    selectedValue: number
  ) => (
    <View style={styles.pickerColumn}>
      <View style={styles.pickerMask}>
        <View style={styles.pickerSelectionBand} pointerEvents="none" />
      </View>
      <ScrollView
        ref={scrollRef}
        style={styles.pickerScrollView}
        contentContainerStyle={styles.pickerScrollContent}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        bounces={false}
        onScroll={(e) => {
          handleScroll(type, e.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
      >
        <View style={{ height: (150 - itemHeight) / 2 }} />
        {data.map((value) => (
          <Pressable
            key={value}
            style={[
              styles.pickerItem,
              { height: itemHeight },
              value === selectedValue && styles.selectedItem
            ]}
            onPress={() => {
              const index = data.indexOf(value);
              const targetY = index * itemHeight;
              scrollRef.current?.scrollTo({
                y: targetY,
                animated: true
              });
              if (type === 'hours') {
                setSelectedHour(value);
              } else {
                setSelectedMinute(value);
              }
            }}
          >
            <Text style={[
              styles.pickerItemText,
              value === selectedValue && styles.selectedItemText
            ]}>
              {type === 'minutes' ? value.toString().padStart(2, '0') : value.toString()}
            </Text>
          </Pressable>
        ))}
        <View style={{ height: (150 - itemHeight) / 2 }} />
      </ScrollView>
      <View style={styles.pickerGradientTop} pointerEvents="none" />
      <View style={styles.pickerGradientBottom} pointerEvents="none" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Custom Duration</Text>
      </View>

      <View style={styles.pickerContainer}>
        <View style={styles.pickerWrapper}>
          {renderPickerColumn('hours', hours, hoursScrollRef, selectedHour)}
          <Text style={styles.pickerLabel}>hours</Text>
        </View>
        <Text style={styles.pickerSeparator}>:</Text>
        <View style={styles.pickerWrapper}>
          {renderPickerColumn('minutes', minutes, minutesScrollRef, selectedMinute)}
          <Text style={styles.pickerLabel}>min</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.setButton,
            (selectedHour === 0 && selectedMinute === 0) && styles.setButtonDisabled
          ]}
          onPress={() => {
            const totalMinutes = (selectedHour * 60) + selectedMinute;
            if (totalMinutes > 0) {
              onSelectDuration(totalMinutes);
              onClose();
            }
          }}
          disabled={selectedHour === 0 && selectedMinute === 0}
        >
          <Text style={styles.setButtonText}>Set Duration</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    padding: 24,
    width: '85%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 36,
    gap: 8,
  },
  pickerWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  pickerColumn: {
    width: 85,
    height: 160,
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  pickerMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  pickerScrollView: {
    height: '100%',
  },
  pickerScrollContent: {
    alignItems: 'center',
  },
  pickerItem: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedItem: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  pickerItemText: {
    fontSize: 32,
    color: '#6B7280',
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  selectedItemText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pickerLabel: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pickerSeparator: {
    fontSize: 32,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 55,
  },
  pickerSelectionBand: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 54,
    marginTop: -27,
    backgroundColor: 'rgba(60, 60, 62, 0.9)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#3C3C3E',
  },
  pickerGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(44, 44, 46, 0.95)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#2C2C2E',
  },
  pickerGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(44, 44, 46, 0.95)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#2C2C2E',
  },
  footer: {
    marginTop: 'auto',
  },
  setButton: {
    backgroundColor: '#6366F1',
    borderRadius: 20,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  setButtonDisabled: {
    opacity: 0.5,
  },
  setButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
}); 