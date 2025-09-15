import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Theme } from '../../../shared/types';
import { Habit, CompletionEvent } from '../types';
import { StreakBadge } from '../../../shared/components/StreakBadge';
import { ProgressRing } from '../../../shared/components/ProgressRing';
import { TimerOverlay } from './TimerOverlay';

interface HabitDetailScreenProps {
  habit: Habit;
  theme: Theme;
  completionEvents: CompletionEvent[];
  onComplete: (amount: number, durationSec?: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const HabitDetailScreen: React.FC<HabitDetailScreenProps> = ({
  habit,
  theme,
  completionEvents,
  onComplete,
  onEdit,
  onDelete,
  onClose,
}) => {
  const [timerVisible, setTimerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const today = new Date().toISOString().split('T')[0];
  const todayEvents = completionEvents.filter(e => e.timestamp.startsWith(today));
  const todayProgress = todayEvents.reduce((sum, e) => sum + (e.amount || 1), 0);
  const target = habit.completionRules.timesPerDayTarget || 1;
  const isCompleted = todayProgress >= target;

  const getCompletionRate = () => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const recentEvents = completionEvents.filter(e => 
      new Date(e.timestamp) >= last30Days
    );
    
    const completedDays = new Set(
      recentEvents.map(e => e.timestamp.split('T')[0])
    ).size;
    
    return Math.round((completedDays / 30) * 100);
  };

  const getHistoryGrid = () => {
    const grid = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayEvents = completionEvents.filter(e => e.timestamp.startsWith(dateStr));
      const dayProgress = dayEvents.reduce((sum, e) => sum + (e.amount || 1), 0);
      const isDayCompleted = dayProgress >= target;
      
      grid.push({
        date: dateStr,
        day: date.getDate(),
        isCompleted: isDayCompleted,
        progress: Math.min(dayProgress / target, 1),
        isToday: i === 0,
      });
    }
    
    return grid;
  };

  const handleQuickComplete = () => {
    if (habit.isTimed) {
      setTimerVisible(true);
    } else {
      onComplete(1);
    }
  };

  const handleQuickIncrement = () => {
    if (todayProgress < target) {
      onComplete(1);
    }
  };

  const handleTimerComplete = (durationSec: number) => {
    onComplete(1, durationSec);
    setTimerVisible(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  const getScheduleDescription = () => {
    switch (habit.schedule.type) {
      case 'daily':
        return 'Every day';
      case 'weekdays':
        return 'Monday to Friday';
      case 'xPerWeek':
        return `${habit.schedule.perWeekTarget} times per week`;
      case 'xPerMonth':
        return `${habit.schedule.perMonthTarget} times per month`;
      case 'everyN':
        return `Every ${habit.schedule.intervalN} days`;
      case 'daysOfMonth':
        return 'Specific days of month';
      default:
        return 'Custom schedule';
    }
  };

  const historyGrid = getHistoryGrid();
  const completionRate = getCompletionRate();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="light" translucent={false} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={[styles.closeText, { color: theme.colors.text.secondary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
          Habit Details
        </Text>
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <Text style={[styles.editText, { color: habit.color }]}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Habit Info Card */}
        <View style={[styles.habitCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.habitHeader}>
            <View style={[styles.iconContainer, { borderColor: habit.color }]}>
              <Text style={styles.habitIcon}>{habit.iconKey}</Text>
            </View>
            <View style={styles.habitInfo}>
              <Text style={[styles.habitName, { color: theme.colors.text.primary }]}>
                {habit.name}
              </Text>
              <Text style={[styles.scheduleText, { color: theme.colors.text.secondary }]}>
                {getScheduleDescription()}
              </Text>
            </View>
            <StreakBadge
              streak={habit.state.currentStreak}
              bestStreak={habit.state.bestStreak}
              theme={theme}
              size="large"
            />
          </View>

          {/* Progress Ring */}
          <View style={styles.progressSection}>
            <ProgressRing
              progress={Math.min(todayProgress / target, 1)}
              color={habit.color}
              size={80}
              strokeWidth={6}
              theme={theme}
            />
            <View style={styles.progressInfo}>
              <Text style={[styles.progressText, { color: theme.colors.text.primary }]}>
                {todayProgress} / {target}
              </Text>
              <Text style={[styles.progressLabel, { color: theme.colors.text.secondary }]}>
                {habit.isNegative ? 'Avoided' : 'Completed'} today
              </Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            {habit.isTimed ? (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: habit.color }]}
                onPress={handleQuickComplete}
              >
                <Text style={[styles.actionText, { color: theme.colors.background }]}>
                  ⏱️ Start Timer
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: habit.color }]}
                  onPress={handleQuickComplete}
                  disabled={isCompleted}
                >
                  <Text style={[styles.actionText, { color: theme.colors.background }]}>
                    ✓ Complete
                  </Text>
                </TouchableOpacity>
                {target > 1 && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.surface, borderColor: habit.color, borderWidth: 1 }]}
                    onPress={handleQuickIncrement}
                    disabled={todayProgress >= target}
                  >
                    <Text style={[styles.actionText, { color: habit.color }]}>
                      +1
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>

        {/* Stats Card */}
        <View style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
            Statistics
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: habit.color }]}>
                {habit.state.currentStreak}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                Current Streak
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: habit.color }]}>
                {habit.state.bestStreak}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                Best Streak
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: habit.color }]}>
                {completionRate}%
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                Completion Rate
              </Text>
            </View>
          </View>
        </View>

        {/* History Card */}
        <View style={[styles.historyCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
            30-Day History
          </Text>
          <View style={styles.historyGrid}>
            {historyGrid.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.historyDay,
                  {
                    backgroundColor: day.isCompleted 
                      ? habit.color 
                      : day.isToday 
                        ? theme.colors.border 
                        : theme.colors.background,
                    borderColor: day.isToday ? habit.color : 'transparent',
                    borderWidth: day.isToday ? 2 : 0,
                  }
                ]}
                onPress={() => setSelectedDate(new Date(day.date))}
              >
                <Text style={[
                  styles.historyDayText,
                  { 
                    color: day.isCompleted 
                      ? theme.colors.background 
                      : theme.colors.text.primary 
                  }
                ]}>
                  {day.day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.historyLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: habit.color }]} />
              <Text style={[styles.legendText, { color: theme.colors.text.secondary }]}>
                Completed
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.legendText, { color: theme.colors.text.secondary }]}>
                Today
              </Text>
            </View>
          </View>
        </View>

        {/* Delete Button */}
        <TouchableOpacity
          style={[styles.deleteButton, { borderColor: theme.colors.accent.orange }]}
          onPress={handleDelete}
        >
          <Text style={[styles.deleteText, { color: theme.colors.accent.orange }]}>
            Delete Habit
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Timer Overlay */}
      <TimerOverlay
        visible={timerVisible}
        habit={habit}
        theme={theme}
        onClose={() => setTimerVisible(false)}
        onComplete={handleTimerComplete}
      />
    </View>
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
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
  },
  editText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  habitCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  habitIcon: {
    fontSize: 28,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  scheduleText: {
    fontSize: 16,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressInfo: {
    marginLeft: 20,
  },
  progressText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  historyCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 16,
  },
  historyDay: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyDayText: {
    fontSize: 12,
    fontWeight: '500',
  },
  historyLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
  },
  deleteButton: {
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
