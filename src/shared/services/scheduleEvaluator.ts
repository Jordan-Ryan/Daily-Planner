// Shared scheduling engine and evaluation utilities

import { Habit, CompletionEvent, HabitProgress, ScheduleType } from '../types/habits';

/**
 * Determines if a habit is due today based on its schedule and completion history
 */
export const isDueToday = (
  habit: Habit,
  events: CompletionEvent[],
  now: Date = new Date()
): boolean => {
  const today = now.toISOString().split('T')[0];
  const todayEvents = events.filter(e => e.timestamp.startsWith(today));
  
  switch (habit.schedule.type) {
    case 'daily':
      return !habit.isNegative || !todayEvents.some(e => e.completed);
      
    case 'weekdays':
      const dayOfWeek = now.getDay();
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5; // Monday-Friday
      return isWeekday && (!habit.isNegative || !todayEvents.some(e => e.completed));
      
    case 'xPerWeek':
      const weekStart = getWeekStart(now);
      const weekEvents = events.filter(e => 
        e.timestamp >= weekStart && e.timestamp < getWeekEnd(now)
      );
      const achieved = weekEvents.reduce((sum, e) => sum + (e.amount || 1), 0);
      const remainingDays = getRemainingDaysInWeek(now);
      const remainingNeeded = Math.max(0, (habit.schedule.perWeekTarget || 0) - achieved);
      return remainingNeeded > 0 && remainingDays > 0;
      
    case 'xPerMonth':
      const monthStart = getMonthStart(now);
      const monthEvents = events.filter(e => 
        e.timestamp >= monthStart && e.timestamp < getMonthEnd(now)
      );
      const monthAchieved = monthEvents.reduce((sum, e) => sum + (e.amount || 1), 0);
      const remainingDaysInMonth = getRemainingDaysInMonth(now);
      const remainingNeededInMonth = Math.max(0, (habit.schedule.perMonthTarget || 0) - monthAchieved);
      return remainingNeededInMonth > 0 && remainingDaysInMonth > 0;
      
    case 'everyN':
      const lastCompleted = getLastCompletedDate(habit, events);
      if (!lastCompleted) return true;
      
      const daysSinceLast = Math.floor((now.getTime() - new Date(lastCompleted).getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceLast >= (habit.schedule.intervalN || 1);
      
    case 'daysOfMonth':
      const dayOfMonth = now.getDate();
      const targetDays = habit.schedule.daysOfMonth || [];
      return targetDays.some(day => 
        day === dayOfMonth || 
        day === 'last' && isLastDayOfMonth(now) ||
        day === '-2' && isSecondToLastDayOfMonth(now)
      );
      
    default:
      return false;
  }
};

/**
 * Computes the next due date for a habit
 */
export const nextDueDate = (
  habit: Habit,
  events: CompletionEvent[],
  now: Date = new Date()
): Date | null => {
  switch (habit.schedule.type) {
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
    case 'weekdays':
      const nextWeekday = getNextWeekday(now);
      return nextWeekday;
      
    case 'xPerWeek':
      const weekStart = getWeekStart(now);
      const weekEvents = events.filter(e => 
        e.timestamp >= weekStart && e.timestamp < getWeekEnd(now)
      );
      const achieved = weekEvents.reduce((sum, e) => sum + (e.amount || 1), 0);
      if (achieved < (habit.schedule.perWeekTarget || 0)) {
        return now; // Due today
      }
      return getNextWeekStart(now);
      
    case 'xPerMonth':
      const monthStart = getMonthStart(now);
      const monthEvents = events.filter(e => 
        e.timestamp >= monthStart && e.timestamp < getMonthEnd(now)
      );
      const monthAchieved = monthEvents.reduce((sum, e) => sum + (e.amount || 1), 0);
      if (monthAchieved < (habit.schedule.perMonthTarget || 0)) {
        return now; // Due today
      }
      return getNextMonthStart(now);
      
    case 'everyN':
      const lastCompleted = getLastCompletedDate(habit, events);
      if (!lastCompleted) return now;
      
      const lastCompletedDate = new Date(lastCompleted);
      const intervalDays = habit.schedule.intervalN || 1;
      return new Date(lastCompletedDate.getTime() + intervalDays * 24 * 60 * 60 * 1000);
      
    case 'daysOfMonth':
      const nextTargetDay = getNextTargetDayOfMonth(habit.schedule.daysOfMonth || [], now);
      return nextTargetDay;
      
    default:
      return null;
  }
};

/**
 * Aggregates progress within a window (day/week/month)
 */
export const rollupWindowProgress = (
  habit: Habit,
  events: CompletionEvent[],
  window: 'day' | 'week' | 'month',
  date: Date = new Date()
): { achieved: number; target: number; remainingDays: number } => {
  let windowStart: string;
  let windowEnd: string;
  let target: number;
  let remainingDays: number;
  
  switch (window) {
    case 'day':
      windowStart = date.toISOString().split('T')[0];
      windowEnd = new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      target = habit.completionRules.timesPerDayTarget || 1;
      remainingDays = 1;
      break;
      
    case 'week':
      windowStart = getWeekStart(date);
      windowEnd = getWeekEnd(date);
      target = habit.schedule.perWeekTarget || 1;
      remainingDays = getRemainingDaysInWeek(date);
      break;
      
    case 'month':
      windowStart = getMonthStart(date);
      windowEnd = getMonthEnd(date);
      target = habit.schedule.perMonthTarget || 1;
      remainingDays = getRemainingDaysInMonth(date);
      break;
      
    default:
      return { achieved: 0, target: 0, remainingDays: 0 };
  }
  
  const windowEvents = events.filter(e => 
    e.timestamp >= windowStart && e.timestamp < windowEnd
  );
  
  const achieved = windowEvents.reduce((sum, e) => sum + (e.amount || 1), 0);
  
  return { achieved, target, remainingDays };
};

/**
 * Applies a completion event to a habit
 */
export const applyCompletion = (
  habit: Habit,
  events: CompletionEvent[],
  now: Date = new Date(),
  amount: number = 1,
  durationSec?: number
): CompletionEvent => {
  const newEvent: CompletionEvent = {
    id: generateId(),
    habitId: habit.id,
    timestamp: now.toISOString(),
    amount,
    durationSec,
    source: 'manual'
  };
  
  return newEvent;
};

/**
 * Updates streak based on completion history
 */
export const updateStreak = (
  habit: Habit,
  events: CompletionEvent[]
): { currentStreak: number; bestStreak: number } => {
  const sortedEvents = events
    .filter(e => e.habitId === habit.id)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  
  // Group events by day
  const eventsByDay = new Map<string, CompletionEvent[]>();
  sortedEvents.forEach(event => {
    const day = event.timestamp.split('T')[0];
    if (!eventsByDay.has(day)) {
      eventsByDay.set(day, []);
    }
    eventsByDay.get(day)!.push(event);
  });
  
  const days = Array.from(eventsByDay.keys()).sort();
  
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    const dayEvents = eventsByDay.get(day) || [];
    const isCompleted = dayEvents.some(e => e.amount && e.amount > 0);
    
    if (isCompleted) {
      tempStreak++;
      if (i === days.length - 1) {
        currentStreak = tempStreak;
      }
    } else {
      bestStreak = Math.max(bestStreak, tempStreak);
      tempStreak = 0;
    }
  }
  
  bestStreak = Math.max(bestStreak, tempStreak, currentStreak);
  
  return { currentStreak, bestStreak };
};

// Helper functions

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

function getWeekEnd(date: Date): string {
  const weekStart = new Date(getWeekStart(date));
  weekStart.setDate(weekStart.getDate() + 7);
  return weekStart.toISOString().split('T')[0];
}

function getMonthStart(date: Date): string {
  const d = new Date(date);
  d.setDate(1);
  return d.toISOString().split('T')[0];
}

function getMonthEnd(date: Date): string {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1, 1);
  return d.toISOString().split('T')[0];
}

