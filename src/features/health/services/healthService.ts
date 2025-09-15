import AsyncStorage from '@react-native-async-storage/async-storage';
import { HealthMetric, HealthData, HealthMetricConfig, HealthMetricType } from '../types';

const HEALTH_DATA_KEY = 'health_data';
const WEEKLY_HEALTH_DATA_KEY = 'weekly_health_data';
const HEALTH_GOALS_KEY = 'health_goals';

export const HEALTH_METRIC_CONFIGS: HealthMetricConfig[] = [
  {
    id: 'calories',
    name: 'Calories',
    icon: '🔥',
    defaultGoal: 2000,
    unit: 'kcal',
    color: '#FF6B6B',
    category: 'nutrition',
  },
  {
    id: 'carbs',
    name: 'Carbs',
    icon: '🍞',
    defaultGoal: 250,
    unit: 'g',
    color: '#4ECDC4',
    category: 'nutrition',
  },
  {
    id: 'protein',
    name: 'Protein',
    icon: '🥩',
    defaultGoal: 150,
    unit: 'g',
    color: '#45B7D1',
    category: 'nutrition',
  },
  {
    id: 'fat',
    name: 'Fat',
    icon: '🥑',
    defaultGoal: 65,
    unit: 'g',
    color: '#96CEB4',
    category: 'nutrition',
  },
  {
    id: 'steps',
    name: 'Steps',
    icon: '👟',
    defaultGoal: 10000,
    unit: 'steps',
    color: '#FECA57',
    category: 'fitness',
  },
  {
    id: 'running',
    name: 'Running',
    icon: '🏃‍♂️',
    defaultGoal: 20,
    unit: 'km',
    color: '#FF9FF3',
    category: 'fitness',
  },
  {
    id: 'gym',
    name: 'Gym',
    icon: '💪',
    defaultGoal: 5,
    unit: 'sessions',
    color: '#54A0FF',
    category: 'fitness',
  },
  {
    id: 'water',
    name: 'Water',
    icon: '💧',
    defaultGoal: 2000,
    unit: 'ml',
    color: '#5F27CD',
    category: 'wellness',
  },
];

export class HealthService {
  private static instance: HealthService;
  private healthData: Map<string, HealthData> = new Map();
  private weeklyHealthData: Map<string, HealthData> = new Map(); // For weekly metrics
  private healthGoals: Map<string, number> = new Map();

  private constructor() {
    this.loadData();
  }

  public static getInstance(): HealthService {
    if (!HealthService.instance) {
      HealthService.instance = new HealthService();
    }
    return HealthService.instance;
  }

