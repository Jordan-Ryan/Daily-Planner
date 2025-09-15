import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../../../shared/types';
import { generateWeekDays } from '../services/idealWeekUtils';

interface DayStripProps {
  theme: Theme;
  selectedDay: number; // 0-6 for Monday-Sunday
  onDaySelect: (day: number) => void;
}

export const DayStrip: React.FC<DayStripProps> = ({ theme, selectedDay, onDaySelect }) => {
  const weekDays = generateWeekDays();

  return (
    <View style={[styles.dayStrip, { backgroundColor: theme.colors.background }]}>
      <View style={styles.dayStripContainer}>
        {weekDays.map((day) => (
          <TouchableOpacity
            key={day.dayIndex}
            style={[
              styles.dayItem,
              { 
                backgroundColor: day.dayIndex === selectedDay ? '#FFFFFF' : 'transparent',
              },
            ]}
            onPress={() => onDaySelect(day.dayIndex)}
          >
            <Text
              style={[
                styles.dayName,
                { 
                  color: day.dayIndex === selectedDay ? '#000000' : theme.colors.text.secondary,
                },
              ]}
            >
              {day.dayName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dayStrip: {
    paddingVertical: 16,
  },
  dayStripContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  dayItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 50,
  },
  dayName: {
    fontSize: 14,
    fontWeight: '600',
  },
});
