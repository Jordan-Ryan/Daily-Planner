import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../types';
import { Theme } from '../../../shared/types';
import { getEventBorderColor } from '../services/timelineUtils';

interface AllDayTaskCardProps {
  task: Task;
  theme: Theme;
  onToggleComplete: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

export const AllDayTaskCard: React.FC<AllDayTaskCardProps> = ({ 
  task, 
  theme, 
  onToggleComplete, 
  onEditTask 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.allDayTaskContainer, { backgroundColor: theme.colors.surface }]}
      onPress={() => onEditTask(task)}
      activeOpacity={0.7}
    >
      <View style={styles.allDayTaskContent}>
        <View style={[styles.iconContainer, { borderColor: getEventBorderColor(task.calendar) }]}>
          <Text style={styles.iconText}>{task.icon}</Text>
        </View>
        <View style={styles.taskInfo}>
          <Text style={[styles.taskTitle, { color: theme.colors.text.primary }]}>
            {task.title}
          </Text>
          {task.description && (
            <Text style={[styles.taskDescription, { color: theme.colors.text.secondary }]}>
              {task.description}
            </Text>
          )}
        </View>
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={(e) => {
            e.stopPropagation();
            onToggleComplete(task.id);
          }}
        >
          <View style={[
            styles.checkbox,
            {
              borderColor: getEventBorderColor(task.calendar),
              backgroundColor: task.complete ? getEventBorderColor(task.calendar) : 'transparent'
            }
          ]}>
            {task.complete && (
              <Text style={[styles.checkmark, { color: theme.colors.background }]}>✓</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  allDayTaskContainer: {
    marginHorizontal: 20,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
  },
  allDayTaskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  taskDescription: {
    fontSize: 14,
    fontWeight: '400',
  },
  checkboxContainer: {
    padding: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
