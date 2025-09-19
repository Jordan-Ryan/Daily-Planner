import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../types';
import { Theme } from '../../../shared/types';
import { getEventColor, getEventBackgroundColor, getEventBorderColor, getEventHeight, getEventTopPosition, formatTimeDisplay, detectBorderOverlaps } from '../services/timelineUtils';

interface DirectOverlapCardProps {
  tasks: Task[]; // All tasks in the overlap group
  allTasks: Task[]; // All tasks in the timeline for border overlap detection
  theme: Theme;
  onToggleComplete: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

export const DirectOverlapCard: React.FC<DirectOverlapCardProps> = ({ 
  tasks, 
  allTasks,
  theme, 
  onToggleComplete, 
  onEditTask 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTask = tasks[currentIndex];
  const height = getEventHeight(currentTask);
  const topPosition = getEventTopPosition(currentTask, allTasks);
  const borderOverlaps = detectBorderOverlaps(currentTask, allTasks);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : tasks.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < tasks.length - 1 ? prev + 1 : 0));
  };

  return (
    <View 
      style={[
        styles.container,
        {
          top: topPosition,
          height: height,
        }
      ]}
    >
      <View style={styles.taskRow}>
        <View
          style={[
            styles.taskBar,
            {
              backgroundColor: getEventBackgroundColor(currentTask.calendar, true),
              borderColor: getEventBorderColor(currentTask.calendar),
              height: height,
              borderTopWidth: borderOverlaps.topBorderOverlap ? 0 : 2,
              borderBottomWidth: borderOverlaps.bottomBorderOverlap ? 0 : 2,
              borderLeftWidth: 2,
              borderRightWidth: 2,
            },
          ]}
        >
          <View style={styles.taskIconInBar}>
            <Text style={{ fontSize: 14, color: getEventColor(currentTask.calendar) }}>
              {currentTask.icon}
            </Text>
          </View>
        </View>
        
        <View style={styles.taskDetails}>
          <Text style={[styles.taskTitle, { color: theme.colors.text.primary }]}>
            {currentTask.title}
          </Text>
          <Text style={[styles.taskTime, { color: theme.colors.text.secondary }]}>
            {formatTimeDisplay(currentTask.startTime, currentTask.endTime)}
          </Text>
          <Text style={[styles.taskCalendar, { color: getEventColor(currentTask.calendar) }]}>
            {currentTask.calendar}
          </Text>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.arrowButton} 
            onPress={handlePrevious}
            disabled={tasks.length <= 1}
          >
            <Text style={[styles.arrowText, { color: theme.colors.text.tertiary }]}>
              ↑
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.counterText, { color: theme.colors.text.tertiary }]}>
            {currentIndex + 1}/{tasks.length}
          </Text>
          
          <TouchableOpacity 
            style={styles.arrowButton} 
            onPress={handleNext}
            disabled={tasks.length <= 1}
          >
            <Text style={[styles.arrowText, { color: theme.colors.text.tertiary }]}>
              ↓
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.taskCheckbox} 
          onPress={(e) => {
            e.stopPropagation();
            onToggleComplete(currentTask.id);
          }}
        >
          <View style={[
            styles.checkbox,
            {
              borderColor: getEventBorderColor(currentTask.calendar),
              backgroundColor: currentTask.complete ? getEventBorderColor(currentTask.calendar) : 'transparent'
            }
          ]}>
            {currentTask.complete && (
              <Text style={{ fontSize: 12, color: '#000000' }}>✓</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 15,
    paddingRight: 0,
    height: '100%',
  },
  taskBar: {
    width: 40,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: 52,
  },
  taskIconInBar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 52,
  },
  taskDetails: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  taskTime: {
    fontSize: 12,
    fontWeight: '400',
  },
  taskCalendar: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  controlsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 8,
  },
  arrowButton: {
    padding: 4,
    marginVertical: 2,
  },
  arrowText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  counterText: {
    fontSize: 10,
    fontWeight: '500',
    marginVertical: 2,
  },
  taskCheckbox: {
    paddingLeft: 8,
    paddingRight: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
});
