import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../../shared/types';
import { Task } from '../types';

interface TimeRailProps {
  theme: Theme;
  tasks: Task[];
}

export const TimeRail: React.FC<TimeRailProps> = ({ theme, tasks }) => {
  // Generate dynamic time slots based on wake/sleep times (same as normal timeline)
  const generateTimeSlots = () => {
    const wakeUpTask = tasks.find(task => task.isSystemTask && task.title === 'Wake up');
    const sleepTask = tasks.find(task => task.isSystemTask && task.title === 'Sleep well');
    
    // If no wake/sleep tasks found, show full day (00:00 to 23:30)
    const wakeTime = wakeUpTask?.startTime || '06:00';
    const sleepTime = sleepTask?.startTime || '22:00';
    
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
