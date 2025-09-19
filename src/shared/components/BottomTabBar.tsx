import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ScrollView } from 'react-native';
import { Theme, TabType } from '../types';
import { GlassEffect } from './GlassEffect';

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
      backgroundColor: theme.colors.background === '#FFFFFF' 
        ? 'rgba(0, 0, 0, 0.1)' 
        : 'rgba(255, 255, 255, 0.15)',
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
    <View style={styles.container}>
      <View style={styles.navigationWrapper}>
        <GlassEffect
          theme={theme}
          intensity="heavy"
          borderRadius={25}
          style={styles.glassContainer}
        >
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
        </GlassEffect>

        {activeTab !== 'settings' && (
          <View style={styles.addButtonContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddButtonPress}
            >
              <Text style={styles.addButtonIcon}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingBottom: 34, // iPhone safe area bottom padding
    alignItems: 'center',
  },
  navigationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400, // Limit width to center the navigation
  },
  glassContainer: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 12, // Space between nav and + button
    overflow: 'hidden',
    // Enhanced glass effect
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 16,
  },
  scrollContent: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 2,
    minHeight: 48,
    minWidth: 56,
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '500',
  },
  addButtonContainer: {
    // Positioned next to the navigation bar, not overlapping
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1C1C1E', // Dark background like in the image
    justifyContent: 'center',
    alignItems: 'center',
    // Enhanced shadow for floating effect
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonIcon: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
  },
});