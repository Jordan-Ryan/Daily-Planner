// Shared types across the application

export interface Theme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    accent: {
      blue: string;
      green: string;
      purple: string;
      orange: string;
    };
    border: string;
    shadow: string;
    // Glass morphism colors
    glass: {
      background: string;
      border: string;
      overlay: string;
      highlight: string;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  typography: {
    title: {
      fontSize: number;
      fontWeight: '600' | '700';
      lineHeight: number;
    };
    heading: {
      fontSize: number;
      fontWeight: '600' | '700';
      lineHeight: number;
    };
    body: {
      fontSize: number;
      fontWeight: '400' | '500';
      lineHeight: number;
    };
    caption: {
      fontSize: number;
      fontWeight: '400' | '500';
      lineHeight: number;
    };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    sm: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    md: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
  // Glass morphism effects
  glass: {
    blur: {
      light: number;
      medium: number;
      heavy: number;
    };
    opacity: {
      light: number;
      medium: number;
      heavy: number;
    };
    backdrop: {
      light: string;
      medium: string;
      heavy: string;
    };
  };
}

export interface DayData {
  date: number;
  dayName: string;
  isToday: boolean;
}

export type TabType = 'inbox' | 'timeline' | 'settings' | 'ideal-week' | 'habits' | 'health';

// Re-export habit types for convenience
export * from './habits';
