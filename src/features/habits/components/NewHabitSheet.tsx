import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Theme } from '../../../shared/types';
import { HabitPreset, NewHabitFormData } from '../types';

interface NewHabitSheetProps {
  visible: boolean;
  theme: Theme;
  presets: HabitPreset[];
  onClose: () => void;
  onSave: (habitData: NewHabitFormData) => void;
}

export const NewHabitSheet: React.FC<NewHabitSheetProps> = ({
  visible,
  theme,
  presets,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<NewHabitFormData>({
    name: '',
    iconKey: '⭐',
    color: '#4A90E2',
    isNegative: false,
    isTimed: false,
    timerDurationSec: undefined,
    schedule: {
      type: 'daily',
    },
    completionRules: {
      timesPerDayTarget: 1,
      allowCarryover: false,
      useTwoDayRule: false,
    },
  });

  const [selectedPreset, setSelectedPreset] = useState<HabitPreset | null>(null);
  const [scheduleType, setScheduleType] = useState<'daily' | 'weekdays' | 'xPerWeek' | 'xPerMonth' | 'everyN' | 'daysOfMonth'>('daily');

  const colors = [
    '#4A90E2', '#7ED321', '#F5A623', '#BD10E0', '#50E3C2', '#D0021B',
    '#9013FE', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'
  ];

  const icons = [
    '⭐', '🔥', '💪', '🧠', '❤️', '🎯', '📚', '🏃', '🧘', '💧',
    '🍎', '🦷', '🐕', '🧹', '📞', '📱', '🎵', '✍️', '🎨', '🌱'
  ];

  useEffect(() => {
    if (selectedPreset) {
      setFormData({
        name: selectedPreset.name,
        iconKey: selectedPreset.iconKey,
        color: selectedPreset.color,
        isNegative: selectedPreset.isNegative,
        isTimed: selectedPreset.isTimed,
        timerDurationSec: selectedPreset.timerDurationSec,
        schedule: {
          type: selectedPreset.schedule.type || 'daily',
          ...selectedPreset.schedule,
        },
        completionRules: {
          timesPerDayTarget: selectedPreset.completionRules.timesPerDayTarget || 1,
          allowCarryover: selectedPreset.completionRules.allowCarryover || false,
          useTwoDayRule: selectedPreset.completionRules.useTwoDayRule || false,
        },
      });
      setScheduleType(selectedPreset.schedule.type || 'daily');
    }
  }, [selectedPreset]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    if (formData.isTimed && !formData.timerDurationSec) {
      Alert.alert('Error', 'Please set a timer duration for timed habits');
      return;
    }

    // Validate schedule-specific fields
    if (scheduleType === 'xPerWeek' && !formData.schedule.perWeekTarget) {
      Alert.alert('Error', 'Please set a weekly target');
      return;
    }

    if (scheduleType === 'xPerMonth' && !formData.schedule.perMonthTarget) {
      Alert.alert('Error', 'Please set a monthly target');
      return;
    }

    if (scheduleType === 'everyN' && !formData.schedule.intervalN) {
      Alert.alert('Error', 'Please set an interval');
      return;
    }

    onSave(formData);
  };

  const handlePresetSelect = (preset: HabitPreset) => {
    setSelectedPreset(preset);
  };

  const updateFormData = (updates: Partial<NewHabitFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updateSchedule = (updates: Partial<NewHabitFormData['schedule']>) => {
    setFormData(prev => ({
      ...prev,
      schedule: { ...prev.schedule, ...updates }
    }));
  };

  const updateCompletionRules = (updates: Partial<NewHabitFormData['completionRules']>) => {
    setFormData(prev => ({
      ...prev,
      completionRules: { ...prev.completionRules, ...updates }
    }));
  };

  const getScheduleInputs = () => {
    switch (scheduleType) {
      case 'xPerWeek':
        return (
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>
              Times per week
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text.primary }]}
              value={formData.schedule.perWeekTarget?.toString() || ''}
              onChangeText={(text) => updateSchedule({ perWeekTarget: parseInt(text) || undefined })}
              placeholder="e.g., 3"
              keyboardType="numeric"
            />
          </View>
        );
      case 'xPerMonth':
        return (
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>
              Times per month
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text.primary }]}
              value={formData.schedule.perMonthTarget?.toString() || ''}
              onChangeText={(text) => updateSchedule({ perMonthTarget: parseInt(text) || undefined })}
              placeholder="e.g., 10"
              keyboardType="numeric"
            />
          </View>
        );
      case 'everyN':
        return (
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>
              Every N days
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text.primary }]}
              value={formData.schedule.intervalN?.toString() || ''}
              onChangeText={(text) => updateSchedule({ intervalN: parseInt(text) || undefined })}
              placeholder="e.g., 3"
              keyboardType="numeric"
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={[styles.cancelText, { color: theme.colors.text.secondary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            New Habit
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveButton, { backgroundColor: formData.color }]}
          >
            <Text style={[styles.saveText, { color: theme.colors.background }]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Presets */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Quick Start
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsContainer}>
              {presets.map((preset) => (
                <TouchableOpacity
                  key={preset.id}
                  style={[
                    styles.presetCard,
                    { 
                      backgroundColor: selectedPreset?.id === preset.id ? preset.color : theme.colors.surface,
                      borderColor: preset.color,
                    }
                  ]}
                  onPress={() => handlePresetSelect(preset)}
                >
                  <Text style={styles.presetIcon}>{preset.iconKey}</Text>
                  <Text style={[
                    styles.presetName,
                    { color: selectedPreset?.id === preset.id ? theme.colors.background : theme.colors.text.primary }
                  ]}>
                    {preset.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Basic Info
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text.primary }]}>
                Habit Name
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text.primary }]}
                value={formData.name}
                onChangeText={(text) => updateFormData({ name: text })}
                placeholder="e.g., Walk the dog"
                placeholderTextColor={theme.colors.text.tertiary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text.primary }]}>
                Icon
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconsContainer}>
                {icons.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconButton,
                      { 
                        backgroundColor: formData.iconKey === icon ? formData.color : theme.colors.surface,
                        borderColor: formData.color,
                      }
                    ]}
                    onPress={() => updateFormData({ iconKey: icon })}
                  >
                    <Text style={styles.iconText}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text.primary }]}>
                Color
              </Text>
              <View style={styles.colorsContainer}>
                {colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      formData.color === color && styles.selectedColorButton
                    ]}
                    onPress={() => updateFormData({ color })}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Habit Type */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Habit Type
            </Text>
            
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  { 
                    backgroundColor: formData.isNegative ? formData.color : theme.colors.surface,
                    borderColor: formData.color,
                  }
                ]}
                onPress={() => updateFormData({ isNegative: !formData.isNegative })}
              >
                <Text style={[
                  styles.toggleText,
                  { color: formData.isNegative ? theme.colors.background : theme.colors.text.primary }
                ]}>
                  {formData.isNegative ? 'Avoid Habit' : 'Positive Habit'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  { 
                    backgroundColor: formData.isTimed ? formData.color : theme.colors.surface,
                    borderColor: formData.color,
                  }
                ]}
                onPress={() => updateFormData({ isTimed: !formData.isTimed })}
              >
                <Text style={[
                  styles.toggleText,
                  { color: formData.isTimed ? theme.colors.background : theme.colors.text.primary }
                ]}>
                  {formData.isTimed ? 'Timed Habit' : 'Count Habit'}
                </Text>
              </TouchableOpacity>
            </View>

            {formData.isTimed && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text.primary }]}>
                  Timer Duration (seconds)
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text.primary }]}
                  value={formData.timerDurationSec?.toString() || ''}
                  onChangeText={(text) => updateFormData({ timerDurationSec: parseInt(text) || undefined })}
                  placeholder="e.g., 600 (10 minutes)"
                  keyboardType="numeric"
                />
              </View>
            )}
          </View>

          {/* Schedule */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Schedule
            </Text>
            
            <View style={styles.scheduleTypeContainer}>
              {(['daily', 'weekdays', 'xPerWeek', 'xPerMonth', 'everyN'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.scheduleTypeButton,
                    { 
                      backgroundColor: scheduleType === type ? formData.color : theme.colors.surface,
                      borderColor: formData.color,
                    }
                  ]}
                  onPress={() => {
                    setScheduleType(type);
                    updateSchedule({ type });
                  }}
                >
                  <Text style={[
                    styles.scheduleTypeText,
                    { color: scheduleType === type ? theme.colors.background : theme.colors.text.primary }
                  ]}>
                    {type === 'xPerWeek' ? 'X/Week' : type === 'xPerMonth' ? 'X/Month' : type === 'everyN' ? 'Every N' : type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {getScheduleInputs()}
          </View>

          {/* Completion Rules */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Completion Rules
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text.primary }]}>
                Times per day
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text.primary }]}
                value={formData.completionRules.timesPerDayTarget?.toString() || ''}
                onChangeText={(text) => updateCompletionRules({ timesPerDayTarget: parseInt(text) || 1 })}
                placeholder="e.g., 2"
                keyboardType="numeric"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    borderBottomColor: '#E5E5E5',
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  presetsContainer: {
    marginBottom: 8,
  },
  presetCard: {
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 2,
  },
  presetIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  presetName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  iconsContainer: {
    marginBottom: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 2,
  },
  iconText: {
    fontSize: 20,
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorButton: {
    borderColor: '#000',
    borderWidth: 3,
  },
  toggleContainer: {
    marginBottom: 12,
  },
  toggleButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
  },
  scheduleTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  scheduleTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  scheduleTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
