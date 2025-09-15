# Daily Planner - Timeline UI Wireframe

A React Native UI-only wireframe for a "Structured-like" daily Timeline screen built with Expo and TypeScript.

## Features

- **Timeline View**: Daily timeline with time rail and task cards
- **Date Strip**: Horizontal scrollable 7-day date selector
- **Task Cards**: Visual task representation with time ranges and accent colors
- **Theme Support**: Light/Dark theme with grayscale palette and accent colors
- **Responsive Design**: Optimized for iPhone with proper safe areas
- **Static Data**: No backend required - uses placeholder data

## Tech Stack

- Expo (latest)
- React Native
- TypeScript
- react-native-safe-area-context
- @expo/vector-icons

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on iOS simulator or device:
```bash
npm run ios
```

## Project Structure

- `App.tsx` - Main app entry point
- `TimelineScreen.tsx` - Main timeline screen with all subcomponents
- `theme.ts` - Theme tokens and color system
- `package.json` - Dependencies and scripts

## Components

The TimelineScreen includes all subcomponents in a single file for simplicity:

- **Header**: Month title and icon placeholders
- **DateStrip**: Horizontal scrollable date selector
- **TimelineArea**: Time rail and task cards
- **FloatingActionButton**: Add task button
- **BottomTabBar**: Navigation tabs

## Styling

- Clean, minimal iOS-style design
- Grayscale color palette with subtle accent colors
- Proper spacing and typography hierarchy
- Platform-safe shadows and touch targets
- Accessibility-friendly contrast ratios

## Notes

This is a UI-only wireframe with no real data fetching or business logic. All interactions are mock implementations for visualization purposes.