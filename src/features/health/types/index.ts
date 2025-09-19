// Health feature types

export interface HealthMetric {
  id: string;
  name: string;
  icon: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
  category: 'nutrition' | 'fitness' | 'wellness';
}

export interface HealthData {
  date: string; // YYYY-MM-DD format
  metrics: HealthMetric[];
}

export interface HealthGoal {
  metricId: string;
  goal: number;
  unit: string;
}

export type HealthMetricType = 
  | 'calories'
  | 'carbs'
  | 'protein'
  | 'fat'
  | 'steps'
  | 'running'
  | 'gym'
  | 'water';

export interface HealthMetricConfig {
  id: HealthMetricType;
  name: string;
  icon: string;
  defaultGoal: number;
  unit: string;
  color: string;
  category: 'nutrition' | 'fitness' | 'wellness';
}

