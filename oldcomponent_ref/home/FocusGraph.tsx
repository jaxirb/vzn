import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type FocusGraphProps = {
  weeklyData: {
    day: string;
    hours: number;
  }[];
};

type MotivationalInfo = {
  message: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
};

export default function FocusGraph({ weeklyData }: FocusGraphProps) {
  // Get today's day abbreviation and index
  const getTodayInfo = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayIndex = new Date().getDay();
    return {
      day: days[todayIndex],
      index: todayIndex
    };
  };

  const today = getTodayInfo();
  const [selectedDay, setSelectedDay] = useState<string | null>(today.day);

  // Reorganize the data to show today on the far right
  const reorganizeWeeklyData = (data: typeof weeklyData) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayIndex = today.index;
    
    // Create a new array starting from 6 days ago
    const orderedDays = Array.from({ length: 7 }, (_, i) => {
      const index = (todayIndex - 6 + i + 7) % 7;
      return days[index];
    });

    // Map the ordered days to their corresponding data
    return orderedDays.map(day => {
      const dayData = data.find(d => d.day === day);
      return dayData || { day, hours: 0 };
    });
  };

  const reorganizedData = reorganizeWeeklyData(weeklyData);

  const width = Dimensions.get('window').width - 16;
  const height = 160;
  const paddingBottom = 24;
  const paddingLeft = 28;
  const paddingRight = 12;
  const paddingTop = 16;
  const graphWidth = width - paddingLeft - paddingRight;
  const barWidth = Math.min((graphWidth / reorganizedData.length) * 0.3, 16);
  const barRadius = 4;

  // Calculate total hours this week
  const totalHoursThisWeek = reorganizedData.reduce((sum, day) => sum + day.hours, 0);
  const weeklyGoal = 20; // Weekly goal in hours
  const progressPercentage = (totalHoursThisWeek / weeklyGoal) * 100;
  
  // Get motivational message based on progress
  const getMotivationalMessage = (): MotivationalInfo => {
    if (progressPercentage >= 100) {
      return {
        message: "You're crushing it! Goal achieved! 🎉",
        icon: "trophy-award",
        color: "#4ade80"
      };
    } else if (progressPercentage >= 75) {
      return {
        message: "Almost there! Final push! 💪",
        icon: "rocket-launch",
        color: "#6366F1"
      };
    } else if (progressPercentage >= 50) {
      return {
        message: "Halfway there! Keep going! 🔥",
        icon: "fire",
        color: "#f59e0b"
      };
    } else if (progressPercentage >= 25) {
      return {
        message: "Good start! Build momentum! ⚡️",
        icon: "lightning-bolt",
        color: "#8b5cf6"
      };
    } else {
      return {
        message: "Let's make this week count! 🎯",
        icon: "target",
        color: "#ec4899"
      };
    }
  };

  const motivationalInfo = getMotivationalMessage();

  // Convert hours to minutes for better scale
  const dataInMinutes = reorganizedData.map(d => ({
    ...d,
    minutes: Math.round(d.hours * 60)
  }));

  // Find max minutes and create scale (minimum 360 minutes = 6 hours)
  const maxMinutes = Math.max(...dataInMinutes.map(d => d.minutes), 360);
  // Create hour markers from 0 to 6 hours
  const hourMarkers = [0, 2, 4, 6].map(hour => hour * 60);

  // Helper function to format time with hours and minutes
  const formatTimeWithMinutes = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes === 0) {
      return `${wholeHours}h`;
    } else {
      return `${wholeHours}h ${minutes}m`;
    }
  };

  // Calculate bar positions with even spacing across full width
  const maxBarHeight = height - paddingTop - paddingBottom;
  const bars = dataInMinutes.map((data, index) => {
    // Calculate spacing to distribute bars evenly across 80% of the width
    const availableWidth = graphWidth * 0.8;
    const spacing = availableWidth / (reorganizedData.length - 1);
    const startOffset = (graphWidth - availableWidth) / 2;
    const x = paddingLeft + startOffset + (index * spacing) - (barWidth / 2);
    const barHeight = (data.minutes / maxMinutes) * maxBarHeight;
    const y = height - paddingBottom - barHeight;

    return {
      x,
      y,
      height: barHeight,
      width: barWidth,
      day: data.day,
      minutes: data.minutes
    };
  });

  // Calculate XP (lump sum when goal is completed)
  const goalXP = weeklyGoal * 50; // 1000 XP for 20-hour goal

  // Calculate time remaining in days and hours
  const formatTimeLeft = () => {
    const hoursLeft = Math.max(0, weeklyGoal - totalHoursThisWeek);
    if (hoursLeft === 0) return '';
    
    const days = Math.floor(hoursLeft / 24);
    const hours = Math.floor(hoursLeft % 24);
    const minutes = Math.round((hoursLeft % 1) * 60);

    return `${days}d ${hours}h ${minutes}m left`;
  };

  return (
    <View style={styles.container}>
      {/* Weekly Overview Card */}
      <View style={[styles.card, styles.graphCard]}>
        <View style={styles.chartContainer}>
          <Svg width={width} height={height}>
            {/* Background grid lines */}
            {hourMarkers.map((minutes, i) => {
              const y = paddingTop + (maxBarHeight * (maxMinutes - minutes)) / maxMinutes;
              return (
                <React.Fragment key={minutes}>
                  <SvgText
                    x={24}
                    y={y + 4}
                    fill="#666666"
                    fontSize={11}
                    textAnchor="end"
                  >
                    {formatTimeWithMinutes(minutes / 60)}
                  </SvgText>
                  <Line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#2C2C2E"
                    strokeWidth={1}
                    opacity={0.5}
                  />
                </React.Fragment>
              );
            })}

            {/* Bars */}
            {bars.map((bar, i) => {
              const isSelected = selectedDay === bar.day;
              
              return (
                <React.Fragment key={i}>
                  <Rect
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    rx={barRadius}
                    fill="#FFFFFF"
                    opacity={isSelected ? 0.9 : 0.3}
                    onPress={() => {
                      setSelectedDay(bar.day === selectedDay ? null : bar.day);
                    }}
                  />
                  <SvgText
                    x={bar.x + (bar.width / 2)}
                    y={height - 8}
                    fill="#8E8E93"
                    fontSize={11}
                    textAnchor="middle"
                  >
                    {bar.day.charAt(0)}
                  </SvgText>
                  {isSelected && (
                    <SvgText
                      x={bar.x + (bar.width / 2)}
                      y={bar.y - 8}
                      fill="#FFFFFF"
                      fontSize={11}
                      textAnchor="middle"
                    >
                      {formatTimeWithMinutes(bar.minutes / 60)}
                    </SvgText>
                  )}
                </React.Fragment>
              );
            })}
          </Svg>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    gap: 12,
  },
  card: {
    backgroundColor: '#141414',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  graphCard: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  graphTitle: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 12,
    letterSpacing: -0.1,
  },
  chartContainer: {
    marginTop: 4,
    alignItems: 'center',
  },
}); 