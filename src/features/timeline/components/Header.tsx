import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Theme } from '../../../shared/types';

interface HeaderProps {
  theme: Theme;
  selectedDate: Date;
  onCalendarPress: () => void;
  noTopPadding?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ theme, selectedDate, onCalendarPress, noTopPadding = false }) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <View style={[styles.header, { 
      backgroundColor: theme.colors.background,
      paddingTop: noTopPadding ? 0 : 16,
      paddingBottom: 16
    }]}>
      <View style={styles.dateContainer}>
        <Text style={[styles.dateTitle, { color: theme.colors.text.primary }]}>
          {formatDate(selectedDate)}
        </Text>
      </View>
      <TouchableOpacity style={styles.calendarButton} onPress={onCalendarPress}>
        <Text style={[styles.calendarIcon, { color: theme.colors.text.secondary }]}>📅</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    minHeight: 60,
  },
  dateContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
  },
  calendarButton: {
    padding: 8,
    borderRadius: 8,
  },
  calendarIcon: {
    fontSize: 24,
  },
});