  private async loadData(): Promise<void> {
    try {
      const [healthDataString, weeklyHealthDataString, healthGoalsString] = await Promise.all([
        AsyncStorage.getItem(HEALTH_DATA_KEY),
        AsyncStorage.getItem(WEEKLY_HEALTH_DATA_KEY),
        AsyncStorage.getItem(HEALTH_GOALS_KEY),
      ]);

      if (healthDataString) {
        const data = JSON.parse(healthDataString);
        this.healthData = new Map(Object.entries(data));
      }

      if (weeklyHealthDataString) {
        const data = JSON.parse(weeklyHealthDataString);
        this.weeklyHealthData = new Map(Object.entries(data));
      }

      if (healthGoalsString) {
        const goals = JSON.parse(healthGoalsString);
        this.healthGoals = new Map(Object.entries(goals));
      }
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  }

  private async saveData(): Promise<void> {
    try {
      const healthDataObject = Object.fromEntries(this.healthData);
      const weeklyHealthDataObject = Object.fromEntries(this.weeklyHealthData);
      const healthGoalsObject = Object.fromEntries(this.healthGoals);

      await Promise.all([
        AsyncStorage.setItem(HEALTH_DATA_KEY, JSON.stringify(healthDataObject)),
        AsyncStorage.setItem(WEEKLY_HEALTH_DATA_KEY, JSON.stringify(weeklyHealthDataObject)),
        AsyncStorage.setItem(HEALTH_GOALS_KEY, JSON.stringify(healthGoalsObject)),
      ]);
    } catch (error) {
      console.error('Error saving health data:', error);
    }
  }

  private getCurrentWeekKey(): string {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    return startOfWeek.toISOString().split('T')[0];
  }

  public getTodayMetrics(): HealthMetric[] {
    const today = new Date().toISOString().split('T')[0];
    const currentWeek = this.getCurrentWeekKey();
    const todayData = this.healthData.get(today);
    const weeklyData = this.weeklyHealthData.get(currentWeek);

    // Get daily metrics (most metrics)
    const dailyMetrics = HEALTH_METRIC_CONFIGS.filter(config => 
      !['running', 'gym'].includes(config.id)
    ).map(config => {
      const todayMetric = todayData?.metrics.find(m => m.id === config.id);
      return {
        id: config.id,
        name: config.name,
        icon: config.icon,
        current: todayMetric?.current || 0,
        goal: this.healthGoals.get(config.id) || config.defaultGoal,
        unit: config.unit,
        color: config.color,
        category: config.category,
      };
    });

    // Get weekly metrics (running and gym)
    const weeklyMetrics = HEALTH_METRIC_CONFIGS.filter(config => 
      ['running', 'gym'].includes(config.id)
    ).map(config => {
      const weeklyMetric = weeklyData?.metrics.find(m => m.id === config.id);
      return {
        id: config.id,
        name: config.name,
        icon: config.icon,
        current: weeklyMetric?.current || 0,
        goal: this.healthGoals.get(config.id) || config.defaultGoal,
        unit: config.unit,
        color: config.color,
        category: config.category,
      };
    });

    return [...dailyMetrics, ...weeklyMetrics];
  }

  public updateMetric(metricId: HealthMetricType, value: number): void {
    const isWeeklyMetric = ['running', 'gym'].includes(metricId);
    
    if (isWeeklyMetric) {
      // Handle weekly metrics
      const currentWeek = this.getCurrentWeekKey();
      const weeklyData = this.weeklyHealthData.get(currentWeek);

      if (weeklyData) {
        const metricIndex = weeklyData.metrics.findIndex(m => m.id === metricId);
        if (metricIndex !== -1) {
          weeklyData.metrics[metricIndex].current = value;
        }
      } else {
        // Create new week data for weekly metrics
        const weeklyMetrics = HEALTH_METRIC_CONFIGS.filter(config => 
          ['running', 'gym'].includes(config.id)
        ).map(config => ({
          id: config.id,
          name: config.name,
          icon: config.icon,
          current: config.id === metricId ? value : 0,
          goal: this.healthGoals.get(config.id) || config.defaultGoal,
          unit: config.unit,
          color: config.color,
          category: config.category,
        }));

        this.weeklyHealthData.set(currentWeek, { date: currentWeek, metrics: weeklyMetrics });
      }
    } else {
      // Handle daily metrics
      const today = new Date().toISOString().split('T')[0];
      const todayData = this.healthData.get(today);

      if (todayData) {
        const metricIndex = todayData.metrics.findIndex(m => m.id === metricId);
        if (metricIndex !== -1) {
          todayData.metrics[metricIndex].current = value;
        }
      } else {
        // Create new day data for daily metrics
        const dailyMetrics = HEALTH_METRIC_CONFIGS.filter(config => 
          !['running', 'gym'].includes(config.id)
        ).map(config => ({
          id: config.id,
          name: config.name,
          icon: config.icon,
          current: config.id === metricId ? value : 0,
          goal: this.healthGoals.get(config.id) || config.defaultGoal,
          unit: config.unit,
          color: config.color,
          category: config.category,
        }));

        this.healthData.set(today, { date: today, metrics: dailyMetrics });
      }
    }

    this.saveData();
  }

  public updateGoal(metricId: HealthMetricType, goal: number): void {
    this.healthGoals.set(metricId, goal);
    this.saveData();
  }

  public getGoal(metricId: HealthMetricType): number {
    return this.healthGoals.get(metricId) || HEALTH_METRIC_CONFIGS.find(c => c.id === metricId)?.defaultGoal || 0;
  }

  public getMetricConfig(metricId: HealthMetricType): HealthMetricConfig | undefined {
    return HEALTH_METRIC_CONFIGS.find(config => config.id === metricId);
  }

  public getAllMetricConfigs(): HealthMetricConfig[] {
    return HEALTH_METRIC_CONFIGS;
  }

  public getMetricsByCategory(category: 'nutrition' | 'fitness' | 'wellness'): HealthMetric[] {
    return this.getTodayMetrics().filter(metric => metric.category === category);
  }
}
