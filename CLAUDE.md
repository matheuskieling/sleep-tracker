# Sleep Tracker

## Project Overview

Personal sleep and habit tracking app built with Expo + React Native + Firebase. Sends push notifications at 3 fixed times (8h, 12h, 20h BRT) for the user to fill forms about sleep, meals, habits, and mental state. Data is sent to Claude API for analysis of daytime sleepiness causes.

## Tech Stack

- **Expo SDK 54** with Expo Router (file-based routing)
- **TypeScript** (strict)
- **React Native Firebase** (`@react-native-firebase/app`, `/auth`, `/firestore`, `/messaging`)
- **expo-dev-client** (required for native Firebase modules, cannot use Expo Go)
- **NativeWind v4** + Tailwind CSS v3
- **Firebase Cloud Functions** (Node.js) for scheduled notifications
- **@react-native-community/datetimepicker** for native date selection
- **Claude API** (Sonnet 4.5) for data analysis

## Project Structure

- `app/` - Expo Router screens (auth, tabs, form routes)
- `app/(auth)/` - Login, register, forgot-password (unauthenticated)
- `app/(tabs)/` - Dashboard, history, report (authenticated)
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

## Critical: Firebase Modular API

Uses the **modular API** (v21+) to avoid deprecation warnings. `src/config/firebase.ts` exports singleton instances:

```typescript
import { getFirestore } from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";
import { getMessaging } from "@react-native-firebase/messaging";

export const db = getFirestore();
export const auth = getAuth();
export const messaging = getMessaging();
```

**DO:**
- Import `db`, `auth`, `messaging` instances from `../config/firebase`
- Import modular functions directly from `@react-native-firebase/*` packages (e.g. `collection`, `doc`, `getDoc`, `setDoc`, `signInWithEmailAndPassword`, `onAuthStateChanged`, `requestPermission`)
- Use `serverTimestamp()` from `@react-native-firebase/firestore` (not `firestore.FieldValue.serverTimestamp()`)
- Use `any` type instead of Firebase type imports where needed

**DO NOT:**
- Use the deprecated namespaced API (`auth()`, `firestore()`, `messaging()` as callable functions)
- Import Firebase types like `{ FirebaseFirestoreTypes }` or `{ FirebaseAuthTypes }` — these trigger full module evaluation and crash the app
- Use `{ firebase }` named import from any Firebase package
- Chain methods on Firestore: `firestore().collection().doc()` — use modular `collection()`, `doc()`, `getDoc()`, `setDoc()` etc.

## Critical: Do NOT Use SafeAreaView

`SafeAreaView` from `react-native-safe-area-context` crashes the app at runtime. This is a known issue with the current native build.

**DO NOT** import or use `SafeAreaView` from `react-native-safe-area-context` in any screen or component.

Instead, use plain `<View>` with appropriate padding, or rely on Expo Router's `Stack`/`Tabs` which handle safe areas internally.

## Style Guidelines

- Use NativeWind `className` on all React Native components (`View`, `Text`, `TextInput`, `TouchableOpacity`, `ScrollView`, etc.)
- Color palette: slate neutral (`base`) + indigo accent (`accent`) dark theme
- Backgrounds: `bg-base-900` (#0f172a) for screens, `bg-base-800` (#1e293b) for cards/inputs
- Text colors: `text-base-100` (#f1f5f9, primary), `text-base-300` (#cbd5e1, labels), `text-base-400` (#94a3b8, muted), `text-base-500` (#64748b, subtle)
- Accent: `bg-accent-dark` (#4f46e5) for buttons, `bg-accent-subtle` (rgba(99,102,241,0.2)) for selected states
- Borders: `border-base-700` (#334155, default/inputs), `border-accent` (#6366f1, active)
- Semantic colors: emerald for "Sim"/success, red for "Nao"/danger, amber/sky/violet for morning/noon/evening forms
- Placeholder color: `#64748b` (base-500) for all TextInputs
- Headers: `backgroundColor: "#0f172a"`, `headerTintColor: "#f1f5f9"`, `headerShadowVisible: false`
- Tab bar: bg `#0f172a`, borderTop `#334155`, active `#6366f1`, inactive `#64748b`
- Touch targets: minimum `py-3` for interactive elements (RadioGroup, ToggleButton)
- Border radius: `rounded-xl` for inputs/buttons, `rounded-2xl` for cards
- Spacing: `p-5` for screen padding, `mb-4` between elements, `gap-3` for grid layouts
- `Link` components from expo-router use inline `style={{}}` with `color: "#6366f1"` for text styles
- Accessibility: `accessibilityRole` and `accessibilityState` on interactive components

## Commands

- `npx expo start` - Start Metro dev server
- `npx expo run:android` - Build and run Android dev client
- `npx expo run:ios` - Build and run iOS dev client
- `.\rebuild-android.bat` - Clean rebuild of Android dev client (sets JAVA_HOME, cleans build artifacts, installs deps, runs build)
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
