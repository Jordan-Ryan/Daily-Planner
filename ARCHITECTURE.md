# Daily Planner - MVC Architecture Overview

This project follows a **Model-View-Controller (MVC)** architecture pattern with **Feature-Based Organization**, ideal for React Native applications. Here's how it's organized:

## 📁 Folder Structure

```
src/
├── features/
│   ├── inbox/
│   │   ├── components/         # Screen components (Controllers)
│   │   ├── views/             # Pure UI components (Views)
│   │   ├── controllers/       # Business logic (Controllers)
│   │   ├── hooks/             # React hooks for state management
│   │   ├── styles/            # Component-specific styles
│   │   └── types/             # Feature-specific types
│   ├── timeline/
│   │   ├── components/        # Screen components (Controllers)
│   │   ├── views/             # Pure UI components (Views)
│   │   ├── controllers/       # Business logic (Controllers)
│   │   ├── hooks/             # React hooks for state management
│   │   ├── services/          # Data services and models
│   │   ├── styles/            # Component-specific styles
│   │   └── types/             # Feature-specific types
│   ├── settings/
│   │   ├── components/        # Screen components (Controllers)
│   │   ├── views/             # Pure UI components (Views)
│   │   ├── controllers/       # Business logic (Controllers)
│   │   ├── hooks/             # React hooks for state management
│   │   ├── styles/            # Component-specific styles
│   │   └── types/             # Feature-specific types
│   └── [other-features]/
├── shared/
│   ├── components/            # Reusable UI components
│   ├── hooks/                 # Shared custom hooks
│   ├── services/              # Shared business logic
│   ├── types/                 # Shared TypeScript types
│   └── styles/                # Theme system and global styles
```

## 🏗️ MVC Architecture Principles

### 1. **Model (Data Layer)**
- **Services**: Handle data fetching, API calls, and data persistence
- **Models**: Define data structures and business entities
- **Types**: TypeScript interfaces for type safety

### 2. **View (Presentation Layer)**
- **Views**: Pure UI components with no business logic
- **Styles**: Separated styling files for each component
- **Props**: Receive data and callbacks from controllers

### 3. **Controller (Logic Layer)**
- **Controllers**: Handle business logic, state management, and user interactions
- **Hooks**: React hooks that connect controllers to views
- **Components**: Screen-level components that orchestrate the MVC flow

### 4. **Separation of Concerns**
- **Views**: Only handle UI rendering and user input
- **Controllers**: Manage state, business logic, and data flow
- **Models**: Handle data operations and persistence
- **Styles**: Completely separated from component logic

## 🔧 Key Components

### Inbox Feature (MVC Example)
- **InboxScreen** (Controller): Orchestrates the MVC flow
- **InboxView** (View): Pure UI component for rendering
- **InboxController** (Controller): Business logic and state management
- **InboxStyles** (View): Separated styling
- **useInbox** (Hook): Connects controller to view

### Timeline Feature
- **TimelineScreen** (Controller): Main timeline controller
- **TimelineView** (View): Pure UI component
- **TimelineController** (Controller): Business logic
- **TimelineService** (Model): Data operations
- **TaskModel** (Model): Data structure management

### Settings Feature
- **SettingsScreen** (Controller): Settings controller
- **SettingsView** (View): Pure UI component
- **SettingsController** (Controller): Settings state management
- **SettingsStyles** (View): Separated styling

### Shared Components
- **BottomTabBar**: Main navigation
- **Theme System**: Centralized styling

## 🎯 MVC Benefits

1. **Clear Separation**: Views, Controllers, and Models are distinct
2. **Testability**: Each layer can be tested independently
3. **Maintainability**: Changes in one layer don't affect others
4. **Reusability**: Views can be reused with different controllers
5. **Scalability**: Easy to add new features following the same pattern
6. **Type Safety**: Full TypeScript coverage across all layers

## 🚀 Usage Examples

```typescript
// Import MVC components
import { InboxScreen } from './src/features/inbox/components/InboxScreen';
import { InboxView } from './src/features/inbox/views/InboxView';
import { InboxController } from './src/features/inbox/controllers/InboxController';
import { useInbox } from './src/features/inbox/hooks/useInbox';

// Import shared utilities
import { useTheme } from './src/shared/hooks/useTheme';
```

## 📝 Adding New Features (MVC Pattern)

1. Create a new folder under `src/features/[feature-name]/`
2. Add the following subfolders:
   - `components/` - Screen-level controllers
   - `views/` - Pure UI components
   - `controllers/` - Business logic classes
   - `hooks/` - React hooks for state management
   - `styles/` - Component-specific styles
   - `types/` - Feature-specific TypeScript types
   - `services/` - Data services (if needed)
3. Follow the MVC pattern:
   - **View**: Pure UI with props and callbacks
   - **Controller**: Business logic and state management
   - **Model**: Data operations and persistence
4. Use shared components and utilities when possible

## 🔄 MVC Flow

1. **User Interaction** → View receives input
2. **View** → Calls callback prop to Controller
3. **Controller** → Processes business logic
4. **Controller** → Updates Model/State
5. **Model** → Notifies Controller of changes
6. **Controller** → Updates View via props
7. **View** → Re-renders with new data

This MVC architecture makes the codebase maintainable, scalable, testable, and easy to understand!
