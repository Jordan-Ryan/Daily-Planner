import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Theme } from '../types';
import { GlassEffect } from './GlassEffect';
import { GlassCard } from './GlassCard';
import { GlassButton } from './GlassButton';

interface GlassDemoProps {
  theme: Theme;
}

export const GlassDemo: React.FC<GlassDemoProps> = ({ theme }) => {
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Glass Effects Demo
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Cross-platform liquid glass UI components
        </Text>
      </View>

      {/* Glass Effect Intensities */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Glass Effect Intensities
        </Text>
        
        <GlassEffect
          theme={theme}
          intensity="light"
          borderRadius={12}
          style={styles.demoCard}
        >
          <Text style={[styles.demoText, { color: theme.colors.text.primary }]}>
            Light Glass Effect
          </Text>
        </GlassEffect>

        <GlassEffect
          theme={theme}
          intensity="medium"
          borderRadius={12}
          style={styles.demoCard}
        >
          <Text style={[styles.demoText, { color: theme.colors.text.primary }]}>
            Medium Glass Effect
          </Text>
        </GlassEffect>

        <GlassEffect
          theme={theme}
          intensity="heavy"
          borderRadius={12}
          style={styles.demoCard}
        >
          <Text style={[styles.demoText, { color: theme.colors.text.primary }]}>
            Heavy Glass Effect
          </Text>
        </GlassEffect>
      </View>

      {/* Glass Cards */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Glass Cards
        </Text>
        
        <GlassCard
          theme={theme}
          intensity="light"
          onPress={() => console.log('Light card pressed')}
        >
          <Text style={[styles.demoText, { color: theme.colors.text.primary }]}>
            Light Glass Card (Pressable)
          </Text>
        </GlassCard>

        <GlassCard
          theme={theme}
          intensity="medium"
          onPress={() => console.log('Medium card pressed')}
        >
          <Text style={[styles.demoText, { color: theme.colors.text.primary }]}>
            Medium Glass Card (Pressable)
          </Text>
        </GlassCard>
      </View>

      {/* Glass Buttons */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Glass Buttons
        </Text>
        
        <View style={styles.buttonRow}>
          <GlassButton
            title="Primary"
            onPress={() => console.log('Primary pressed')}
            theme={theme}
            variant="primary"
            size="small"
            intensity="light"
            style={styles.button}
          />
          <GlassButton
            title="Secondary"
            onPress={() => console.log('Secondary pressed')}
            theme={theme}
            variant="secondary"
            size="small"
            intensity="light"
            style={styles.button}
          />
        </View>

        <View style={styles.buttonRow}>
          <GlassButton
            title="Accent"
            onPress={() => console.log('Accent pressed')}
            theme={theme}
            variant="accent"
            size="medium"
            intensity="medium"
            style={styles.button}
          />
          <GlassButton
            title="Large"
            onPress={() => console.log('Large pressed')}
            theme={theme}
            variant="primary"
            size="large"
            intensity="heavy"
            style={styles.button}
          />
        </View>
      </View>

      {/* Platform Info */}
      <View style={styles.section}>
        <GlassCard theme={theme} intensity="medium">
          <Text style={[styles.demoText, { color: theme.colors.text.primary }]}>
            Platform: {require('react-native').Platform.OS}
          </Text>
          <Text style={[styles.demoText, { color: theme.colors.text.secondary }]}>
            iOS uses native BlurView for authentic glass effects
          </Text>
          <Text style={[styles.demoText, { color: theme.colors.text.secondary }]}>
            Android uses enhanced shadows and semi-transparent backgrounds
          </Text>
        </GlassCard>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  demoCard: {
    padding: 16,
    marginBottom: 12,
    minHeight: 60,
    justifyContent: 'center',
  },
  demoText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
  },
});
