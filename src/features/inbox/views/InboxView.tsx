import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { Theme } from '../../../shared/types';
import { TodoTask } from '../types';
import { InboxStyles } from '../styles/InboxStyles';

interface InboxViewProps {
  theme: Theme;
  inboxTasks: TodoTask[];
  incompleteTasks: TodoTask[];
  completedTasks: TodoTask[];
  onToggleTaskComplete: (taskId: string) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({
  theme,
  inboxTasks,
  incompleteTasks,
  completedTasks,
  onToggleTaskComplete,
}) => {
  const styles = InboxStyles(theme);

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatDueDate = (dueDate: string): string => {
    const date = new Date(dueDate);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0) return `In ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#44aa44';
      default: return theme.colors.text.tertiary;
    }
  };

  const renderTask = (task: TodoTask) => (
    <TouchableOpacity
      key={task.id}
      style={[styles.taskItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => onToggleTaskComplete(task.id)}
    >
      <View style={styles.taskContent}>
        <View style={styles.taskIcon}>
          <Text style={styles.iconText}>{task.icon}</Text>
        </View>
        <View style={styles.taskDetails}>
          <View style={styles.taskHeader}>
            <Text style={[
              styles.taskTitle,
              { color: theme.colors.text.primary },
              task.complete && styles.completedTask
            ]}>
              {task.title}
            </Text>
            {task.priority && (
              <View style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(task.priority) }
              ]}>
                <Text style={styles.priorityText}>
                  {task.priority.toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          
          {task.description && (
            <Text style={[styles.taskDescription, { color: theme.colors.text.secondary }]}>
              {task.description}
            </Text>
          )}
          
          <View style={styles.taskMeta}>
            {task.estimatedDuration && (
              <Text style={[styles.metaText, { color: theme.colors.text.tertiary }]}>
                ⏱️ {formatDuration(task.estimatedDuration)}
              </Text>
            )}
            {task.dueDate && (
              <Text style={[
                styles.metaText,
                { 
                  color: new Date(task.dueDate) < new Date() && !task.complete 
                    ? '#ff4444' 
                    : theme.colors.text.tertiary 
                }
              ]}>
                📅 {formatDueDate(task.dueDate)}
              </Text>
            )}
            {task.category && (
              <Text style={[styles.metaText, { color: theme.colors.text.tertiary }]}>
                🏷️ {task.category}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.checkbox,
            {
              borderColor: theme.colors.primary,
              backgroundColor: task.complete ? theme.colors.primary : 'transparent'
            }
          ]}
          onPress={() => onToggleTaskComplete(task.id)}
        >
          {task.complete && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="light" translucent={false} />
      
      <View style={[styles.header, { paddingTop: 0 }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
          Inbox
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.text.secondary }]}>
          {incompleteTasks.length} tasks
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {incompleteTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              To Do
            </Text>
            {incompleteTasks.map(renderTask)}
          </View>
        )}

        {completedTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              Completed
            </Text>
            {completedTasks.map(renderTask)}
          </View>
        )}

        {inboxTasks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyIcon, { color: theme.colors.text.tertiary }]}>📥</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
              No tasks in inbox
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.text.secondary }]}>
              Add tasks without specific dates or times here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
