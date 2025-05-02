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
    </View>
  );

  return (
    <View style={styles.container}>
      {/* REMOVED Header View */}
      {/* <View style={styles.header}>
        <Text style={styles.title}>Custom Duration</Text>
      </View> */}

      <View style={styles.pickerContainer}>
        <View style={styles.pickerWrapper}>
          {renderPickerColumn('hours', hours, hoursScrollRef, selectedHour)}
          <Text style={styles.pickerLabel}>HRS</Text>
        </View>
        <Text style={styles.pickerSeparator}>:</Text>
        <View style={styles.pickerWrapper}>
          {renderPickerColumn('minutes', minutes, minutesScrollRef, selectedMinute)}
          <Text style={styles.pickerLabel}>MIN</Text>
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
    borderRadius: 24,
    padding: 24,
    backgroundColor: '#111111',
    shadowColor: '#AAAAAA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
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
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
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
    // Remove background color
    // backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  pickerItemText: {
    fontSize: 32,
    color: '#6B7280',
    fontFamily: 'ChakraPetch-Medium',
    fontVariant: ['tabular-nums'],
  },
  selectedItemText: {
    color: '#E5E5EA',
    fontFamily: 'ChakraPetch-SemiBold',
    fontSize: 32,
    fontVariant: ['tabular-nums'],
  },
  pickerLabel: {
    fontSize: 15,
    color: '#6B7280',
    fontFamily: 'ChakraPetch-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pickerSeparator: {
    fontSize: 32,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
    marginTop: 55,
  },
  footer: {
    marginTop: 'auto',
  },
  setButton: {
    borderRadius: 12,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  setButtonDisabled: {
    opacity: 0.5,
  },
  setButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.2,
  },
}); 