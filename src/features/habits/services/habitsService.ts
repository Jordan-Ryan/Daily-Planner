import { Habit, CompletionEvent, HabitProgress, HabitPreset } from '../types';
import { 
  isDueToday, 
  nextDueDate, 
  rollupWindowProgress, 
  applyCompletion, 
  updateStreak 
} from '../../../shared/services/scheduleEvaluator';

class HabitsService {
  private static instance: HabitsService;
  private habits: Habit[] = [];
  private completionEvents: CompletionEvent[] = [];

  private constructor() {
    this.loadHabits();
    this.loadCompletionEvents();
  }

  public static getInstance(): HabitsService {
    if (!HabitsService.instance) {
      HabitsService.instance = new HabitsService();
    }
    return HabitsService.instance;
  }

  // Habit management
  public getHabits(): Habit[] {
    return [...this.habits];
  }

  public getHabitById(id: string): Habit | null {
    return this.habits.find(habit => habit.id === id) || null;
  }

  public createHabit(habitData: Omit<Habit, 'id' | 'state'>): Habit {
    const newHabit: Habit = {
      ...habitData,
      id: this.generateId(),
      state: {
        currentStreak: 0,
        bestStreak: 0,
        lastCompletedAt: undefined,
      },
    };

    this.habits.push(newHabit);
    this.saveHabits();
    return newHabit;
  }

  public updateHabit(id: string, updates: Partial<Habit>): Habit | null {
    const index = this.habits.findIndex(habit => habit.id === id);
    if (index === -1) return null;

    this.habits[index] = { ...this.habits[index], ...updates };
    this.saveHabits();
    return this.habits[index];
  }

  public deleteHabit(id: string): boolean {
    const index = this.habits.findIndex(habit => habit.id === id);
    if (index === -1) return false;

    this.habits.splice(index, 1);
    this.completionEvents = this.completionEvents.filter(event => event.habitId !== id);
    this.saveHabits();
    this.saveCompletionEvents();
    return true;
  }

  // Completion management
  public completeHabit(habitId: string, amount: number = 1, durationSec?: number): CompletionEvent | null {
    const habit = this.getHabitById(habitId);
    if (!habit) return null;

    const now = new Date();
    const completionEvent = applyCompletion(habit, this.completionEvents, now, amount, durationSec);
    
    this.completionEvents.push(completionEvent);
    this.updateHabitStreak(habitId);
    this.saveCompletionEvents();
    
    return completionEvent;
  }

  public getCompletionEvents(habitId?: string): CompletionEvent[] {
    if (habitId) {
      return this.completionEvents.filter(event => event.habitId === habitId);
    }
    return [...this.completionEvents];
  }

  public getTodayProgress(habitId: string): HabitProgress | null {
    const habit = this.getHabitById(habitId);
    if (!habit) return null;

    const today = new Date().toISOString().split('T')[0];
    const todayEvents = this.completionEvents.filter(
      event => event.habitId === habitId && event.timestamp.startsWith(today)
    );

    const achieved = todayEvents.reduce((sum, event) => sum + (event.amount || 1), 0);
    const target = habit.completionRules.timesPerDayTarget || 1;
    const completed = achieved >= target;

    // Get window progress based on schedule type
    let windowProgress;
    if (habit.schedule.type === 'xPerWeek') {
      windowProgress = rollupWindowProgress(habit, this.completionEvents, 'week');
    } else if (habit.schedule.type === 'xPerMonth') {
      windowProgress = rollupWindowProgress(habit, this.completionEvents, 'month');
    } else {
      windowProgress = { achieved, target, remainingDays: 1 };
    }

    return {
      habitId,
      date: today,
      completed,
      amount: achieved,
      streak: habit.state.currentStreak,
      windowProgress,
    };
  }

  // Due status and scheduling
  public getDueTodayHabits(): Habit[] {
    return this.habits.filter(habit => 
      isDueToday(habit, this.completionEvents)
    );
  }

  public getNextDueDate(habitId: string): Date | null {
    const habit = this.getHabitById(habitId);
    if (!habit) return null;

    return nextDueDate(habit, this.completionEvents);
  }

