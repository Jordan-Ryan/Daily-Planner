import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from './src/shared/hooks/useTheme';
import { TabType } from './src/shared/types';
import { TimelineScreen } from './src/features/timeline/components/TimelineScreen';
import { InboxScreen } from './src/features/inbox/components/InboxScreen';
import { SettingsScreen } from './src/features/settings/components/SettingsScreen';
import { IdealWeekScreen } from './src/features/ideal-week/components/IdealWeekScreen';
import { HabitsScreen } from './src/features/habits/components/HabitsScreen';
import { HealthScreen } from './src/features/health/components/HealthScreen';
import { BottomTabBar } from './src/shared/components/BottomTabBar';
import { AddTaskModal } from './src/shared/components/AddTaskModal';
import { NewHabitSheet } from './src/features/habits/components/NewHabitSheet';
import { HealthInputModal } from './src/features/health/components/HealthInputModal';
import { HabitsService } from './src/features/habits/services/habitsService';

export default function App() {
  const { theme } = useTheme(true);
  const [activeTab, setActiveTab] = useState<TabType>('timeline');
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [isAddHabitModalVisible, setIsAddHabitModalVisible] = useState(false);
  const [isAddHealthModalVisible, setIsAddHealthModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleAddTask = (taskData: any) => {
    console.log('Adding task:', taskData);
    // TODO: Implement task creation logic
    setIsAddTaskModalVisible(false);
  };

  const handleAddHabit = () => {
    setIsAddHabitModalVisible(true);
  };

  const handleAddHealthItem = () => {
    setIsAddHealthModalVisible(true);
  };

  const handleCreateHabit = (habitData: any) => {
    console.log('Creating habit:', habitData);
    const habitsService = HabitsService.getInstance();
    habitsService.createHabit(habitData);
    setIsAddHabitModalVisible(false);
  };

  const handleCreateHealthItem = (metricId: string, value: number) => {
    console.log('Creating health item:', { metricId, value });
    // TODO: Implement health item creation logic
    setIsAddHealthModalVisible(false);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'inbox':
        return <InboxScreen onAddTask={() => setIsAddTaskModalVisible(true)} />;
      case 'timeline':
        return <TimelineScreen onDateChange={setSelectedDate} />;
      case 'ideal-week':
        return <IdealWeekScreen onDateChange={(day) => console.log('Selected day:', day)} />;
      case 'habits':
        return <HabitsScreen onAddTask={() => setIsAddTaskModalVisible(true)} />;
      case 'health':
        return <HealthScreen onAddTask={() => setIsAddTaskModalVisible(true)} />;
      case 'settings':
        return <SettingsScreen onAddTask={() => setIsAddTaskModalVisible(true)} />;
      default:
        return <TimelineScreen onDateChange={setSelectedDate} />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {renderActiveScreen()}
      </View>
      
      <BottomTabBar
        theme={theme}
        activeTab={activeTab}
        onTabPress={setActiveTab}
        onAddTask={() => setIsAddTaskModalVisible(true)}
        onAddHabit={handleAddHabit}
        onAddHealthItem={handleAddHealthItem}
      />

      <AddTaskModal
        theme={theme}
        visible={isAddTaskModalVisible}
        selectedDate={selectedDate}
        onClose={() => setIsAddTaskModalVisible(false)}
        onSave={handleAddTask}
      />

      <NewHabitSheet
        visible={isAddHabitModalVisible}
        theme={theme}
        presets={HabitsService.getInstance().getHabitPresets()}
        onClose={() => setIsAddHabitModalVisible(false)}
        onSave={handleCreateHabit}
      />

      {/* Health Input Modal - For now, we'll create a placeholder metric */}
      {isAddHealthModalVisible && (
        <HealthInputModal
          visible={isAddHealthModalVisible}
          metric={{
            id: 'new-health-item',
            name: 'New Health Item',
            icon: '💪',
            current: 0,
            goal: 1,
            unit: 'times',
            color: '#4A90E2',
            category: 'fitness'
          }}
          theme={theme}
          onClose={() => setIsAddHealthModalVisible(false)}
          onSave={handleCreateHealthItem}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
