import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Theme } from '../../../shared/types';
import { HealthMetric } from '../types';

interface HealthProgressBarProps {
  metric: HealthMetric;
  theme: Theme;
  onPress: (metric: HealthMetric) => void;
}

export const HealthProgressBar: React.FC<HealthProgressBarProps> = ({
  metric,
  theme,
  onPress,
}) => {
  const progressAnimation = useRef(new Animated.Value(0)).current;

  const progress = Math.min(metric.current / metric.goal, 1);
  const percentage = Math.round(progress * 100);

  useEffect(() => {
    // Animate progress bar fill
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnimation]);

  const getProgressColor = () => {
    if (progress >= 1) {
      return theme.colors.accent.green;
    } else if (progress >= 0.7) {
      return theme.colors.accent.blue;
    } else if (progress >= 0.4) {
      return theme.colors.accent.orange;
    } else {
      return theme.colors.accent.purple;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      onPress={() => onPress(metric)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { borderColor: metric.color }]}>
          <Text style={styles.iconText}>{metric.icon}</Text>
        </View>
        
        <View style={styles.metricInfo}>
          <View style={styles.metricHeader}>
            <Text style={[styles.metricName, { color: theme.colors.text.primary }]}>
              {metric.name}
            </Text>
            <Text style={[styles.metricValue, { color: theme.colors.text.secondary }]}>
              {metric.current} / {metric.goal} {metric.unit}
            </Text>
          </View>
          
          <View style={[styles.progressContainer, { backgroundColor: theme.colors.border }]}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  backgroundColor: getProgressColor(),
                  width: progressAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          
          <View style={styles.progressInfo}>
            <Text style={[styles.percentage, { color: theme.colors.text.tertiary }]}>
              {percentage}%
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  metricInfo: {
    flex: 1,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricName: {
    fontSize: 16,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 12,
    fontWeight: '500',
  },
});