  // Presets
  public getHabitPresets(): HabitPreset[] {
    return [
      // Mindfulness & Mental Health
      {
        id: 'meditate',
        name: 'Meditate',
        iconKey: '🧘',
        color: '#4A90E2',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 600,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Meditate for 10 minutes daily',
      },
      {
        id: 'journal',
        name: 'Journal',
        iconKey: '📝',
        color: '#7ED321',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Write in journal daily',
      },
      {
        id: 'gratitude',
        name: 'Gratitude Practice',
        iconKey: '🙏',
        color: '#F5A623',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 3 },
        description: 'Write 3 things you\'re grateful for daily',
      },
      {
        id: 'breathwork',
        name: 'Breathwork',
        iconKey: '🌬️',
        color: '#BD10E0',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 300,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Practice breathwork for 5 minutes daily',
      },
      {
        id: 'nature-time',
        name: 'Nature Time',
        iconKey: '🌳',
        color: '#50E3C2',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 900,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Spend 15 minutes in nature daily',
      },
      {
        id: 'mood-check',
        name: 'Mood Check',
        iconKey: '😊',
        color: '#FF6B6B',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 2 },
        description: 'Check in with your mood twice daily',
      },

      // Learning & Creativity
      {
        id: 'read',
        name: 'Read',
        iconKey: '📚',
        color: '#4A90E2',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 1800,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Read for 30 minutes daily',
      },
      {
        id: 'language-practice',
        name: 'Language Practice',
        iconKey: '🗣️',
        color: '#7ED321',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 900,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Practice a new language for 15 minutes daily',
      },
      {
        id: 'instrument-practice',
        name: 'Practice Instrument',
        iconKey: '🎵',
        color: '#F5A623',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 1800,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Practice instrument for 30 minutes daily',
      },
      {
        id: 'write',
        name: 'Write',
        iconKey: '✍️',
        color: '#BD10E0',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Write 500 words daily',
      },
      {
        id: 'create',
        name: 'Create',
        iconKey: '🎨',
        color: '#50E3C2',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 3 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Create something 3 times per week',
      },
      {
        id: 'learn-skill',
        name: 'Learn New Skill',
        iconKey: '🧠',
        color: '#FF6B6B',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerMonth', perMonthTarget: 2 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Learn a new skill or recipe twice per month',
      },

