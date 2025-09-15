import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme, lightTheme } from './theme';

const { width: screenWidth } = Dimensions.get('window');

// Types
interface Task {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  calendar: string;
  icon: string;
  isOverlapping?: boolean;
  isRecurring?: boolean;
  isCompleted?: boolean;
}

interface DayData {
  date: number;
  dayName: string;
  isToday: boolean;
}

// Static placeholder data
const placeholderTasks: Task[] = [
  {
    id: '1',
    title: 'Wake up!',
    startTime: '05:30',
    endTime: '05:30',
    calendar: 'Personal',
    icon: '⏰',
    isRecurring: false,
  },
  {
    id: '2',
    title: 'Go to Office',
    startTime: '06:00',
    endTime: '18:45',
    calendar: 'Work',
    icon: '💼',
    isRecurring: false,
  },
  {
    id: '3',
    title: 'Mel pickup pumbaa',
    startTime: '09:00',
    endTime: '09:00',
    calendar: 'Personal',
    icon: '🐾',
    isOverlapping: true,
    isRecurring: false,
  },
  {
    id: '4',
    title: 'Esme Dance after School',
    startTime: '15:15',
    endTime: '16:15',
    calendar: 'Family',
    icon: '📚',
    isOverlapping: true,
    isRecurring: true,
  },
  {
    id: '5',
    title: 'Esme Swimming',
    startTime: '18:00',
    endTime: '19:00',
    calendar: 'Family',
    icon: '🏊',
    isOverlapping: true,
    isRecurring: true,
  },
];

const generateWeekDays = (): DayData[] => {
  const today = new Date();
  const days: DayData[] = [];
  
  for (let i = -3; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    days.push({
      date: date.getDate(),
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday: i === 0,
    });
  }
  
  return days;
};

// Header Component
const Header: React.FC<{ theme: any }> = ({ theme }) => (
  <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
    <Text style={[styles.dateTitle, { color: theme.colors.text.primary }]}>
      10 September 2025
    </Text>
    <TouchableOpacity style={styles.navArrow}>
      <Text style={{ fontSize: 20, color: theme.colors.text.secondary }}>→</Text>
    </TouchableOpacity>
  </View>
);

