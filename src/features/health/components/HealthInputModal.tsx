import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Theme } from '../../../shared/types';
import { HealthMetric } from '../types';

interface HealthInputModalProps {
  visible: boolean;
  metric: HealthMetric | null;
  theme: Theme;
  onClose: () => void;
  onSave: (metricId: string, value: number) => void;
}

export const HealthInputModal: React.FC<HealthInputModalProps> = ({
  visible,
  metric,
  theme,
  onClose,
  onSave,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (metric) {
      setInputValue(metric.current.toString());
    }
  }, [metric]);

  useEffect(() => {
    const value = parseFloat(inputValue);
    setIsValid(!isNaN(value) && value >= 0);
  }, [inputValue]);

  const handleSave = () => {
    if (!metric || !isValid) return;

    const value = parseFloat(inputValue);
    if (value < 0) {
      Alert.alert('Invalid Input', 'Please enter a positive number');
      return;
    }

    onSave(metric.id, value);
    onClose();
  };

  const handleQuickAdd = (amount: number) => {
    if (!metric) return;
    
    const currentValue = parseFloat(inputValue) || 0;
    const newValue = currentValue + amount;
    setInputValue(newValue.toString());
  };

  const getQuickAddButtons = () => {
    if (!metric) return [];

    switch (metric.id) {
      case 'water':
        return [250, 500, 1000]; // ml
      case 'steps':
        return [1000, 2000, 5000];
      case 'calories':
        return [100, 200, 500];
      case 'carbs':
      case 'protein':
      case 'fat':
        return [10, 25, 50]; // grams
      case 'running':
        return [2, 5, 10]; // km
      case 'gym':
        return [1, 2, 3]; // sessions
      default:
        return [1, 5, 10];
    }
  };

  const getQuickAddLabels = () => {
    if (!metric) return [];

    switch (metric.id) {
      case 'water':
        return ['250ml', '500ml', '1L'];
      case 'steps':
        return ['1K', '2K', '5K'];
      case 'calories':
        return ['100', '200', '500'];
      case 'carbs':
      case 'protein':
      case 'fat':
        return ['10g', '25g', '50g'];
      case 'running':
        return ['2km', '5km', '10km'];
      case 'gym':
        return ['1', '2', '3'];
      default:
        return ['+1', '+5', '+10'];
    }
  };

  if (!metric) return null;

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
            Update {metric.name}
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            style={[
              styles.saveButton,
              { backgroundColor: isValid ? metric.color : theme.colors.border }
            ]}
            disabled={!isValid}
          >
            <Text style={[
              styles.saveText,
              { color: isValid ? theme.colors.background : theme.colors.text.tertiary }
            ]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={[styles.iconContainer, { borderColor: metric.color }]}>
            <Text style={styles.iconText}>{metric.icon}</Text>
          </View>

          <Text style={[styles.metricName, { color: theme.colors.text.primary }]}>
            {metric.name}
          </Text>
          
          <Text style={[styles.goalText, { color: theme.colors.text.secondary }]}>
            Goal: {metric.goal} {metric.unit}
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: isValid ? metric.color : theme.colors.border,
                  color: theme.colors.text.primary,
                }
              ]}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={`Enter ${metric.unit}`}
              placeholderTextColor={theme.colors.text.tertiary}
              keyboardType="numeric"
              autoFocus
            />
            <Text style={[styles.unitLabel, { color: theme.colors.text.secondary }]}>
              {metric.unit}
            </Text>
          </View>

          <View style={styles.quickAddContainer}>
            <Text style={[styles.quickAddTitle, { color: theme.colors.text.secondary }]}>
              Quick Add:
            </Text>
            <View style={styles.quickAddButtons}>
              {getQuickAddButtons().map((amount, index) => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.quickAddButton,
                    { backgroundColor: theme.colors.surface, borderColor: metric.color }
                  ]}
                  onPress={() => handleQuickAdd(amount)}
                >
                  <Text style={[styles.quickAddText, { color: metric.color }]}>
                    +{getQuickAddLabels()[index]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.progressPreview}>
            <Text style={[styles.progressLabel, { color: theme.colors.text.secondary }]}>
              Progress Preview:
            </Text>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: metric.color,
                    width: `${Math.min((parseFloat(inputValue) || 0) / metric.goal * 100, 100)}%`,
                  }
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.text.tertiary }]}>
              {Math.round((parseFloat(inputValue) || 0) / metric.goal * 100)}% of goal
            </Text>
          </View>
        </View>
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
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 32,
  },
  metricName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  goalText: {
    fontSize: 16,
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 32,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  unitLabel: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  quickAddContainer: {
    width: '100%',
    marginBottom: 32,
  },
  quickAddTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  quickAddButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAddButton: {
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  quickAddText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressPreview: {
    width: '100%',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
