import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
  Vibration,
} from 'react-native';
import { Theme } from '../../../shared/types';
import { Habit } from '../types';

interface TimerOverlayProps {
  visible: boolean;
  habit: Habit | null;
  theme: Theme;
  onClose: () => void;
  onComplete: (durationSec: number) => void;
}

export const TimerOverlay: React.FC<TimerOverlayProps> = ({
  visible,
  habit,
  theme,
  onClose,
  onComplete,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (habit && visible) {
      setTimeRemaining(habit.timerDurationSec || 0);
      setHasCompleted(false);
      setIsRunning(false);
      setIsPaused(false);
      progressAnimation.setValue(0);
    }
  }, [habit, visible, progressAnimation]);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            handleTimerComplete();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  useEffect(() => {
    if (habit && habit.timerDurationSec) {
      const progress = 1 - (timeRemaining / habit.timerDurationSec);
      Animated.timing(progressAnimation, {
        toValue: progress,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [timeRemaining, habit, progressAnimation]);

  useEffect(() => {
    if (hasCompleted) {
      // Pulse animation when completed
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnimation.setValue(1);
    }
  }, [hasCompleted, pulseAnimation]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    setHasCompleted(true);
    
    // Vibrate on completion
    Vibration.vibrate([0, 500, 200, 500]);
    
    // Auto-complete after 2 seconds
    setTimeout(() => {
      if (habit) {
        onComplete(habit.timerDurationSec || 0);
        onClose();
      }
    }, 2000);
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setHasCompleted(false);
    if (habit) {
      setTimeRemaining(habit.timerDurationSec || 0);
    }
    progressAnimation.setValue(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressColor = () => {
    if (hasCompleted) return theme.colors.accent.green;
    if (timeRemaining <= (habit?.timerDurationSec || 0) * 0.2) return theme.colors.accent.orange;
    return habit?.color || theme.colors.primary;
  };

  if (!habit) return null;

  const totalDuration = habit.timerDurationSec || 0;
  const progress = totalDuration > 0 ? 1 - (timeRemaining / totalDuration) : 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.container,
            { 
              backgroundColor: theme.colors.surface,
              transform: [{ scale: pulseAnimation }]
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.habitName, { color: theme.colors.text.primary }]}>
              {habit.name}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeText, { color: theme.colors.text.secondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Timer Circle */}
          <View style={styles.timerContainer}>
            <View style={[styles.timerCircle, { borderColor: theme.colors.border }]}>
              {/* Progress Ring */}
              <View style={[styles.progressRing, { borderColor: getProgressColor() }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      borderColor: getProgressColor(),
                      transform: [{ rotate: `${progress * 360}deg` }],
                    }
                  ]}
                />
              </View>
              
              {/* Time Display */}
              <View style={styles.timeDisplay}>
                <Text style={[styles.timeText, { color: theme.colors.text.primary }]}>
                  {formatTime(timeRemaining)}
                </Text>
                {hasCompleted && (
                  <Text style={[styles.completeText, { color: theme.colors.accent.green }]}>
                    Complete!
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Controls */}
          {!hasCompleted && (
            <View style={styles.controls}>
              {!isRunning && !isPaused && (
                <TouchableOpacity
                  style={[styles.controlButton, styles.startButton, { backgroundColor: habit.color }]}
                  onPress={handleStart}
                >
                  <Text style={[styles.controlButtonText, { color: theme.colors.background }]}>
                    Start
                  </Text>
                </TouchableOpacity>
              )}

              {isRunning && (
                <TouchableOpacity
                  style={[styles.controlButton, styles.pauseButton, { backgroundColor: theme.colors.accent.orange }]}
                  onPress={handlePause}
                >
                  <Text style={[styles.controlButtonText, { color: theme.colors.background }]}>
                    Pause
                  </Text>
                </TouchableOpacity>
              )}

              {isPaused && (
                <View style={styles.pausedControls}>
                  <TouchableOpacity
                    style={[styles.controlButton, styles.resumeButton, { backgroundColor: habit.color }]}
                    onPress={handleStart}
                  >
                    <Text style={[styles.controlButtonText, { color: theme.colors.background }]}>
                      Resume
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.controlButton, styles.resetButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]}
                    onPress={handleReset}
                  >
                    <Text style={[styles.controlButtonText, { color: theme.colors.text.primary }]}>
                      Reset
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Progress Info */}
          <View style={styles.progressInfo}>
            <Text style={[styles.progressLabel, { color: theme.colors.text.secondary }]}>
              {Math.round(progress * 100)}% Complete
            </Text>
            <Text style={[styles.durationLabel, { color: theme.colors.text.tertiary }]}>
              Target: {formatTime(totalDuration)}
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  habitName: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    fontWeight: '600',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  progressFill: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  timeDisplay: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  completeText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  controls: {
    alignItems: 'center',
    marginBottom: 24,
  },
  controlButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  startButton: {
    // backgroundColor set via style prop
  },
  pauseButton: {
    // backgroundColor set via style prop
  },
  pausedControls: {
    flexDirection: 'row',
    gap: 16,
  },
  resumeButton: {
    // backgroundColor set via style prop
  },
  resetButton: {
    // backgroundColor set via style prop
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressInfo: {
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  durationLabel: {
    fontSize: 14,
  },
});
