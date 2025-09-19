import React from 'react';
import { View, ViewStyle, Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Theme } from '../types';

interface GlassEffectProps {
  children: React.ReactNode;
  style?: ViewStyle;
  theme: Theme;
  intensity?: 'light' | 'medium' | 'heavy';
  tint?: 'light' | 'dark' | 'default';
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
}

export const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  style,
  theme,
  intensity = 'medium',
  tint = 'default',
  borderRadius = 16,
  borderWidth = 1,
  borderColor,
}) => {
  const getBlurIntensity = () => {
    switch (intensity) {
      case 'light':
        return theme.glass.blur.light;
      case 'heavy':
        return theme.glass.blur.heavy;
      default:
        return theme.glass.blur.medium;
    }
  };

  const getTintColor = () => {
    if (tint === 'default') {
      return theme.colors.glass.background;
    }
    return tint === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
  };

  const getBorderColor = () => {
    return borderColor || theme.colors.glass.border;
  };

  // For iOS, use native BlurView for authentic glass effect
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={getBlurIntensity()}
        tint={tint === 'default' ? (theme.colors.background === '#FFFFFF' ? 'light' : 'dark') : tint}
        style={[
          styles.container,
          {
            borderRadius,
            borderWidth,
            borderColor: getBorderColor(),
            backgroundColor: getTintColor(),
            // Enhanced shadow for iPhone glass effect
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
          },
          style,
        ]}
      >
        {children}
      </BlurView>
    );
  }

  // For Android, create a glass-like effect using semi-transparent backgrounds and shadows
  return (
    <View
      style={[
        styles.container,
        {
          borderRadius,
          borderWidth,
          borderColor: getBorderColor(),
          backgroundColor: getTintColor(),
          // Enhanced shadow for Android to simulate glass depth
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 16,
        },
        style,
      ]}
    >
      {/* Add a subtle highlight overlay for glass effect on Android */}
      <View
        style={[
          styles.highlightOverlay,
          {
            borderRadius: borderRadius - 1,
            backgroundColor: theme.colors.glass.highlight,
          },
        ]}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  highlightOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    opacity: 0.3,
  },
});
