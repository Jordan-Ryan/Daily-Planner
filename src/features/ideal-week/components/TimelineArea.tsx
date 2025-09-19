import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../../../shared/types';
import { Task } from '../types';
import { TimeRail } from './TimeRail';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { IdealWeekService } from '../services/idealWeekService';
import { SettingsService } from '../../../shared/services/settingsService';

interface TimelineAreaProps {
  theme: Theme;
  tasks: Task[];
  selectedDay: number; // 0 = Sunday, 1 = Monday, etc.
  onToggleComplete: (taskId: string) => void;
  onTasksChange: (tasks: Task[]) => void;
}

export const TimelineArea: React.FC<TimelineAreaProps> = ({ theme, tasks, selectedDay, onToggleComplete, onTasksChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      if (editingTask) {
        // Update existing task
        const updatedTask = await IdealWeekService.updateTask(editingTask.id, taskData);
        const updatedTasks = tasks.map(task => 
          task.id === editingTask.id ? updatedTask : task
        );
        onTasksChange(updatedTasks);
      } else {
        // Create new task
        const newTask = await IdealWeekService.addTask(taskData);
        onTasksChange([...tasks, newTask]);
      }
      setModalVisible(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleCancelModal = () => {
    setModalVisible(false);
    setEditingTask(null);
  };

  // For ideal week, we only show timed tasks (no all-day events)
  const timedTasks = tasks.filter(task => !task.isAllDay);

  // Generate dynamic time slots based on settings for the selected day
  const generateTimeSlots = () => {
    const settingsService = SettingsService.getInstance();
    const dayName = SettingsService.getDayNameFromIndex(selectedDay);
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
  console.log('Generated time slots:', timeSlots);
  console.log('Tasks:', tasks.map(t => ({ title: t.title, startTime: t.startTime, endTime: t.endTime })));
  
  // Get all occupied time slots (only for timed tasks)
  const occupiedSlots = new Set(timedTasks.map(task => task.startTime));
  
  // Find free time slots
  const freeSlots = timeSlots.filter(slot => !occupiedSlots.has(slot));

  const renderContinuousTimeline = () => {
    const totalHeight = 20 + (timeSlots.length * 50) + 20; // Total timeline height + minimal padding

    return (
      <View style={[styles.continuousTimeline, { height: totalHeight }]}>
        <View style={styles.verticalDottedLine} />
      </View>
    );
  };

  return (
    <View style={styles.timelineContainer}>
      <ScrollView 
        style={styles.timelineContent} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.scrollableTimeline}>
          <TimeRail theme={theme} selectedDay={selectedDay} />
          <View style={styles.tasksContainer}>
            <View style={styles.tasksContent}>
              {renderContinuousTimeline()}
              {timedTasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  theme={theme} 
                  tasks={timedTasks} 
                  onToggleComplete={onToggleComplete}
                  onEditTask={handleEditTask}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      
      <TaskModal
        visible={modalVisible}
        task={editingTask}
        theme={theme}
        onSave={handleSaveTask}
        onCancel={handleCancelModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  timelineContainer: {
    flex: 1,
  },
  timelineContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 50, // Reduced bottom padding for scroll content
  },
  scrollableTimeline: {
    flexDirection: 'row',
    minHeight: 1200,
  },
  tasksContainer: {
    flex: 1,
    position: 'relative',
    paddingTop: 20, // Match TimeRail paddingTop
    paddingBottom: 20, // Reduced bottom padding
    minHeight: 1000, // Increased minimum height
  },
  tasksContent: {
    paddingRight: 20,
  },
  continuousTimeline: {
    position: 'absolute',
    left: 55, // Start after TimeRail (55px)
    top: 0,
    width: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalDottedLine: {
    width: 2,
    height: '100%',
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
});
