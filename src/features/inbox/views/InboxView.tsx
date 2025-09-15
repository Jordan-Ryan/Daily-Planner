import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { Theme } from '../../../shared/types';
import { Task } from '../../timeline/types';
import { InboxStyles } from '../styles/InboxStyles';

interface InboxViewProps {
  theme: Theme;
  inboxTasks: Task[];
  incompleteTasks: Task[];
  completedTasks: Task[];
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

  const renderTask = (task: Task) => (
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
          <Text style={[
            styles.taskTitle,
            { color: theme.colors.text.primary },
            task.complete && styles.completedTask
          ]}>
            {task.title}
          </Text>
          {task.description && (
            <Text style={[styles.taskDescription, { color: theme.colors.text.secondary }]}>
              {task.description}
            </Text>
          )}
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
      
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 44 : 20 }]}>
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
