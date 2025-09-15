import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTimeline } from '../hooks/useTimeline';
import { useTheme } from '../../../shared/hooks/useTheme';
import { Header, DateStrip, TimelineArea, CalendarModal } from './index';

interface TimelineScreenProps {
  onDateChange?: (date: Date) => void;
}

export const TimelineScreen: React.FC<TimelineScreenProps> = ({ onDateChange }) => {
  const { theme } = useTheme(true); // Use dark theme by default
  const { tasks, selectedDate, actions } = useTimeline();
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  // Debug initial load
  console.log('TimelineScreen - selectedDate:', selectedDate.toISOString().split('T')[0], 'tasks count:', tasks.length);

  // Notify parent component when date changes
  useEffect(() => {
    if (onDateChange) {
      onDateChange(selectedDate);
    }
  }, [selectedDate, onDateChange]);

  const handleCalendarPress = () => {
    setIsCalendarVisible(true);
  };

  const handleCalendarClose = () => {
    setIsCalendarVisible(false);
  };

  const handleDateSelect = (date: Date) => {
    actions.setSelectedDate(date);
  };


  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="light" translucent={false} />
      <View style={[styles.content, { paddingTop: Platform.OS === 'ios' ? 44 : 20 }]}>
        <Header 
          theme={theme} 
          selectedDate={selectedDate}
          onCalendarPress={handleCalendarPress}
        />
        
        <DateStrip
          theme={theme}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
        
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        
        <TimelineArea 
          theme={theme} 
          tasks={tasks} 
          onToggleComplete={actions.toggleTaskComplete}
          onTasksChange={actions.setTasks}
        />

        <CalendarModal
          theme={theme}
          visible={isCalendarVisible}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onClose={handleCalendarClose}
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
