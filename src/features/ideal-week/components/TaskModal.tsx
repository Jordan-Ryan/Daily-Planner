import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import { Theme } from '../../../shared/types';
import { Task, SubTask } from '../types';

interface TaskModalProps {
  visible: boolean;
  task?: Task | null;
  theme: Theme;
  onSave: (task: Omit<Task, 'id'>) => void;
  onCancel: () => void;
}

const CALENDAR_OPTIONS = ['Personal', 'Work', 'Family', 'Health'];
const ICON_OPTIONS = ['⏰', '🐾', '📚', '🏊', '💼', '🏥', '🎯', '📝', '🏠', '🚗'];

export const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  task,
  theme,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState(() => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return {
      icon: task?.icon || '📝',
      title: task?.title || '',
      startDate: task?.startDate || today,
      startTime: task?.startTime || '09:00',
      endDate: task?.endDate || today,
      endTime: task?.endTime || '10:00',
      calendar: task?.calendar || 'Personal',
      location: task?.location || '',
      description: task?.description || '',
      complete: task?.complete || false,
      isRecurring: task?.isRecurring || false,
      isSystemTask: task?.isSystemTask || false,
    };
  });

  const [subTasks, setSubTasks] = useState<SubTask[]>(task?.subTasks || []);

  // Update form data when task prop changes
  useEffect(() => {
    if (task) {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        icon: task.icon,
        title: task.title,
        startDate: task.startDate,
        startTime: task.startTime,
        endDate: task.endDate,
        endTime: task.endTime,
        calendar: task.calendar,
        location: task.location || '',
        description: task.description || '',
        complete: task.complete,
        isRecurring: task.isRecurring || false,
        isSystemTask: task.isSystemTask || false,
      });
      setSubTasks(task.subTasks || []);
    } else {
      // Reset form for new task
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        icon: '📝',
        title: '',
        startDate: today,
        startTime: '09:00',
        endDate: today,
        endTime: '10:00',
        calendar: 'Personal',
        location: '',
        description: '',
        complete: false,
        isRecurring: false,
        isSystemTask: false,
      });
      setSubTasks([]);
    }
  }, [task]);

  const handleSave = () => {
    if (!formData.title.trim()) return;

    const taskData: Omit<Task, 'id'> = {
      ...formData,
      subTasks: subTasks.length > 0 ? subTasks : undefined,
      isOverlapping: false,
    };

    onSave(taskData);
  };

  const addSubTask = () => {
    const newSubTask: SubTask = {
      id: `sub-${Date.now()}`,
      title: '',
      completed: false,
    };
    setSubTasks([...subTasks, newSubTask]);
  };

  const updateSubTask = (index: number, field: keyof SubTask, value: any) => {
    const updated = [...subTasks];
    updated[index] = { ...updated[index], [field]: value };
    setSubTasks(updated);
  };

  const removeSubTask = (index: number) => {
    setSubTasks(subTasks.filter((_, i) => i !== index));
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, { color: theme.colors.text.secondary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
            {task ? 'Edit Task' : 'New Task'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, { color: theme.colors.accent.blue }]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Icon Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Icon
            </Text>
            <View style={styles.iconGrid}>
              {ICON_OPTIONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconOption,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                    formData.icon === icon && { backgroundColor: theme.colors.accent.blue },
                  ]}
                  onPress={() => setFormData({ ...formData, icon })}
                >
                  <Text style={styles.iconText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Title */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Title
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border,
                },
              ]}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Enter task title"
              placeholderTextColor={theme.colors.text.tertiary}
            />
          </View>

          {/* Date & Time */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Date & Time
            </Text>
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={[styles.fieldLabel, { color: theme.colors.text.secondary }]}>
                  Start Date
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.background.secondary,
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border.primary,
                    },
                  ]}
                  value={formData.startDate}
                  onChangeText={(text) => setFormData({ ...formData, startDate: text })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.colors.text.tertiary}
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={[styles.fieldLabel, { color: theme.colors.text.secondary }]}>
                  Start Time
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.background.secondary,
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border.primary,
                    },
                  ]}
                  value={formData.startTime}
                  onChangeText={(text) => setFormData({ ...formData, startTime: text })}
                  placeholder="HH:MM"
                  placeholderTextColor={theme.colors.text.tertiary}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={[styles.fieldLabel, { color: theme.colors.text.secondary }]}>
                  End Date
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.background.secondary,
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border.primary,
                    },
                  ]}
                  value={formData.endDate}
                  onChangeText={(text) => setFormData({ ...formData, endDate: text })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.colors.text.tertiary}
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={[styles.fieldLabel, { color: theme.colors.text.secondary }]}>
                  End Time
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.background.secondary,
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border.primary,
                    },
                  ]}
                  value={formData.endTime}
                  onChangeText={(text) => setFormData({ ...formData, endTime: text })}
                  placeholder="HH:MM"
                  placeholderTextColor={theme.colors.text.tertiary}
                />
              </View>
            </View>
          </View>

          {/* Calendar */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Calendar
            </Text>
            <View style={styles.calendarGrid}>
              {CALENDAR_OPTIONS.map((calendar) => (
                <TouchableOpacity
                  key={calendar}
                  style={[
                    styles.calendarOption,
                    {
                      backgroundColor:
                        formData.calendar === calendar
                          ? theme.colors.accent.blue
                          : theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  onPress={() => setFormData({ ...formData, calendar })}
                >
                  <Text
                    style={[
                      styles.calendarText,
                      {
                        color:
                          formData.calendar === calendar
                            ? '#FFFFFF'
                            : theme.colors.text.primary,
                      },
                    ]}
                  >
                    {calendar}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Location
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border,
                },
              ]}
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              placeholder="Enter location"
              placeholderTextColor={theme.colors.text.tertiary}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border,
                },
              ]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Enter description"
              placeholderTextColor={theme.colors.text.tertiary}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Sub Tasks */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                Sub Tasks
              </Text>
              <TouchableOpacity onPress={addSubTask} style={styles.addButton}>
                <Text style={[styles.addButtonText, { color: theme.colors.accent.blue }]}>
                  + Add
                </Text>
              </TouchableOpacity>
            </View>
            {subTasks.map((subTask, index) => (
              <View key={subTask.id} style={styles.subTaskRow}>
                <TextInput
                  style={[
                    styles.subTaskInput,
                    {
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  value={subTask.title}
                  onChangeText={(text) => updateSubTask(index, 'title', text)}
                  placeholder="Sub task"
                  placeholderTextColor={theme.colors.text.tertiary}
                />
                <TouchableOpacity
                  style={[
                    styles.removeButton,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    }
                  ]}
                  onPress={() => removeSubTask(index)}
                >
                  <Text style={[styles.removeButtonText, { color: theme.colors.text.secondary }]}>
                    ×
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Options */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Options
            </Text>
            <View style={styles.optionRow}>
              <Text style={[styles.optionLabel, { color: theme.colors.text.primary }]}>
                Recurring
              </Text>
              <Switch
                value={formData.isRecurring}
                onValueChange={(value) => setFormData({ ...formData, isRecurring: value })}
                trackColor={{ false: theme.colors.border.primary, true: theme.colors.accent.blue }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.optionRow}>
              <Text style={[styles.optionLabel, { color: theme.colors.text.primary }]}>
                System Task
              </Text>
              <Switch
                value={formData.isSystemTask}
                onValueChange={(value) => setFormData({ ...formData, isSystemTask: value })}
                trackColor={{ false: theme.colors.border.primary, true: theme.colors.accent.blue }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  calendarOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  calendarText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  subTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subTaskInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 14,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  removeButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});
