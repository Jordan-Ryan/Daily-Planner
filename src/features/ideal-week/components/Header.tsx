import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../../shared/types';

interface HeaderProps {
  theme: Theme;
}

export const Header: React.FC<HeaderProps> = ({ theme }) => {
  return (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Ideal Week
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Design your perfect weekly routine
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 60,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
  },
});
