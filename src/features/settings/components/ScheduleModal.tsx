import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { Theme } from '../../../shared/types';
import { DaySchedule } from '../controllers/SettingsController';

interface ScheduleModalProps {
  theme: Theme;
  visible: boolean;
  selectedDays: string[];
  onClose: () => void;
  onSave: (wakeUpTime: string, sleepTime: string) => void;
}

const DAY_LABELS = {
  monday: 'M',
  tuesday: 'T',
  wednesday: 'W',
  thursday: 'T',
  friday: 'F',
  saturday: 'S',
  sunday: 'S',
};

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  theme,
  visible,
  selectedDays,
  onClose,
  onSave,
}) => {
  const [wakeUpTime, setWakeUpTime] = useState('06:00');
  const [sleepTime, setSleepTime] = useState('22:00');

  const handleSave = () => {
    onSave(wakeUpTime, sleepTime);
    onClose();
  };

  const handleClose = () => {
    setWakeUpTime('06:00');
    setSleepTime('22:00');
    onClose();
  };

  const formatSelectedDays = () => {
    return selectedDays.map(day => DAY_LABELS[day as keyof typeof DAY_LABELS]).join(' ');
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
            Set Schedule
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, { color: theme.colors.accent.blue }]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.selectedDaysContainer}>
            <Text style={[styles.selectedDaysLabel, { color: theme.colors.text.secondary }]}>
              Selected Days:
            </Text>
            <Text style={[styles.selectedDays, { color: theme.colors.text.primary }]}>
              {formatSelectedDays()}
            </Text>
          </View>

          <View style={styles.timeSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Wake Up Time
            </Text>
            <TextInput
              style={[
                styles.timeInput,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border,
                },
              ]}
              value={wakeUpTime}
              onChangeText={setWakeUpTime}
              placeholder="HH:MM"
              placeholderTextColor={theme.colors.text.tertiary}
            />
          </View>

          <View style={styles.timeSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Sleep Time
            </Text>
            <TextInput
              style={[
                styles.timeInput,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border,
                },
              ]}
              value={sleepTime}
              onChangeText={setSleepTime}
              placeholder="HH:MM"
              placeholderTextColor={theme.colors.text.tertiary}
            />
          </View>

          <View style={styles.previewContainer}>
            <Text style={[styles.previewLabel, { color: theme.colors.text.secondary }]}>
              Preview:
            </Text>
            <Text style={[styles.previewText, { color: theme.colors.text.primary }]}>
              {formatSelectedDays()} • {wakeUpTime} - {sleepTime}
            </Text>
          </View>
        </View>
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
    paddingTop: 24,
  },
  selectedDaysContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  selectedDaysLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  selectedDays: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 4,
  },
  timeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  timeInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  previewContainer: {
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
