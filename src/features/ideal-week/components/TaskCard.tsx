import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../types';
import { Theme } from '../../../shared/types';
import { getEventHeight, getEventTopPosition, formatTimeDisplay } from '../services/idealWeekUtils';

interface TaskCardProps {
  task: Task;
  theme: Theme;
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, theme, tasks, onToggleComplete, onEditTask }) => {
  const topPosition = getEventTopPosition(task, tasks);
  const height = getEventHeight(task);

  return (
    <TouchableOpacity 
      style={[
        styles.taskContainer,
        {
          top: topPosition,
          height: height,
        }
      ]}
      onPress={() => onEditTask(task)}
      activeOpacity={0.7}
    >
      {task.isOverlapping && (
        <Text style={[styles.overlappingText, { color: theme.colors.text.tertiary }]}>
          Tasks are overlapping
        </Text>
      )}
      <View style={styles.taskRow}>
        <View
          style={[
            styles.taskBar,
            {
              backgroundColor: '#2A2A2A',
              borderColor: '#666666',
              height: height,
            },
          ]}
        >
          <View style={styles.taskIconInBar}>
            <Text style={{ fontSize: 14, color: '#FFFFFF' }}>
              {task.icon}
            </Text>
          </View>
        </View>
        <View style={styles.taskDetails}>
          <Text style={[styles.taskTitle, { color: theme.colors.text.primary }]}>
            {task.title}
          </Text>
          <Text style={[styles.taskTime, { color: theme.colors.text.secondary }]}>
            {formatTimeDisplay(task.startTime, task.endTime)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  overlappingText: {
    fontSize: 12,
    marginLeft: 55,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    paddingVertical: 8,
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
