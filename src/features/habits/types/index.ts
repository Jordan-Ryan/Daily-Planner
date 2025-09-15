// Habits feature types

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
    type: 'daily' | 'weekdays' | 'xPerWeek' | 'xPerMonth' | 'everyN' | 'daysOfMonth';
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

export interface HabitPreset {
  id: string;
  name: string;
  iconKey: string;
  color: string;
  isNegative: boolean;
  isTimed: boolean;
  timerDurationSec?: number;
  schedule: Partial<Habit['schedule']>;
  completionRules: Partial<Habit['completionRules']>;
  description: string;
  isHealthRelated?: boolean; // If true, should be created in Health tab
}

export interface NewHabitFormData {
  name: string;
  iconKey: string;
  color: string;
  isNegative: boolean;
  isTimed: boolean;
  timerDurationSec?: number;
  schedule: Habit['schedule'];
  completionRules: Habit['completionRules'];
}

export interface HealthRoutingModalProps {
  visible: boolean;
  habitName: string;
  onSwitchToHealth: () => void;
  onCancel: () => void;
  theme: any;
}
