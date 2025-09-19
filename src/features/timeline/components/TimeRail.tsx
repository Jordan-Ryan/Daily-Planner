import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../../shared/types';
import { SettingsService } from '../../../shared/services/settingsService';

interface TimeRailProps {
  theme: Theme;
  selectedDate: Date;
}

export const TimeRail: React.FC<TimeRailProps> = ({ theme, selectedDate }) => {
  // Generate dynamic time slots based on settings for the selected date
  const generateTimeSlots = () => {
    const settingsService = SettingsService.getInstance();
    const dayName = SettingsService.getDayNameFromDate(selectedDate);
    const daySchedule = settingsService.getDaySchedule(dayName);
    
    const wakeTime = daySchedule.wakeUpTime;
    const sleepTime = daySchedule.sleepTime;
    
    const slots = [];
    const wakeHour = parseInt(wakeTime.split(':')[0]);
    const wakeMin = parseInt(wakeTime.split(':')[1]);
    const sleepHour = parseInt(sleepTime.split(':')[0]);
    const sleepMin = parseInt(sleepTime.split(':')[1]);
    
    let currentHour = wakeHour;
    let currentMin = wakeMin;
    
    while (currentHour < sleepHour || (currentHour === sleepHour && currentMin <= sleepMin)) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
      slots.push(timeStr);
      
      currentMin += 30;
      if (currentMin >= 60) {
        currentMin = 0;
        currentHour++;
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <View style={styles.timeRail}>
      {timeSlots.map((time, index) => (
        <View key={time} style={styles.timeSlot}>
          <Text style={[styles.timeLabel, { color: theme.colors.text.tertiary }]} numberOfLines={1}>
            {time}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  timeRail: {
    width: 55,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 0,
  },
  timeSlot: {
    height: 50,
    justifyContent: 'center',
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: '400',
    marginBottom: 8,
    lineHeight: 14,
  },
});
