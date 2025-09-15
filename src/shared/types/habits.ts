// Shared types for habits and scheduling

export type ScheduleType = 'daily' | 'weekdays' | 'xPerWeek' | 'xPerMonth' | 'everyN' | 'daysOfMonth';

export interface Habit {
  id: string;
  name: string;
  iconKey: string;
  color: string;
  isNegative: boolean;
  isTimed: boolean;
  timerDurationSec?: number;
  timezone: string;
  schedule: {
    type: ScheduleType;
    daysOfWeek?: number[]; // 0–6 (Sunday = 0)
    daysOfMonth?: (number | 'last' | '-2')[];
    perWeekTarget?: number;
    perMonthTarget?: number;
    intervalN?: number;
    anchorDate?: string; // ISO
    startDate?: string;
    endDate?: string;
  };
  completionRules: {
    timesPerDayTarget?: number;
    allowCarryover?: boolean;
    useTwoDayRule?: boolean;
  };
  state: {
    currentStreak: number;
    bestStreak: number;
    lastCompletedAt?: string;
  };
  notifications?: {
    preferredTimes?: string[];
    reminderStrategy?: 'endOfDay' | 'endOfWindow' | 'smart';
  };
}

export interface CompletionEvent {
  id: string;
  habitId: string;
  timestamp: string; // ISO
  amount?: number;   // for times-per-day increments
  durationSec?: number; // for timed sessions
  source: 'manual' | 'timer';
}

export interface HabitProgress {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  amount?: number;
  durationSec?: number;
  streak: number;
  windowProgress?: {
    achieved: number;
    target: number;
    remainingDays: number;
  };
}

export interface StreakBadgeProps {
  streak: number;
  bestStreak: number;
  theme: any;
  size?: 'small' | 'medium' | 'large';
}

export interface ProgressRingProps {
  progress: number; // 0-1
  color: string;
  size?: number;
  strokeWidth?: number;
  theme: any;
}

export interface MetricCardProps {
  title: string;
  icon: string;
  color: string;
  progress: number;
  streak: number;
  bestStreak: number;
  theme: any;
  onPress: () => void;
  quickActions?: {
    onComplete?: () => void;
    onIncrement?: () => void;
    onTimer?: () => void;
  };
  isNegative?: boolean;
  isTimed?: boolean;
  isDueToday?: boolean;
  nextDue?: string;
}
