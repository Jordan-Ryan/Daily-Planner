import React, { useState } from 'react';
import { View, Text, Platform, ScrollView, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Theme } from '../../../shared/types';
import { HabitsStyles } from '../styles/HabitsStyles';
import { useHabits } from '../hooks/useHabits';
import { MetricCard } from '../../../shared/components/MetricCard';
import { HealthRoutingModal } from '../components/HealthRoutingModal';
import { TimerOverlay } from '../components/TimerOverlay';
import { GlassButton } from '../../../shared/components/GlassButton';

interface HabitsViewProps {
  theme: Theme;
}

export const HabitsView: React.FC<HabitsViewProps> = ({ theme }) => {
  const styles = HabitsStyles(theme);
  const {
    habits,
    loading,
    filter,
    setFilter,
    createHabit,
    completeHabit,
    getHabitProgress,
    getNextDueDate,
    getHabitPresets,
    isHealthRelatedHabit,
    getHabitsByCategory,
  } = useHabits();

  const [healthRoutingModalVisible, setHealthRoutingModalVisible] = useState(false);
  const [pendingHabitData, setPendingHabitData] = useState<any>(null);
  const [timerVisible, setTimerVisible] = useState(false);
  const [selectedHabitForTimer, setSelectedHabitForTimer] = useState<any>(null);

  const { dueToday, completed } = getHabitsByCategory();

  const handleCreateHabit = (habitData: any) => {
    // Check if this is a health-related habit
    if (isHealthRelatedHabit(habitData)) {
      setPendingHabitData(habitData);
      setHealthRoutingModalVisible(true);
      return;
    }

    // Create the habit
    createHabit(habitData);
  };

  const handleSwitchToHealth = () => {
    setHealthRoutingModalVisible(false);
    // TODO: Navigate to Health tab with prefilled data
    console.log('Navigate to Health tab with data:', pendingHabitData);
  };

  const handleHealthRoutingCancel = () => {
    setHealthRoutingModalVisible(false);
    setPendingHabitData(null);
  };

  const handleHabitPress = (habit: any) => {
    // TODO: Navigate to habit detail screen
    console.log('Navigate to habit detail:', habit.id);
  };

  const handleQuickComplete = (habit: any) => {
    completeHabit(habit.id, 1);
  };

  const handleQuickIncrement = (habit: any) => {
    const progress = getHabitProgress(habit.id);
    const target = habit.completionRules.timesPerDayTarget || 1;
    const current = progress?.amount || 0;
    
    if (current < target) {
      completeHabit(habit.id, 1);
    }
  };

  const handleTimerStart = (habit: any) => {
    setSelectedHabitForTimer(habit);
    setTimerVisible(true);
  };

  const handleTimerComplete = (durationSec: number) => {
    if (selectedHabitForTimer) {
      completeHabit(selectedHabitForTimer.id, 1, durationSec);
    }
    setTimerVisible(false);
    setSelectedHabitForTimer(null);
  };

  const getFilterButtonStyle = (filterType: string) => [
    styles.filterButton,
    {
      backgroundColor: filter === filterType ? theme.colors.primary : theme.colors.surface,
      borderColor: theme.colors.border,
    }
  ];

  const getFilterTextStyle = (filterType: string) => [
    styles.filterText,
    {
      color: filter === filterType ? theme.colors.background : theme.colors.text.primary,
    }
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <StatusBar style="light" translucent={false} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
          Loading habits...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="light" translucent={false} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 0 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Habits</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Build positive daily routines
          </Text>
        </View>

        {/* Filter buttons */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
          style={styles.filterScrollContainer}
        >
          <GlassButton
            title="All"
            onPress={() => setFilter('all')}
            theme={theme}
            variant={filter === 'all' ? 'primary' : 'secondary'}
            size="small"
            intensity="light"
            style={[styles.filterButton, { paddingHorizontal: 6, marginRight: -2 }]}
          />
          <GlassButton
            title="Due Today"
            onPress={() => setFilter('dueToday')}
            theme={theme}
            variant={filter === 'dueToday' ? 'primary' : 'secondary'}
            size="small"
            intensity="light"
            style={[styles.filterButton, { paddingHorizontal: 6, marginRight: -2 }]}
          />
          <GlassButton
            title="Timed"
            onPress={() => setFilter('timed')}
            theme={theme}
            variant={filter === 'timed' ? 'primary' : 'secondary'}
            size="small"
            intensity="light"
            style={[styles.filterButton, { paddingHorizontal: 6, marginRight: -2 }]}
          />
          <GlassButton
            title="Negative"
            onPress={() => setFilter('negative')}
            theme={theme}
            variant={filter === 'negative' ? 'primary' : 'secondary'}
            size="small"
            intensity="light"
            style={[styles.filterButton, { paddingHorizontal: 6 }]}
          />
        </ScrollView>

        {/* Due Today Section */}
        {dueToday.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              🔥 Due Today
            </Text>
            {dueToday.map((habit) => {
              const progress = getHabitProgress(habit.id);
              const nextDue = getNextDueDate(habit.id);
              const progressValue = progress ? (progress.amount || 0) / (habit.completionRules.timesPerDayTarget || 1) : 0;

              return (
                <MetricCard
                  key={habit.id}
                  title={habit.name}
                  icon={habit.iconKey}
                  color={habit.color}
                  progress={Math.min(progressValue, 1)}
                  streak={habit.state.currentStreak}
                  bestStreak={habit.state.bestStreak}
                  theme={theme}
                  onPress={() => handleHabitPress(habit)}
                  quickActions={{
                    onComplete: () => handleQuickComplete(habit),
                    onIncrement: () => handleQuickIncrement(habit),
                    onTimer: habit.isTimed ? () => handleTimerStart(habit) : undefined,
                  }}
                  isNegative={habit.isNegative}
                  isTimed={habit.isTimed}
                  isDueToday={true}
                  nextDue={nextDue?.toISOString()}
                />
              );
            })}
          </View>
        )}

        {/* Completed/Other Habits Section */}
        {completed.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              ✅ {filter === 'all' ? 'All Habits' : 'Completed'}
            </Text>
            {completed.map((habit) => {
              const progress = getHabitProgress(habit.id);
              const nextDue = getNextDueDate(habit.id);
              const progressValue = progress ? (progress.amount || 0) / (habit.completionRules.timesPerDayTarget || 1) : 0;

              return (
                <MetricCard
                  key={habit.id}
                  title={habit.name}
                  icon={habit.iconKey}
                  color={habit.color}
                  progress={Math.min(progressValue, 1)}
                  streak={habit.state.currentStreak}
                  bestStreak={habit.state.bestStreak}
                  theme={theme}
                  onPress={() => handleHabitPress(habit)}
                  quickActions={{
                    onComplete: () => handleQuickComplete(habit),
                    onIncrement: () => handleQuickIncrement(habit),
                    onTimer: habit.isTimed ? () => handleTimerStart(habit) : undefined,
                  }}
                  isNegative={habit.isNegative}
                  isTimed={habit.isTimed}
                  isDueToday={false}
                  nextDue={nextDue?.toISOString()}
                />
              );
            })}
          </View>
        )}

        {/* Empty state */}
        {habits.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateTitle, { color: theme.colors.text.primary }]}>
              No habits yet
            </Text>
            <Text style={[styles.emptyStateText, { color: theme.colors.text.secondary }]}>
              Start building positive habits by tapping the plus button below
            </Text>
          </View>
        )}

      </ScrollView>



      {/* Health Routing Modal */}
      <HealthRoutingModal
        visible={healthRoutingModalVisible}
        habitName={pendingHabitData?.name || ''}
        theme={theme}
        onSwitchToHealth={handleSwitchToHealth}
        onCancel={handleHealthRoutingCancel}
      />

      {/* Timer Overlay */}
      <TimerOverlay
        visible={timerVisible}
        habit={selectedHabitForTimer}
        theme={theme}
        onClose={() => {
          setTimerVisible(false);
          setSelectedHabitForTimer(null);
        }}
        onComplete={handleTimerComplete}
      />
    </View>
  );
};