// Date Strip Component
const DateStrip: React.FC<{ theme: any; selectedDate: number; onDateSelect: (date: number) => void }> = ({
  theme,
  selectedDate,
  onDateSelect,
}) => {
  const weekDays = [
    { date: 8, dayName: 'Mon', isToday: false },
    { date: 9, dayName: 'Tue', isToday: false },
    { date: 10, dayName: 'Wed', isToday: true },
    { date: 11, dayName: 'Thu', isToday: false },
    { date: 12, dayName: 'Fri', isToday: false },
    { date: 13, dayName: 'Sat', isToday: false },
    { date: 14, dayName: 'Sun', isToday: false },
  ];

  return (
    <View style={[styles.dateStrip, { backgroundColor: theme.colors.background }]}>
      <View style={styles.dateStripContainer}>
        {weekDays.map((day) => (
          <TouchableOpacity
            key={day.date}
            style={[
              styles.dateItem,
              { backgroundColor: day.isToday ? '#FFFFFF' : 'transparent' },
            ]}
            onPress={() => onDateSelect(day.date)}
          >
            <Text
              style={[
                styles.dayName,
                { color: day.isToday ? '#000000' : theme.colors.text.secondary },
              ]}
            >
              {day.dayName}
            </Text>
            <Text
              style={[
                styles.dayNumber,
                { color: day.isToday ? '#000000' : theme.colors.text.primary },
              ]}
            >
              {day.date}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Time Rail Component
const TimeRail: React.FC<{ theme: any }> = ({ theme }) => {
  const timeSlots = [
    '05:30', '06:00', '07:00', '08:00', '09:00', '10:00', 
    '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  return (
    <View style={styles.timeRail}>
      {timeSlots.map((time, index) => (
        <View key={time} style={styles.timeSlot}>
          <Text style={[styles.timeLabel, { color: theme.colors.text.tertiary }]} numberOfLines={1}>
            {time}
          </Text>
        </View>
      ))}
    </View>
  );
};

// Task Card Component
const TaskCard: React.FC<{ task: Task; theme: any; onToggleComplete: (taskId: string) => void }> = ({ task, theme, onToggleComplete }) => {
  const getEventColor = (calendar: string) => {
    switch (calendar) {
      case 'Personal': return '#FFFFFF';
      case 'Work': return '#FFFFFF';
      case 'Family': return '#FFD700';
      default: return '#FFFFFF';
    }
  };

  const getEventBackgroundColor = (calendar: string) => {
    switch (calendar) {
      case 'Personal': return '#2A2A2A';
      case 'Work': return '#2A2A2A';
      case 'Family': return '#2A2A2A';
      default: return '#2A2A2A';
    }
  };

  const getEventHeight = (startTime: string, endTime: string) => {
    if (startTime === endTime) return 48; // Single time events
    // Calculate height based on duration (simplified)
    const start = parseInt(startTime.replace(':', ''));
    const end = parseInt(endTime.replace(':', ''));
    const duration = end - start;
    return Math.max(100, duration * 4);
  };

  const formatTimeDisplay = (startTime: string, endTime: string) => {
    if (startTime === endTime) {
      return startTime;
    }
    return `${startTime}-${endTime}`;
  };

  return (
    <View style={styles.taskContainer}>
      {task.isOverlapping && (
        <Text style={[styles.overlappingText, { color: theme.colors.text.tertiary }]}>
          Tasks are overlapping
        </Text>
      )}
      <View style={styles.taskRow}>
        <View
          style={[
            styles.taskBar,
            {
              backgroundColor: getEventBackgroundColor(task.calendar),
              height: getEventHeight(task.startTime, task.endTime),
            },
          ]}
        >
          <View style={styles.taskIconInBar}>
            <Text style={{ fontSize: 14, color: getEventColor(task.calendar) }}>
              {task.icon}
            </Text>
          </View>
        </View>
        <View style={styles.taskDetails}>
          <Text style={[styles.taskTitle, { color: theme.colors.text.primary }]}>
            {task.title}
          </Text>
          <Text style={[styles.taskTime, { color: theme.colors.text.secondary }]}>
            {formatTimeDisplay(task.startTime, task.endTime)}
          </Text>
        </View>
        <TouchableOpacity style={styles.taskCheckbox} onPress={() => onToggleComplete(task.id)}>
          <View style={[
            styles.checkbox, 
            { 
              borderColor: getEventColor(task.calendar),
              backgroundColor: task.isCompleted ? getEventColor(task.calendar) : 'transparent'
            }
          ]}>
            {task.isCompleted && (
              <Text style={{ fontSize: 12, color: '#000000' }}>✓</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Timeline Area Component
const TimelineArea: React.FC<{ theme: any; tasks: Task[]; onToggleComplete: (taskId: string) => void }> = ({ theme, tasks, onToggleComplete }) => (
  <View style={styles.timelineContainer}>
    <View style={styles.timelineBanner}>
      <Text style={[styles.bannerText, { color: theme.colors.text.secondary }]}>
        Jordan in Office
      </Text>
    </View>
    <ScrollView style={styles.timelineContent} showsVerticalScrollIndicator={false}>
      <View style={styles.scrollableTimeline}>
        <TimeRail theme={theme} />
        <View style={styles.tasksContainer}>
          <View style={styles.tasksContent}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} theme={theme} onToggleComplete={onToggleComplete} />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  </View>
);


// Bottom Tab Bar Component
const BottomTabBar: React.FC<{ theme: any }> = ({ theme }) => {
  const tabs = [
    { name: 'Inbox', icon: '📥', active: true },
    { name: 'Timeline', icon: '⏰', active: false },
    { name: 'AI', icon: '✨', active: false },
    { name: 'Settings', icon: '⚙️', active: false },
  ];

  return (
    <View style={[styles.tabBar, { backgroundColor: theme.colors.surface }]}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab.name} style={styles.tabItem}>
          <Text
            style={{
              fontSize: 20,
              color: tab.active ? '#FF8A4A' : theme.colors.text.secondary,
            }}
          >
            {tab.icon}
          </Text>
          <Text
            style={[
              styles.tabLabel,
              { color: tab.active ? '#FF8A4A' : theme.colors.text.secondary },
            ]}
          >
            {tab.name}
          </Text>
          {tab.active && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={[styles.addButton, { backgroundColor: '#FFFFFF' }]}>
        <Text style={{ fontSize: 24, color: '#000000', fontWeight: 'bold' }}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

// Main TimelineScreen Component
const TimelineScreen: React.FC = () => {
  const [isDark, setIsDark] = useState(true); // Use dark theme by default
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [tasks, setTasks] = useState<Task[]>(placeholderTasks);
  const theme = useTheme(isDark);

  const handleToggleComplete = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      <StatusBar style="light" translucent={false} />
      <View style={styles.safeAreaPadding}>
        <Header theme={theme} />
      
      <DateStrip
        theme={theme}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
      
      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
      
        <TimelineArea theme={theme} tasks={tasks} onToggleComplete={handleToggleComplete} />
        
        <BottomTabBar theme={theme} />
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  safeAreaPadding: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  navArrow: {
    padding: 4,
  },
  dateStrip: {
    paddingVertical: 16,
  },
  dateStripContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  dateItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 50,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
  timelineContainer: {
    flex: 1,
  },
  timelineBanner: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timelineContent: {
    flex: 1,
  },
  scrollableTimeline: {
    flexDirection: 'row',
    minHeight: 1000,
  },
  timeRail: {
    width: 55,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 0,
  },
  timeSlot: {
    height: 50,
    justifyContent: 'center',
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: '400',
    marginBottom: 8,
    lineHeight: 14,
  },
  tasksContainer: {
    flex: 1,
    paddingTop: 20,
  },
  tasksContent: {
    paddingRight: 20,
  },
  taskContainer: {
    marginBottom: 8,
    paddingLeft: 0,
    paddingRight: 0,
  },
  overlappingText: {
    fontSize: 12,
    marginLeft: 55,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
    paddingLeft: 15,
    paddingRight: 0,
  },
  taskIconContainer: {
    width: 55,
    alignItems: 'flex-end',
    paddingRight: 0,
  },
  taskBar: {
    width: 40,
    borderRadius: 20,
    marginRight: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: 52,
  },
  taskIconInBar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 52,
  },
  taskDetails: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  taskTime: {
    fontSize: 12,
    fontWeight: '400',
  },
  taskCheckbox: {
    paddingLeft: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF8A4A',
    transform: [{ translateX: -2 }],
  },
  addButton: {
    position: 'absolute',
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default TimelineScreen;
