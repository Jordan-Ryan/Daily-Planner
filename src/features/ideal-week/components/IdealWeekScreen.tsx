import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useIdealWeek } from '../hooks/useIdealWeek';
import { useTheme } from '../../../shared/hooks/useTheme';
import { Header, DayStrip, TimelineArea } from './index';

interface IdealWeekScreenProps {
  onDateChange?: (day: number) => void;
}

export const IdealWeekScreen: React.FC<IdealWeekScreenProps> = ({ onDateChange }) => {
  const { theme } = useTheme(true); // Use dark theme by default
  const { tasks, selectedDay, actions } = useIdealWeek();

  // Debug initial load
  console.log('IdealWeekScreen - selectedDay:', selectedDay, 'tasks count:', tasks.length);

  // Notify parent component when day changes
  useEffect(() => {
    if (onDateChange) {
      onDateChange(selectedDay);
    }
  }, [selectedDay, onDateChange]);

  const handleDaySelect = (day: number) => {
    actions.setSelectedDay(day);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="light" translucent={false} />
      <View style={[styles.content, { paddingTop: Platform.OS === 'ios' ? 44 : 20 }]}>
        <Header theme={theme} />
        
        <DayStrip
          theme={theme}
          selectedDay={selectedDay}
          onDaySelect={handleDaySelect}
        />
        
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        
        <TimelineArea 
          theme={theme} 
          tasks={tasks} 
          onToggleComplete={actions.toggleTaskComplete}
          onTasksChange={actions.setTasks}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  content: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
});
