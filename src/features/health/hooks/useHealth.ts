import { useState, useEffect, useCallback } from 'react';
import { HealthMetric, HealthMetricType } from '../types';
import { HealthService } from '../services/healthService';

export const useHealth = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<HealthMetric | null>(null);
  const [inputModalVisible, setInputModalVisible] = useState(false);

  const healthService = HealthService.getInstance();

  const loadMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const todayMetrics = healthService.getTodayMetrics();
      setMetrics(todayMetrics);
    } catch (error) {
      console.error('Error loading health metrics:', error);
    } finally {
      setLoading(false);
    }
  }, [healthService]);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  const updateMetric = useCallback((metricId: HealthMetricType, value: number) => {
    healthService.updateMetric(metricId, value);
    loadMetrics(); // Reload to get updated data
  }, [healthService, loadMetrics]);

  const updateGoal = useCallback((metricId: HealthMetricType, goal: number) => {
    healthService.updateGoal(metricId, goal);
    loadMetrics(); // Reload to get updated data
  }, [healthService, loadMetrics]);

  const handleMetricPress = useCallback((metric: HealthMetric) => {
    setSelectedMetric(metric);
    setInputModalVisible(true);
  }, []);


  const handleInputModalClose = useCallback(() => {
    setInputModalVisible(false);
    setSelectedMetric(null);
  }, []);

  const handleInputModalSave = useCallback((metricId: string, value: number) => {
    updateMetric(metricId as HealthMetricType, value);
  }, [updateMetric]);

  const getMetricsByCategory = useCallback((category: 'nutrition' | 'fitness' | 'wellness') => {
    return metrics.filter(metric => metric.category === category);
  }, [metrics]);

  return {
    metrics,
    loading,
    selectedMetric,
    inputModalVisible,
    updateMetric,
    updateGoal,
    handleMetricPress,
    handleInputModalClose,
    handleInputModalSave,
    getMetricsByCategory,
    refreshMetrics: loadMetrics,
  };
};
