import React from 'react';
import { View, Text, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Theme } from '../../../shared/types';
import { HealthStyles } from '../styles/HealthStyles';
import { HealthProgressBar } from '../components/HealthProgressBar';
import { HealthInputModal } from '../components/HealthInputModal';
import { useHealth } from '../hooks/useHealth';

interface HealthViewProps {
  theme: Theme;
}

export const HealthView: React.FC<HealthViewProps> = ({ theme }) => {
  const styles = HealthStyles(theme);
  const {
    metrics,
    loading,
    selectedMetric,
    inputModalVisible,
    handleMetricPress,
    handleInputModalClose,
    handleInputModalSave,
    getMetricsByCategory,
  } = useHealth();

  const nutritionMetrics = getMetricsByCategory('nutrition');
  const fitnessMetrics = getMetricsByCategory('fitness');
  const wellnessMetrics = getMetricsByCategory('wellness');

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <StatusBar style="light" translucent={false} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
          Loading health data...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="light" translucent={false} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: Platform.OS === 'ios' ? 44 : 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Health</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Track your daily wellness goals
          </Text>
        </View>

        {nutritionMetrics.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              🍎 Nutrition
            </Text>
            {nutritionMetrics.map((metric) => (
              <HealthProgressBar
                key={metric.id}
                metric={metric}
                theme={theme}
                onPress={handleMetricPress}
              />
            ))}
          </View>
        )}

        {fitnessMetrics.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              💪 Fitness
            </Text>
            {fitnessMetrics.map((metric) => (
              <HealthProgressBar
                key={metric.id}
                metric={metric}
                theme={theme}
                onPress={handleMetricPress}
              />
            ))}
          </View>
        )}

        {wellnessMetrics.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              🌱 Wellness
            </Text>
            {wellnessMetrics.map((metric) => (
              <HealthProgressBar
                key={metric.id}
                metric={metric}
                theme={theme}
                onPress={handleMetricPress}
              />
            ))}
          </View>
        )}

      </ScrollView>

      <HealthInputModal
        visible={inputModalVisible}
        metric={selectedMetric}
        theme={theme}
        onClose={handleInputModalClose}
        onSave={handleInputModalSave}
      />
    </View>
  );
};