function getRemainingDaysInWeek(date: Date): number {
  const dayOfWeek = date.getDay();
  return Math.max(0, 7 - dayOfWeek);
}

function getRemainingDaysInMonth(date: Date): number {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return Math.max(0, lastDay - date.getDate());
}

function getLastCompletedDate(habit: Habit, events: CompletionEvent[]): string | null {
  const habitEvents = events
    .filter(e => e.habitId === habit.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return habitEvents.length > 0 ? habitEvents[0].timestamp : null;
}

function getNextWeekday(date: Date): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  
  while (next.getDay() === 0 || next.getDay() === 6) { // Skip weekends
    next.setDate(next.getDate() + 1);
  }
  
  return next;
}

function getNextWeekStart(date: Date): Date {
  const weekStart = new Date(getWeekStart(date));
  weekStart.setDate(weekStart.getDate() + 7);
  return weekStart;
}

function getNextMonthStart(date: Date): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + 1, 1);
  return next;
}

function getNextTargetDayOfMonth(targetDays: (number | 'last' | '-2')[], date: Date): Date {
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  const currentDay = date.getDate();
  
  // Find next target day in current month
  const validDays = targetDays
    .map(day => {
      if (typeof day === 'number') return day;
      if (day === 'last') return new Date(currentYear, currentMonth + 1, 0).getDate();
      if (day === '-2') return new Date(currentYear, currentMonth + 1, 0).getDate() - 1;
      return null;
    })
    .filter((day): day is number => day !== null && day > currentDay)
    .sort((a, b) => a - b);
  
  if (validDays.length > 0) {
    return new Date(currentYear, currentMonth, validDays[0]);
  }
  
  // Find first target day in next month
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  
  const nextMonthDays = targetDays
    .map(day => {
      if (typeof day === 'number') return day;
      if (day === 'last') return new Date(nextYear, nextMonth + 1, 0).getDate();
      if (day === '-2') return new Date(nextYear, nextMonth + 1, 0).getDate() - 1;
      return null;
    })
    .filter((day): day is number => day !== null)
    .sort((a, b) => a - b);
  
  if (nextMonthDays.length > 0) {
    return new Date(nextYear, nextMonth, nextMonthDays[0]);
  }
  
  return new Date(date.getTime() + 24 * 60 * 60 * 1000); // Fallback to tomorrow
}

function isLastDayOfMonth(date: Date): boolean {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.getMonth() !== date.getMonth();
}

function isSecondToLastDayOfMonth(date: Date): boolean {
  const dayAfter = new Date(date);
  dayAfter.setDate(dayAfter.getDate() + 2);
  return dayAfter.getMonth() !== date.getMonth();
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
