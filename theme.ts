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
}

export const lightTheme: Theme = {
  colors: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    primary: '#007AFF',
    secondary: '#8E8E93',
    text: {
      primary: '#0A0A0A',
      secondary: '#6D6D70',
      tertiary: '#8E8E93',
    },
    accent: {
      blue: '#A8B0FF',
      green: '#B0E1D1',
      purple: '#D1B0E1',
      orange: '#FFD1A8',
    },
    border: '#E5E5EA',
    shadow: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  typography: {
    title: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 34,
    },
    heading: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 20,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 18,
    },
  },
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
  },
};

export const darkTheme: Theme = {
  colors: {
    background: '#0A0A0A',
    surface: '#1C1C1E',
    primary: '#0A84FF',
    secondary: '#8E8E93',
    text: {
      primary: '#F5F5F5',
      secondary: '#AEAEB2',
      tertiary: '#8E8E93',
    },
    accent: {
      blue: '#5A6CFF',
      green: '#4AE1A8',
      purple: '#A84AE1',
      orange: '#FF8A4A',
    },
    border: '#38383A',
    shadow: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  typography: {
    title: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 34,
    },
    heading: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 20,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 18,
    },
  },
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
    },
  },
};

export const useTheme = (isDark: boolean = false): Theme => {
  return isDark ? darkTheme : lightTheme;
};
