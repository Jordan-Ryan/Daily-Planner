import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Theme } from '../types';
import { MetricCardProps } from '../types/habits';
import { StreakBadge } from './StreakBadge';
import { ProgressRing } from './ProgressRing';

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  icon,
  color,
  progress,
  streak,
  bestStreak,
  theme,
  onPress,
  quickActions,
  isNegative = false,
  isTimed = false,
  isDueToday = false,
  nextDue,
}) => {
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate progress ring
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnimation]);

  const handlePress = () => {
    // Add subtle press animation
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress();
  };

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

  const getStatusText = () => {
    if (isDueToday) {
      return isNegative ? 'Avoid today' : 'Due today';
    }
    if (nextDue) {
      const nextDate = new Date(nextDue);
      const today = new Date();
      const diffDays = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        return 'Due tomorrow';
      } else if (diffDays <= 7) {
        return `Due in ${diffDays} days`;
      } else {
        return `Due ${nextDate.toLocaleDateString()}`;
      }
    }
    return 'Completed';
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
      <TouchableOpacity
        style={[
          styles.container,
          { 
            backgroundColor: theme.colors.surface,
            borderColor: isDueToday ? color : theme.colors.border,
            borderWidth: isDueToday ? 2 : 1,
          }
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <View style={styles.leftSection}>
            <View style={[styles.iconContainer, { borderColor: color }]}>
              <Text style={styles.iconText}>{icon}</Text>
            </View>
            
            <View style={styles.metricInfo}>
              <Text style={[styles.metricName, { color: theme.colors.text.primary }]}>
                {title}
              </Text>
              <Text style={[styles.statusText, { 
                color: isDueToday ? color : theme.colors.text.secondary 
              }]}>
                {getStatusText()}
              </Text>
            </View>
          </View>
          
          <View style={styles.rightSection}>
            <ProgressRing
              progress={progress}
              color={getProgressColor()}
              size={40}
              strokeWidth={4}
              theme={theme}
            />
            
            <StreakBadge
              streak={streak}
              bestStreak={bestStreak}
              theme={theme}
              size="small"
            />
          </View>
        </View>
        
        {quickActions && (
          <View style={styles.quickActions}>
            {quickActions.onComplete && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: color }]}
                onPress={quickActions.onComplete}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={[styles.actionText, { color: theme.colors.background }]}>
                  ✓
                </Text>
              </TouchableOpacity>
            )}
            
            {quickActions.onIncrement && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.surface, borderColor: color, borderWidth: 1 }]}
                onPress={quickActions.onIncrement}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={[styles.actionText, { color: color }]}>
                  +1
                </Text>
              </TouchableOpacity>
            )}
            
            {quickActions.onTimer && isTimed && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.surface, borderColor: color, borderWidth: 1 }]}
                onPress={quickActions.onTimer}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={[styles.actionText, { color: color }]}>
                  ⏱️
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
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
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  metricName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  rightSection: {
    alignItems: 'center',
    gap: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
