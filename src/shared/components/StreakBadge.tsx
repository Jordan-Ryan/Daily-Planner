import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../types';
import { StreakBadgeProps } from '../types/habits';

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  streak,
  bestStreak,
  theme,
  size = 'medium',
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.smallContainer,
          text: styles.smallText,
          bestText: styles.smallBestText,
        };
      case 'large':
        return {
          container: styles.largeContainer,
          text: styles.largeText,
          bestText: styles.largeBestText,
        };
      default:
        return {
          container: styles.mediumContainer,
          text: styles.mediumText,
          bestText: styles.mediumBestText,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const getStreakColor = () => {
    if (streak >= 30) return theme.colors.accent.green;
    if (streak >= 7) return theme.colors.accent.blue;
    if (streak >= 3) return theme.colors.accent.orange;
    return theme.colors.accent.purple;
  };

  return (
    <View style={[sizeStyles.container, { backgroundColor: getStreakColor() }]}>
      <Text style={[sizeStyles.text, { color: theme.colors.background }]}>
        {streak}
      </Text>
      {bestStreak > streak && (
        <Text style={[sizeStyles.bestText, { color: theme.colors.background }]}>
          /{bestStreak}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  smallContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 24,
    justifyContent: 'center',
  },
  mediumContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 32,
    justifyContent: 'center',
  },
  largeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 40,
    justifyContent: 'center',
  },
  smallText: {
    fontSize: 10,
    fontWeight: '700',
  },
  mediumText: {
    fontSize: 12,
    fontWeight: '700',
  },
  largeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  smallBestText: {
    fontSize: 8,
    fontWeight: '500',
    marginLeft: 1,
  },
  mediumBestText: {
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 2,
  },
  largeBestText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
  },
});
