import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ScrollView } from 'react-native';
import { Theme, TabType } from '../types';

interface BottomTabBarProps {
  theme: Theme;
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
  onAddTask: () => void;
  onAddHabit?: () => void;
  onAddHealthItem?: () => void;
}

const tabs = [
  { id: 'inbox' as TabType, label: 'Inbox', icon: '📥' },
  { id: 'timeline' as TabType, label: 'Timeline', icon: '📅' },
  { id: 'ideal-week' as TabType, label: 'Ideal Week', icon: '🗓️' },
  { id: 'habits' as TabType, label: 'Habits', icon: '🔄' },
  { id: 'health' as TabType, label: 'Health', icon: '💪' },
  { id: 'settings' as TabType, label: 'Settings', icon: '⚙️' },
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  theme,
  activeTab,
  onTabPress,
  onAddTask,
  onAddHabit,
  onAddHealthItem,
}) => {
  const getTabStyle = (tab: TabType) => [
    styles.tab,
    activeTab === tab && { 
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    }
  ];

  const getTabTextStyle = (tab: TabType) => [
    styles.tabText,
    { 
      color: activeTab === tab ? theme.colors.text.primary : theme.colors.text.secondary,
      fontWeight: activeTab === tab ? '600' as const : '500' as const,
    }
  ];

  const handleAddButtonPress = () => {
    switch (activeTab) {
      case 'habits':
        onAddHabit?.();
        break;
      case 'health':
        onAddHealthItem?.();
        break;
      default:
        onAddTask();
        break;
    }
  };


  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.tabGroup, { backgroundColor: theme.colors.surface }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={getTabStyle(tab.id)}
              onPress={() => onTabPress(tab.id)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={getTabTextStyle(tab.id)}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddButtonPress}
        >
          <Text style={styles.addButtonIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
    position: 'relative',
  },
  tabGroup: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 80, // Add space for the plus button
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden', // Ensure content doesn't overflow the rounded container
  },
  scrollContent: {
    flexDirection: 'row',
    paddingHorizontal: 0,
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 2,
    minHeight: 48,
    minWidth: 60,
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabText: {
    fontSize: 10,
  },
  addButtonContainer: {
    position: 'absolute',
    right: 20,
    bottom: 32,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  addButtonIcon: {
    fontSize: 24,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});