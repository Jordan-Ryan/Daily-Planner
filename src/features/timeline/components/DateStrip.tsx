import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, PanResponder, Animated } from 'react-native';
import { Theme } from '../../../shared/types';
import { generateWeekDays } from '../services/timelineUtils';

interface DateStripProps {
  theme: Theme;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const DateStrip: React.FC<DateStripProps> = ({ theme, selectedDate, onDateSelect }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date(selectedDate);
    const dayOfWeek = today.getDay();
    // Adjust for Monday as first day: Sunday=0 becomes 6, Monday=1 becomes 0, etc.
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - mondayOffset);
    return startOfWeek;
  });

  const pan = useRef(new Animated.Value(0)).current;

  const generateWeekDaysFromDate = (startDate: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      
      days.push({
        date: date.getDate(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: date,
        isToday,
        isSelected,
      });
    }
    return days;
  };

  // Update currentWeekStart when selectedDate changes
  useEffect(() => {
    const dayOfWeek = selectedDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - mondayOffset);
    setCurrentWeekStart(startOfWeek);
  }, [selectedDate]);

  const weekDays = generateWeekDaysFromDate(currentWeekStart);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      pan.setValue(gestureState.dx);
    },
    onPanResponderRelease: (_, gestureState) => {
      const threshold = 50;
      
      if (gestureState.dx > threshold) {
        // Swipe right - go to previous week (subtract 7 days)
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 7);
        onDateSelect(newDate);
      } else if (gestureState.dx < -threshold) {
        // Swipe left - go to next week (add 7 days)
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 7);
        onDateSelect(newDate);
      }
      
      Animated.spring(pan, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    },
  });

  return (
    <View style={[styles.dateStrip, { backgroundColor: theme.colors.background }]}>
      <Animated.View 
        style={[
          styles.dateStripContainer,
          {
            transform: [{ translateX: pan }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {weekDays.map((day) => (
          <TouchableOpacity
            key={`${day.fullDate.getTime()}`}
            style={[
              styles.dateItem,
              { 
                backgroundColor: day.isSelected ? '#FFFFFF' : 'transparent',
                borderColor: day.isToday ? theme.colors.primary : 'transparent',
                borderWidth: day.isToday ? 1 : 0,
              },
            ]}
            onPress={() => onDateSelect(day.fullDate)}
          >
            <Text
              style={[
                styles.dayName,
                { 
                  color: day.isSelected ? '#000000' : 
                         day.isToday ? theme.colors.primary : 
                         theme.colors.text.secondary 
                },
              ]}
            >
              {day.dayName}
            </Text>
            <Text
              style={[
                styles.dayNumber,
                { 
                  color: day.isSelected ? '#000000' : 
                         day.isToday ? theme.colors.primary : 
                         theme.colors.text.primary 
                },
              ]}
            >
              {day.date}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  dateStrip: {
    paddingVertical: 16,
  },
  dateStripContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  dateItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 50,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
});
