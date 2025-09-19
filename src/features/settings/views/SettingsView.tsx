import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Theme } from '../../../shared/types';
import { SettingsData, SettingsControllerActions } from '../controllers/SettingsController';
import { SettingsStyles } from '../styles/SettingsStyles';
import { ScheduleScreen } from '../components/ScheduleScreen';

interface SettingsViewProps {
  theme: Theme;
  settings: SettingsData;
  actions: SettingsControllerActions;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ theme, settings, actions }) => {
  const styles = SettingsStyles(theme);
  const [showScheduleScreen, setShowScheduleScreen] = useState(false);

  if (showScheduleScreen) {
    return (
      <ScheduleScreen
        theme={theme}
        actions={actions}
        onBack={() => setShowScheduleScreen(false)}
      />
    );
  }

  const SettingItem = ({ 
    title, 
    subtitle, 
    onPress, 
    rightElement 
  }: {
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: theme.colors.text.secondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement || (
        <Text style={[styles.chevron, { color: theme.colors.text.tertiary }]}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="light" translucent={false} />
      
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 44 : 20 }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
          Settings
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
            Schedule
          </Text>
          
          <SettingItem
            title="Daily Schedule"
            subtitle="Set wake up and bed times"
            onPress={() => setShowScheduleScreen(true)}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
            Calendar Connections
          </Text>
          
          <SettingItem
            title="Google Calendar"
            subtitle="Not connected"
            onPress={() => {
              // TODO: Open Google Calendar connection
              console.log('Connect Google Calendar');
            }}
          />
          
          <SettingItem
            title="Apple Calendar"
            subtitle="Not connected"
            onPress={() => {
              // TODO: Open Apple Calendar connection
              console.log('Connect Apple Calendar');
            }}
          />
          
          <SettingItem
            title="Outlook Calendar"
            subtitle="Not connected"
            onPress={() => {
              // TODO: Open Outlook Calendar connection
              console.log('Connect Outlook Calendar');
            }}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
            Preferences
          </Text>
          
          <SettingItem
            title="Dark Mode"
            subtitle="Use dark theme"
            rightElement={
              <Switch
                value={settings.darkMode}
                onValueChange={actions.setDarkMode}
                trackColor={{ false: '#767577', true: theme.colors.primary }}
                thumbColor={settings.darkMode ? '#FFFFFF' : '#f4f3f4'}
              />
            }
          />
          
          <SettingItem
            title="Notifications"
            subtitle="Get task reminders"
            rightElement={
              <Switch
                value={settings.notifications}
                onValueChange={actions.setNotifications}
                trackColor={{ false: '#767577', true: theme.colors.primary }}
                thumbColor={settings.notifications ? '#FFFFFF' : '#f4f3f4'}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
            About
          </Text>
          
          <SettingItem
            title="Version"
            subtitle="1.0.0"
          />
          
          <SettingItem
            title="Privacy Policy"
            onPress={() => {
              // TODO: Open privacy policy
              console.log('Open privacy policy');
            }}
          />
          
          <SettingItem
            title="Terms of Service"
            onPress={() => {
              // TODO: Open terms of service
              console.log('Open terms of service');
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};
