import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { GlassEffect } from './GlassEffect';
import { Theme } from '../types';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  theme: Theme;
  style?: ViewStyle;
  textStyle?: TextStyle;
  intensity?: 'light' | 'medium' | 'heavy';
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'accent';
  disabled?: boolean;
  borderRadius?: number;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  theme,
  style,
  textStyle,
  intensity = 'medium',
  size = 'medium',
  variant = 'primary',
  disabled = false,
  borderRadius = 12,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          minHeight: 36,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          minHeight: 56,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          minHeight: 48,
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          textColor: theme.colors.background,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          textColor: theme.colors.background,
        };
      case 'accent':
        return {
          backgroundColor: theme.colors.accent.blue,
          textColor: theme.colors.background,
        };
      default:
        return {
          backgroundColor: theme.colors.primary,
          textColor: theme.colors.background,
        };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return theme.typography.caption.fontSize;
      case 'large':
        return theme.typography.heading.fontSize;
      default:
        return theme.typography.body.fontSize;
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.container, style]}
    >
      <GlassEffect
        theme={theme}
        intensity={intensity}
        borderRadius={borderRadius}
        style={[
          sizeStyles,
          {
            backgroundColor: disabled 
              ? theme.colors.glass.background 
              : variantStyles.backgroundColor,
            opacity: disabled ? 0.5 : 1,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              color: disabled ? theme.colors.text.tertiary : variantStyles.textColor,
              fontSize: getTextSize(),
              fontWeight: theme.typography.body.fontWeight,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </GlassEffect>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  text: {
    textAlign: 'center',
  },
});
