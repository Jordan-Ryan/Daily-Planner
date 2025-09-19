import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../../../shared/types';
import { Task } from '../types';
import { TimeRail } from './TimeRail';
import { TaskCard } from './TaskCard';
import { AllDayTaskCard } from './AllDayTaskCard';
import { DirectOverlapCard } from './DirectOverlapCard';
import { TaskModal } from './TaskModal';
import { TimelineService } from '../services/timelineService';
import { groupOverlappingEvents } from '../services/timelineUtils';
import { SettingsService } from '../../../shared/services/settingsService';

interface TimelineAreaProps {
  theme: Theme;
  tasks: Task[];
  selectedDate: Date;
  onToggleComplete: (taskId: string) => void;
  onTasksChange: (tasks: Task[]) => void;
}

export const TimelineArea: React.FC<TimelineAreaProps> = ({ theme, tasks, selectedDate, onToggleComplete, onTasksChange }) => {
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
        const updatedTask = await TimelineService.updateTask(editingTask.id, taskData);
        const updatedTasks = tasks.map(task => 
          task.id === editingTask.id ? updatedTask : task
        );
        onTasksChange(updatedTasks);
      } else {
        // Create new task
        const newTask = await TimelineService.addTask(taskData);
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
    console.log('Generated time slots:', timeSlots);
    console.log('Tasks:', tasks.map(t => ({ title: t.title, startTime: t.startTime, endTime: t.endTime })));

  // Separate all-day tasks from timed tasks
  const allDayTasks = tasks.filter(task => task.isAllDay);
  const timedTasks = tasks.filter(task => !task.isAllDay);
  
  // Group all overlapping events (both direct and regular overlaps)
  const directOverlapGroups = new Map<string, Task[]>();
  const regularTasks: Task[] = [];
  
  // Handle direct overlaps first
  timedTasks.forEach(task => {
    if (task.isDirectOverlap && task.overlapGroup) {
      if (!directOverlapGroups.has(task.overlapGroup)) {
        directOverlapGroups.set(task.overlapGroup, []);
      }
      directOverlapGroups.get(task.overlapGroup)!.push(task);
    }
  });
  
  // Get tasks that are NOT in direct overlap groups
  const directOverlapTaskIds = new Set<string>();
  directOverlapGroups.forEach(group => {
    group.forEach(task => directOverlapTaskIds.add(task.id));
  });
  
  // Only process regular overlaps for tasks that are NOT in direct overlap groups
  const tasksForRegularOverlap = timedTasks.filter(task => !directOverlapTaskIds.has(task.id));
  const regularOverlapGroups = groupOverlappingEvents(tasksForRegularOverlap);
  
  // Find tasks that are not in any overlap group
  const allGroupedTaskIds = new Set<string>();
  directOverlapGroups.forEach(group => {
    group.forEach(task => allGroupedTaskIds.add(task.id));
  });
  regularOverlapGroups.forEach(group => {
    group.forEach(task => allGroupedTaskIds.add(task.id));
  });
  
  // Only include tasks that are NOT in any overlap group
  timedTasks.forEach(task => {
    if (!allGroupedTaskIds.has(task.id)) {
      regularTasks.push(task);
    }
  });
  
  // Debug logging
  console.log('Direct overlap groups:', Array.from(directOverlapGroups.keys()));
  console.log('Regular overlap groups:', Array.from(regularOverlapGroups.keys()));
  console.log('Grouped task IDs:', Array.from(allGroupedTaskIds));
  console.log('Regular tasks count:', regularTasks.length);
  console.log('Regular tasks:', regularTasks.map(t => t.title));
  
  // Debug the overlap groups
  directOverlapGroups.forEach((tasks, key) => {
    console.log(`Direct group ${key}:`, tasks.map(t => `${t.id}-${t.title}`));
  });
  regularOverlapGroups.forEach((tasks, key) => {
    console.log(`Regular group ${key}:`, tasks.map(t => `${t.id}-${t.title}`));
  });
  
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
      {/* All-day tasks section */}
      {allDayTasks.length > 0 && (
        <View style={styles.allDayTasksSection}>
          {allDayTasks.map((task) => (
            <AllDayTaskCard
              key={task.id}
              task={task}
              theme={theme}
              onToggleComplete={onToggleComplete}
              onEditTask={handleEditTask}
            />
          ))}
        </View>
      )}
      
      <ScrollView 
        style={styles.timelineContent} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.scrollableTimeline}>
          <TimeRail theme={theme} selectedDate={selectedDate} />
          <View style={styles.tasksContainer}>
            <View style={styles.tasksContent}>
              {renderContinuousTimeline()}
              {regularTasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  theme={theme} 
                  tasks={regularTasks} 
                  onToggleComplete={onToggleComplete}
                  onEditTask={handleEditTask}
                />
              ))}
              {Array.from(directOverlapGroups.entries()).map(([groupKey, groupTasks]) => (
                <DirectOverlapCard
                  key={`direct-${groupKey}`}
                  tasks={groupTasks}
                  allTasks={timedTasks}
                  theme={theme}
                  onToggleComplete={onToggleComplete}
                  onEditTask={handleEditTask}
                />
              ))}
              {Array.from(regularOverlapGroups.entries()).map(([groupKey, groupTasks]) => (
                <DirectOverlapCard
                  key={`regular-${groupKey}`}
                  tasks={groupTasks}
                  allTasks={timedTasks}
                  theme={theme}
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
  allDayTasksSection: {
    paddingTop: 8,
    paddingBottom: 8,
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