      // Productivity & Work
      {
        id: 'deep-work',
        name: 'Deep Work',
        iconKey: '🎯',
        color: '#4A90E2',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 3600,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Deep work block for 1 hour daily',
      },
      {
        id: 'plan-day',
        name: 'Plan Day',
        iconKey: '📋',
        color: '#7ED321',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 300,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Plan your day in 5 minutes each morning',
      },
      {
        id: 'top-3-priorities',
        name: 'Set Top 3 Priorities',
        iconKey: '⭐',
        color: '#F5A623',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Set your top 3 priorities daily',
      },
      {
        id: 'inbox-zero',
        name: 'Inbox Zero',
        iconKey: '📥',
        color: '#BD10E0',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 2 },
        description: 'Achieve inbox zero twice daily',
      },
      {
        id: 'weekly-review',
        name: 'Weekly Review',
        iconKey: '📊',
        color: '#50E3C2',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 1800,
        schedule: { type: 'xPerWeek', perWeekTarget: 1 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Weekly review for 30 minutes',
      },
      {
        id: 'focus-no-notifications',
        name: 'Focus Without Notifications',
        iconKey: '🔕',
        color: '#FF6B6B',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 1800,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Focus for 30 minutes without notifications',
      },

      // Home & Chores
      {
        id: 'tidy',
        name: 'Tidy',
        iconKey: '🧹',
        color: '#4A90E2',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 600,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Tidy for 10 minutes daily',
      },
      {
        id: 'dishes-before-bed',
        name: 'Dishes Before Bed',
        iconKey: '🍽️',
        color: '#7ED321',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Do dishes before bed daily',
      },
      {
        id: 'laundry',
        name: 'Laundry',
        iconKey: '👕',
        color: '#F5A623',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 2 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Do laundry twice per week',
      },
      {
        id: 'vacuum-clean',
        name: 'Vacuum/Clean',
        iconKey: '🧽',
        color: '#BD10E0',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 1 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Vacuum and clean once per week',
      },
      {
        id: 'water-plants',
        name: 'Water Plants',
        iconKey: '🌱',
        color: '#50E3C2',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'everyN', intervalN: 3 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Water plants every 3 days',
      },
      {
        id: 'declutter',
        name: 'Declutter',
        iconKey: '📦',
        color: '#FF6B6B',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 1 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Declutter 5 items per week',
      },

      // Finances
      {
        id: 'track-expenses',
        name: 'Track Expenses',
        iconKey: '💰',
        color: '#4A90E2',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Track expenses daily',
      },
      {
        id: 'review-budget',
        name: 'Review Budget',
        iconKey: '📊',
        color: '#7ED321',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerMonth', perMonthTarget: 2 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Review budget twice per month',
      },
      {
        id: 'no-spend-day',
        name: 'No-Spend Day',
        iconKey: '🚫',
        color: '#F5A623',
        isNegative: true,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 2 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Have 2 no-spend days per week',
      },
      {
        id: 'pay-bills',
        name: 'Pay Bills',
        iconKey: '💳',
        color: '#BD10E0',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daysOfMonth', daysOfMonth: [1, 15] },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Pay bills on 1st and 15th of month',
      },
      {
        id: 'save-invest',
        name: 'Save/Invest',
        iconKey: '📈',
        color: '#50E3C2',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 1 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Save/invest weekly',
      },
      {
        id: 'review-subscriptions',
        name: 'Review Subscriptions',
        iconKey: '📋',
        color: '#FF6B6B',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerMonth', perMonthTarget: 1 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Review subscriptions monthly',
      },

      // Relationships & Social
      {
        id: 'call-someone',
        name: 'Call Someone',
        iconKey: '📞',
        color: '#4A90E2',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 3 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Call or message someone 3 times per week',
      },
      {
        id: 'date-night',
        name: 'Date Night',
        iconKey: '💕',
        color: '#7ED321',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerMonth', perMonthTarget: 2 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Schedule date night twice per month',
      },
      {
        id: 'play-with-child-pet',
        name: 'Play with Child/Pet',
        iconKey: '🎮',
        color: '#F5A623',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 1800,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Play with child or pet for 30 minutes daily',
      },
      {
        id: 'thank-you-note',
        name: 'Send Thank You Note',
        iconKey: '💌',
        color: '#BD10E0',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 1 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Send a thank you note weekly',
      },
      {
        id: 'check-in-colleague',
        name: 'Check in with Colleague',
        iconKey: '👥',
        color: '#50E3C2',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 2 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Check in with a colleague twice per week',
      },

      // Self-Care & Hygiene
      {
        id: 'brush-teeth',
        name: 'Brush Teeth',
        iconKey: '🦷',
        color: '#4A90E2',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 2 },
        description: 'Brush teeth morning and evening',
      },
      {
        id: 'floss',
        name: 'Floss',
        iconKey: '🧵',
        color: '#7ED321',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Floss daily',
      },
      {
        id: 'skincare',
        name: 'Skincare',
        iconKey: '🧴',
        color: '#F5A623',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 2 },
        description: 'Skincare routine morning and evening',
      },
      {
        id: 'sunscreen',
        name: 'Sunscreen',
        iconKey: '☀️',
        color: '#BD10E0',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Apply sunscreen daily',
      },
      {
        id: 'grooming',
        name: 'Grooming',
        iconKey: '💇',
        color: '#50E3C2',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 2 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Grooming and hair care twice per week',
      },
      {
        id: 'stretch-break',
        name: 'Stretch Break',
        iconKey: '🤸',
        color: '#FF6B6B',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 300,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 3 },
        description: 'Take 3 stretch breaks daily',
      },

      // Digital & Screen
      {
        id: 'limit-social-media',
        name: 'Limit Social Media',
        iconKey: '📱',
        color: '#4A90E2',
        isNegative: true,
        isTimed: true,
        timerDurationSec: 1800,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Limit social media to 30 minutes daily',
      },
      {
        id: 'screen-free-after',
        name: 'Screen-Free After 9pm',
        iconKey: '🌙',
        color: '#7ED321',
        isNegative: true,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'No screens after 9pm',
      },
      {
        id: 'email-checks',
        name: 'Email Checks',
        iconKey: '📧',
        color: '#F5A623',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 3 },
        description: 'Check email only 3 times daily',
      },
      {
        id: 'phone-out-bedroom',
        name: 'Phone Out of Bedroom',
        iconKey: '🚫',
        color: '#BD10E0',
        isNegative: true,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Keep phone out of bedroom nightly',
      },
      {
        id: 'unfollow-declutter',
        name: 'Unfollow/Declutter Feeds',
        iconKey: '🧹',
        color: '#50E3C2',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 1 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Unfollow or declutter 5 items from feeds weekly',
      },

      // Family & Parenting
      {
        id: 'read-with-child',
        name: 'Read with Child',
        iconKey: '📖',
        color: '#4A90E2',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 1800,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Read with child for 30 minutes daily',
      },
      {
        id: 'prepare-school-bag',
        name: 'Prepare School Bag',
        iconKey: '🎒',
        color: '#7ED321',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Prepare school bag night before',
      },
      {
        id: 'family-planning',
        name: 'Family Planning',
        iconKey: '📅',
        color: '#F5A623',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 600,
        schedule: { type: 'xPerWeek', perWeekTarget: 1 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Family planning for 10 minutes weekly',
      },
      {
        id: 'screen-time-audit',
        name: 'Screen Time Audit',
        iconKey: '📊',
        color: '#BD10E0',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 1 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Screen time audit weekly',
      },
      {
        id: 'outdoor-family-time',
        name: 'Outdoor Family Time',
        iconKey: '🌳',
        color: '#50E3C2',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 3600,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Outdoor family time for 1 hour daily',
      },

      // Pet Care
      {
        id: 'feed-pet',
        name: 'Feed Pet',
        iconKey: '🍽️',
        color: '#4A90E2',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 2 },
        description: 'Feed pet twice daily',
      },
      {
        id: 'fresh-water',
        name: 'Fresh Water',
        iconKey: '💧',
        color: '#7ED321',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 2 },
        description: 'Provide fresh water twice daily',
      },
      {
        id: 'walk-pet',
        name: 'Walk Pet',
        iconKey: '🐕',
        color: '#F5A623',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 1800,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 2 },
        description: 'Walk pet for 30 minutes twice daily',
      },
      {
        id: 'training-enrichment',
        name: 'Training/Enrichment',
        iconKey: '🎾',
        color: '#BD10E0',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 900,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Training and enrichment for 15 minutes daily',
      },
      {
        id: 'clean-litter-cage',
        name: 'Clean Litter/Cage',
        iconKey: '🧽',
        color: '#50E3C2',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 3 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Clean litter box or cage 3 times per week',
      },
      {
        id: 'groom-pet',
        name: 'Groom Pet',
        iconKey: '✂️',
        color: '#FF6B6B',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 2 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Groom pet twice per week',
      },

      // Environment & Community
      {
        id: 'recycle-compost',
        name: 'Recycle/Compost',
        iconKey: '♻️',
        color: '#4A90E2',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 1 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Recycle and compost checklist weekly',
      },
      {
        id: 'pick-up-litter',
        name: 'Pick Up Litter',
        iconKey: '🗑️',
        color: '#7ED321',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Pick up 3 pieces of litter daily',
      },
      {
        id: 'donate-items',
        name: 'Donate Items',
        iconKey: '📦',
        color: '#F5A623',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerMonth', perMonthTarget: 1 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Donate 5 items monthly',
      },
      {
        id: 'volunteer',
        name: 'Volunteer',
        iconKey: '🤝',
        color: '#BD10E0',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerMonth', perMonthTarget: 1 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Volunteer 4 hours monthly',
      },
      {
        id: 'reusable-bottle-bags',
        name: 'Use Reusable Bottle/Bags',
        iconKey: '👜',
        color: '#50E3C2',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Use reusable bottle and bags always',
      },

      // Travel & Outdoors
      {
        id: 'explore-new-place',
        name: 'Explore New Place',
        iconKey: '🗺️',
        color: '#4A90E2',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerMonth', perMonthTarget: 2 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Explore a new place twice per month',
      },
      {
        id: 'walk-to-errands',
        name: 'Walk to Errands',
        iconKey: '🚶',
        color: '#7ED321',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Walk to errands within 2km',
      },
      {
        id: 'park-farther-away',
        name: 'Park Farther Away',
        iconKey: '🚗',
        color: '#F5A623',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Park farther away daily',
      },
      {
        id: 'sunlight-exposure',
        name: 'Sunlight Exposure',
        iconKey: '☀️',
        color: '#BD10E0',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 900,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Get 15 minutes sunlight exposure in the morning',
      },
      {
        id: 'outdoor-meal',
        name: 'Outdoor Meal',
        iconKey: '🧺',
        color: '#50E3C2',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerMonth', perMonthTarget: 4 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Have a picnic or outdoor meal 4 times per month',
      },

      // Spiritual/Values
      {
        id: 'prayer-reflection',
        name: 'Prayer/Reflection',
        iconKey: '🙏',
        color: '#4A90E2',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 600,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Prayer or reflection for 10 minutes daily',
      },
      {
        id: 'spiritual-reading',
        name: 'Spiritual Reading',
        iconKey: '📿',
        color: '#7ED321',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 900,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Spiritual reading for 15 minutes daily',
      },
      {
        id: 'acts-of-kindness',
        name: 'Acts of Kindness',
        iconKey: '💝',
        color: '#F5A623',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 3 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Perform 3 acts of kindness per week',
      },
      {
        id: 'digital-sabbath',
        name: 'Digital Sabbath',
        iconKey: '📱',
        color: '#BD10E0',
        isNegative: true,
        isTimed: true,
        timerDurationSec: 14400,
        schedule: { type: 'xPerWeek', perWeekTarget: 1 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Digital sabbath for 4 hours weekly',
      },
      {
        id: 'value-check-in',
        name: 'Value Check-in',
        iconKey: '📝',
        color: '#50E3C2',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 1 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Value check-in journaling weekly',
      },

      // Hobbies & Skills
      {
        id: 'practice-hobby',
        name: 'Practice Hobby',
        iconKey: '🎨',
        color: '#4A90E2',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 1800,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Practice hobby for 30 minutes daily',
      },
      {
        id: 'sketch',
        name: 'Sketch',
        iconKey: '✏️',
        color: '#7ED321',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 900,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Sketch for 15 minutes daily',
      },
      {
        id: 'take-photo',
        name: 'Take One Photo',
        iconKey: '📸',
        color: '#F5A623',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Take one photo daily',
      },
      {
        id: 'cook-new-recipe',
        name: 'Cook New Recipe',
        iconKey: '👨‍🍳',
        color: '#BD10E0',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerMonth', perMonthTarget: 2 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Cook a new recipe twice per month',
      },
      {
        id: 'puzzle-game',
        name: 'Puzzle/Game Practice',
        iconKey: '🧩',
        color: '#50E3C2',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 1800,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Puzzle or game practice for 30 minutes daily',
      },

      // Admin & Planning
      {
        id: 'weekly-review-admin',
        name: 'Weekly Review',
        iconKey: '📊',
        color: '#4A90E2',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 1800,
        schedule: { type: 'xPerWeek', perWeekTarget: 1 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Weekly review for 30 minutes',
      },
      {
        id: 'set-top-3-daily',
        name: 'Set Top 3 Daily',
        iconKey: '⭐',
        color: '#7ED321',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Set top 3 priorities daily',
      },
      {
        id: 'todo-capture',
        name: 'To-Do Capture',
        iconKey: '📝',
        color: '#F5A623',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 3 },
        description: 'Capture to-dos 3 times daily',
      },
      {
        id: 'calendar-review',
        name: 'Calendar Review',
        iconKey: '📅',
        color: '#BD10E0',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 2 },
        description: 'Review calendar twice daily',
      },
      {
        id: 'prep-clothes-bag',
        name: 'Prep Clothes/Bag',
        iconKey: '👔',
        color: '#50E3C2',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Prep clothes and bag nightly',
      },

      // Negative/Avoid Habits
      {
        id: 'no-alcohol',
        name: 'No Alcohol',
        iconKey: '🍷',
        color: '#D0021B',
        isNegative: true,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 5 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'No alcohol 5 days per week',
      },
      {
        id: 'no-smoking',
        name: 'No Smoking',
        iconKey: '🚭',
        color: '#D0021B',
        isNegative: true,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'No smoking daily',
      },
      {
        id: 'no-added-sugar',
        name: 'No Added Sugar',
        iconKey: '🍭',
        color: '#D0021B',
        isNegative: true,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 4 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'No added sugar 4 days per week',
      },
      {
        id: 'no-unnecessary-spending',
        name: 'No Unnecessary Spending',
        iconKey: '💸',
        color: '#D0021B',
        isNegative: true,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 3 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'No unnecessary spending 3 days per week',
      },
      {
        id: 'no-phone-in-bed',
        name: 'No Phone in Bed',
        iconKey: '📱',
        color: '#D0021B',
        isNegative: true,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'No phone in bed nightly',
      },
      {
        id: 'limit-news-social',
        name: 'Limit News/Social',
        iconKey: '📰',
        color: '#D0021B',
        isNegative: true,
        isTimed: true,
        timerDurationSec: 1800,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Limit news and social media to 30 minutes daily',
      },
    ];
  }

  public getHealthRelatedPresets(): HabitPreset[] {
    return [
      {
        id: 'steps',
        name: 'Daily Steps',
        iconKey: '👟',
        color: '#4A90E2',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Track daily step count',
        isHealthRelated: true,
      },
      {
        id: 'running',
        name: 'Running',
        iconKey: '🏃',
        color: '#7ED321',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'xPerWeek', perWeekTarget: 3 },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Go for a run',
        isHealthRelated: true,
      },
      {
        id: 'heart-rate',
        name: 'Heart Rate Monitoring',
        iconKey: '❤️',
        color: '#D0021B',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Monitor heart rate',
        isHealthRelated: true,
      },
      {
        id: 'mindful-minutes',
        name: 'Mindful Minutes',
        iconKey: '🧘',
        color: '#F5A623',
        isNegative: false,
        isTimed: true,
        timerDurationSec: 300,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 1 },
        description: 'Practice mindfulness',
        isHealthRelated: true,
      },
      {
        id: 'water-intake',
        name: 'Water Intake',
        iconKey: '💧',
        color: '#4A90E2',
        isNegative: false,
        isTimed: false,
        schedule: { type: 'daily' },
        completionRules: { timesPerDayTarget: 8 },
        description: 'Drink enough water',
        isHealthRelated: true,
      },
    ];
  }

  // Health routing check
  public isHealthRelatedHabit(habitData: Partial<Habit>): boolean {
    const healthKeywords = [
      'steps', 'running', 'heart', 'blood', 'pressure', 'water', 'nutrition',
      'calories', 'protein', 'carbs', 'fat', 'vitamin', 'medication', 'sleep',
      'mindful', 'meditation', 'yoga', 'gym', 'workout', 'exercise', 'fitness'
    ];

    const name = habitData.name?.toLowerCase() || '';
    const iconKey = habitData.iconKey?.toLowerCase() || '';

    return healthKeywords.some(keyword => 
      name.includes(keyword) || iconKey.includes(keyword)
    );
  }

  // Private methods
  private updateHabitStreak(habitId: string): void {
    const habit = this.getHabitById(habitId);
    if (!habit) return;

    const habitEvents = this.completionEvents.filter(event => event.habitId === habitId);
    const { currentStreak, bestStreak } = updateStreak(habit, habitEvents);

    this.updateHabit(habitId, {
      state: {
        ...habit.state,
        currentStreak,
        bestStreak,
        lastCompletedAt: new Date().toISOString(),
      },
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private loadHabits(): void {
    // In a real app, this would load from AsyncStorage or a database
    // For now, we'll start with an empty array
    this.habits = [];
  }

  private saveHabits(): void {
    // In a real app, this would save to AsyncStorage or a database
    console.log('Saving habits:', this.habits);
  }

  private loadCompletionEvents(): void {
    // In a real app, this would load from AsyncStorage or a database
    this.completionEvents = [];
  }

  private saveCompletionEvents(): void {
    // In a real app, this would save to AsyncStorage or a database
    console.log('Saving completion events:', this.completionEvents);
  }
}

export { HabitsService };
