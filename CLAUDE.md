# Sleep Tracker

## Project Overview

Personal sleep and habit tracking app built with Expo + React Native + Firebase. Sends push notifications at 3 fixed times (8h, 12h, 20h BRT) for the user to fill forms about sleep, meals, habits, and mental state. Data is sent to Claude API for analysis of daytime sleepiness causes.

## Tech Stack

- **Expo SDK 52** with Expo Router (file-based routing)
- **TypeScript** (strict)
- **React Native Firebase** (`@react-native-firebase/app`, `/auth`, `/firestore`, `/messaging`)
- **expo-dev-client** (required for native Firebase modules, cannot use Expo Go)
- **NativeWind v4** + Tailwind CSS v3
- **Firebase Cloud Functions** (Node.js) for scheduled notifications
- **Claude API** (Sonnet 4.5) for data analysis

## Project Structure

- `app/` - Expo Router screens (auth, tabs, form routes)
- `app/(auth)/` - Login, register, forgot-password (unauthenticated)
- `app/(tabs)/` - Dashboard, forms list, history, report (authenticated)
- `app/form/` - Morning, noon, evening form screens (stack navigation)
- `src/types/` - TypeScript type definitions
- `src/config/` - Firebase init, constants
- `src/contexts/` - React contexts (Auth)
- `src/services/` - Firebase auth, Firestore, FCM, Claude API
- `src/hooks/` - Custom hooks (useAuth, useEntry)
- `src/components/ui/` - Reusable UI components (RadioGroup, ToggleButton, etc.)
- `src/components/forms/` - Form components (Morning, Noon, Evening)
- `src/components/dashboard/` - Dashboard widgets (DailyProgress, QuickStats)
- `src/components/history/` - History components (EntryCard)
- `src/components/report/` - AI report components (ReportView, DateRangePicker)
- `src/utils/` - Date utils, form labels (PT-BR mappings)
- `functions/` - Firebase Cloud Functions

## Conventions

- All UI text is in Brazilian Portuguese (PT-BR)
- Date display format: DD-MM-YYYY (all user-facing dates)
- Date internal format: YYYY-MM-DD (Firestore document IDs and range queries only)
- Use `toDisplayDate()` / `fromDisplayDate()` from `src/utils/date.ts` to convert between formats
- Firestore data is scoped per user: `users/{userId}/entries/{YYYY-MM-DD}`
- One document per day with 3 optional sections: morning, noon, evening
- Form field enums use snake_case Portuguese values
- NativeWind `className` for styling (no `StyleSheet.create`)
- Expo Router file-based navigation
- `Link` components use inline `style` prop (not `className`) for text styling

## Critical: Firebase Import Rules

All Firebase imports MUST go through `src/config/firebase.ts`. This file is the single source of truth:

```typescript
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
export { auth, firestore, messaging };
```

**DO NOT:**
- Import directly from `@react-native-firebase/*` in any other file
- Import Firebase types like `{ FirebaseFirestoreTypes }` or `{ FirebaseAuthTypes }` — these trigger full module evaluation and crash the app
- Use `{ firebase }` named import from any Firebase package — it doesn't exist and crashes at module load
- Use the old namespaced API (`firebase.auth()`, `firebase.firestore()`) — crashes silently

**DO:**
- Import from `../config/firebase` and call as functions: `auth()`, `firestore()`, `messaging()`
- Use `firestore.FieldValue.serverTimestamp()` for timestamps
- Use `any` type instead of Firebase type imports where needed

## Critical: Do NOT Use SafeAreaView

`SafeAreaView` from `react-native-safe-area-context` crashes the app at runtime. This is a known issue with the current native build.

**DO NOT** import or use `SafeAreaView` from `react-native-safe-area-context` in any screen or component.

Instead, use plain `<View>` with appropriate padding, or rely on Expo Router's `Stack`/`Tabs` which handle safe areas internally.

## Style Guidelines

- Use NativeWind `className` on all React Native components (`View`, `Text`, `TextInput`, `TouchableOpacity`, `ScrollView`, etc.)
- Color palette: indigo-based dark theme (`bg-primary-950` as main background, `bg-primary-900` for cards)
- Text colors: `text-indigo-100` (primary), `text-indigo-200` (secondary labels), `text-indigo-300` (muted), `text-indigo-400` (subtle)
- Accent: `bg-indigo-600` for buttons, `bg-indigo-500/20` for active/selected states
- Borders: `border-primary-800` (default), `border-indigo-500` (active), `border-indigo-700` (inputs)
- Border radius: `rounded-xl` for inputs/buttons, `rounded-2xl` for cards
- Spacing: `p-5` for screen padding, `mb-4` between elements, `gap-3` for grid layouts
- `Link` components from expo-router use inline `style={{}}` instead of `className` for text styles

## Commands

- `npx expo start` - Start Metro dev server
- `npx expo run:android` - Build and run Android dev client
- `npx expo run:ios` - Build and run iOS dev client
- `cd functions && npm run build` - Build Cloud Functions
- `cd functions && npm run deploy` - Deploy Cloud Functions

## Environment Variables

Required in `.env`:
- `EXPO_PUBLIC_CLAUDE_API_KEY` - Anthropic API key for AI reports

Firebase config is loaded from native files:
- `android/app/google-services.json` (Android)
- `ios/GoogleService-Info.plist` (iOS)

## Development Notes

- Requires `expo-dev-client` — cannot use Expo Go due to native Firebase modules
- After changing native dependencies, rebuild with `npx expo run:android`
- Metro hot-reload works for JS changes without rebuild
- JAVA_HOME must point to Android Studio's bundled JDK (`C:\Program Files\Android\Android Studio\jbr`)
