import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { Theme } from '../../../shared/types';
import { HealthRoutingModalProps } from '../types';

export const HealthRoutingModal: React.FC<HealthRoutingModalProps> = ({
  visible,
  habitName,
  theme,
  onSwitchToHealth,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🏥</Text>
          </View>
          
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Health Item
          </Text>
          
          <Text style={[styles.message, { color: theme.colors.text.secondary }]}>
            "{habitName}" appears to be a health or fitness related habit. 
            Health-related habits should be created in the Health tab to access 
            system health data and integrations.
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: theme.colors.border }]}
              onPress={onCancel}
            >
              <Text style={[styles.buttonText, { color: theme.colors.text.primary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.switchButton, { backgroundColor: theme.colors.primary }]}
              onPress={onSwitchToHealth}
            >
              <Text style={[styles.buttonText, { color: theme.colors.background }]}>
                Switch to Health
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  switchButton: {
    // backgroundColor set via style prop
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});


