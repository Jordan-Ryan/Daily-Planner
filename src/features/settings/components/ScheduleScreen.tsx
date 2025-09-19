import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Theme } from '../../../shared/types';
import { SettingsControllerActions } from '../controllers/SettingsController';

interface ScheduleScreenProps {
  theme: Theme;
  actions: SettingsControllerActions;
  onBack: () => void;
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

const DAY_NAMES = Object.keys(DAY_LABELS) as (keyof typeof DAY_LABELS)[];

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({
  theme,
  actions,
  onBack,
}) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [wakeUpTime, setWakeUpTime] = useState('06:00');
  const [sleepTime, setSleepTime] = useState('22:00');

  const toggleDaySelection = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSave = () => {
    if (selectedDays.length > 0) {
      selectedDays.forEach(day => {
        actions.setWakeUpTime(day as any, wakeUpTime);
        actions.setSleepTime(day as any, sleepTime);
      });
    }
    onBack();
  };

  const formatSelectedDays = () => {
    return selectedDays.map(day => DAY_LABELS[day as keyof typeof DAY_LABELS]).join(' ');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="light" translucent={false} />
      
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: theme.colors.accent.blue }]}>
            ← Back
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
          Daily Schedule
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.daySelectorSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Select Days
          </Text>
          <View style={styles.daySelector}>
            {DAY_NAMES.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  {
                    backgroundColor: selectedDays.includes(day) 
                      ? theme.colors.accent.blue 
                      : theme.colors.surface,
                    borderColor: selectedDays.includes(day) 
                      ? theme.colors.accent.blue 
                      : theme.colors.border,
                  }
                ]}
                onPress={() => toggleDaySelection(day)}
              >
                <Text style={[
                  styles.dayButtonText,
                  {
                    color: selectedDays.includes(day) 
                      ? '#FFFFFF' 
                      : theme.colors.text.primary,
                  }
                ]}>
                  {DAY_LABELS[day]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {selectedDays.length > 0 && (
            <Text style={[styles.selectedDaysText, { color: theme.colors.text.secondary }]}>
              Selected: {formatSelectedDays()}
            </Text>
          )}
        </View>

        <View style={styles.timeSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Set Times
          </Text>
          
          <View style={styles.timeInputContainer}>
            <View style={styles.timeInputGroup}>
              <Text style={[styles.timeLabel, { color: theme.colors.text.secondary }]}>
                Wake Up
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
            
            <View style={styles.timeInputGroup}>
              <Text style={[styles.timeLabel, { color: theme.colors.text.secondary }]}>
                Bed Time
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
          </View>
        </View>

        <View style={styles.saveSection}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              {
                backgroundColor: selectedDays.length > 0 
                  ? theme.colors.accent.blue 
                  : theme.colors.surface,
                borderColor: selectedDays.length > 0 
                  ? theme.colors.accent.blue 
                  : theme.colors.border,
              }
            ]}
            onPress={handleSave}
            disabled={selectedDays.length === 0}
          >
            <Text style={[
              styles.saveButtonText,
              {
                color: selectedDays.length > 0 
                  ? '#FFFFFF' 
                  : theme.colors.text.tertiary,
              }
            ]}>
              Save Schedule
            </Text>
          </TouchableOpacity>
          
          {selectedDays.length === 0 && (
            <Text style={[styles.saveHint, { color: theme.colors.text.tertiary }]}>
              Select days to enable save
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 60, // Balance the back button
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  daySelectorSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedDaysText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  timeSection: {
    marginBottom: 32,
  },
  timeInputContainer: {
    gap: 20,
  },
  timeInputGroup: {
    gap: 8,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '500',
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
  saveSection: {
    marginTop: 'auto',
    paddingBottom: 32,
  },
  saveButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveHint: {
    fontSize: 14,
    textAlign: 'center',
  },
});
