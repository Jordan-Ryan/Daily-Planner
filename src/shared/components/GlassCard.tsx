import React from 'react';
import { View, ViewStyle, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { GlassEffect } from './GlassEffect';
import { Theme } from '../types';

interface GlassCardProps extends Omit<TouchableOpacityProps, 'style'> {
  children: React.ReactNode;
  style?: ViewStyle;
  theme: Theme;
  intensity?: 'light' | 'medium' | 'heavy';
  borderRadius?: number;
  padding?: number;
  margin?: number;
  onPress?: () => void;
  disabled?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  theme,
  intensity = 'medium',
  borderRadius = 16,
  padding = 16,
  margin = 8,
  onPress,
  disabled = false,
  ...touchableProps
}) => {
  const cardStyle: ViewStyle = {
    padding,
    margin,
    borderRadius,
    minHeight: 60,
    justifyContent: 'center',
  };

  const content = (
    <GlassEffect
      theme={theme}
      intensity={intensity}
      borderRadius={borderRadius}
      style={[cardStyle, style]}
    >
      {children}
    </GlassEffect>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        {...touchableProps}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};
