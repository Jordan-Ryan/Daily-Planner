import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Theme } from '../../../shared/types';
import { SubTask } from '../types';

interface AddTodoModalProps {
  theme: Theme;
  visible: boolean;
  onClose: () => void;
  onSave: (taskData: {
    icon: string;
    title: string;
    description: string;
    complete: boolean;
    estimatedDuration?: number;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high';
    category?: string;
    subTasks?: SubTask[];
  }) => void;
}

const ICON_OPTIONS = ['📝', '📋', '✅', '🎯', '💡', '🔔', '📅', '⏰', '🏷️', '⭐'];
const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: '#44aa44' },
  { value: 'medium', label: 'Medium', color: '#ffaa00' },
  { value: 'high', label: 'High', color: '#ff4444' },
];
const CATEGORY_OPTIONS = ['Personal', 'Work', 'Health', 'Learning', 'Shopping', 'Other'];

export const AddTodoModal: React.FC<AddTodoModalProps> = ({
  theme,
  visible,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    icon: '📝',
    title: '',
    description: '',
    complete: false,
    estimatedDuration: undefined as number | undefined,
    dueDate: '',
    priority: undefined as 'low' | 'medium' | 'high' | undefined,
    category: '',
  });

  const [subTasks, setSubTasks] = useState<SubTask[]>([]);

  const handleSave = () => {
    if (!formData.title.trim()) return;

    const taskData = {
      ...formData,
      estimatedDuration: formData.estimatedDuration || undefined,
      dueDate: formData.dueDate || undefined,
      priority: formData.priority || undefined,
      category: formData.category || undefined,
      subTasks: subTasks.length > 0 ? subTasks : undefined,
    };

    onSave(taskData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      icon: '📝',
      title: '',
      description: '',
      complete: false,
      estimatedDuration: undefined,
      dueDate: '',
      priority: undefined,
      category: '',
    });
    setSubTasks([]);
    onClose();
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

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, { color: theme.colors.text.secondary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
            New Todo
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
              Title *
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
              placeholder="What needs to be done?"
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
              placeholder="Add more details..."
              placeholderTextColor={theme.colors.text.tertiary}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Estimated Duration */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Estimated Duration
            </Text>
            <View style={styles.row}>
              <TextInput
                style={[
                  styles.input,
                  styles.durationInput,
                  {
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text.primary,
                    borderColor: theme.colors.border,
                  },
                ]}
                value={formData.estimatedDuration?.toString() || ''}
                onChangeText={(text) => {
                  const minutes = parseInt(text) || undefined;
                  setFormData({ ...formData, estimatedDuration: minutes });
                }}
                placeholder="30"
                placeholderTextColor={theme.colors.text.tertiary}
                keyboardType="numeric"
              />
              <Text style={[styles.durationLabel, { color: theme.colors.text.secondary }]}>
                minutes
              </Text>
            </View>
            {formData.estimatedDuration && (
              <Text style={[styles.durationPreview, { color: theme.colors.text.tertiary }]}>
                Estimated time: {formatDuration(formData.estimatedDuration)}
              </Text>
            )}
          </View>

          {/* Due Date */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Due Date
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
              value={formData.dueDate}
              onChangeText={(text) => setFormData({ ...formData, dueDate: text })}
              placeholder="YYYY-MM-DD (optional)"
              placeholderTextColor={theme.colors.text.tertiary}
            />
          </View>

          {/* Priority */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Priority
            </Text>
            <View style={styles.priorityGrid}>
              {PRIORITY_OPTIONS.map((priority) => (
                <TouchableOpacity
                  key={priority.value}
                  style={[
                    styles.priorityOption,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                    formData.priority === priority.value && {
                      backgroundColor: priority.color,
                      borderColor: priority.color,
                    },
                  ]}
                  onPress={() => setFormData({ ...formData, priority: priority.value as any })}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      {
                        color:
                          formData.priority === priority.value
                            ? '#FFFFFF'
                            : theme.colors.text.primary,
                      },
                    ]}
                  >
                    {priority.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Category
            </Text>
            <View style={styles.categoryGrid}>
              {CATEGORY_OPTIONS.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryOption,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                    formData.category === category && { backgroundColor: theme.colors.accent.blue },
                  ]}
                  onPress={() => setFormData({ ...formData, category })}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color:
                          formData.category === category
                            ? '#FFFFFF'
                            : theme.colors.text.primary,
                      },
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
    alignItems: 'center',
  },
  durationInput: {
    width: 80,
    marginRight: 12,
  },
  durationLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  durationPreview: {
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
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
    borderWidth: 1,
  },
  iconText: {
    fontSize: 20,
  },
  priorityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
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
});
