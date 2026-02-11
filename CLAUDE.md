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
- `src/components/dashboard/` - Dashboard widgets (WeekSelector, ChecklistCard, QuickStats, DailyProgress)
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

Warm, earthy wellness theme — friendly, calm, minimal design with a beige/brown/orange palette.

### Color Palette (defined in `src/config/colors.js`, imported by `tailwind.config.js`)

- **Surfaces**: `bg-surface` (#F8F2EF, warm beige background), `bg-surface-card` (#FFFFFF, cards), `bg-surface-input` (#F3EDE9, inputs/disabled), `bg-surface-hover` (#EDE5E0, pressed states)
- **Primary**: `bg-primary` (#292D32, dark) for active day selection, `text-primary` for primary text
- **Secondary**: `bg-secondary` (#652D07, deep brown) for section headers and accents, `text-secondary` for links
- **Accent**: `bg-accent` (#FF7617, orange) for CTA buttons, active pills, completion markers, `text-accent` for highlights
- **Text**: `text-text` (#292D32, primary), `text-text-secondary` (#6B5E57), `text-text-muted` (#A09389, subtext), `text-text-inverse` (#FFFFFF, on dark bg)
- **Success**: `bg-success` (#ADCC39, green), `bg-success-light` (#F2F8E1), `text-success-dark` (#8AAD1E)
- **Danger**: `bg-danger` (#E53935), `bg-danger-light` (#FFEBEE), `text-danger-dark` (#C62828)
- **Pastel icon backgrounds**: `bg-pastel-amber` (#FFF3E0), `bg-pastel-green` (#F2F8E1), `bg-pastel-brown` (#F5EBE0), `bg-pastel-orange` (#FFF0E5), `bg-pastel-pink` (#FCE4EC)
- **Borders**: `border-border` (#E8DDD6)

### Typography Scale

- Heading XL: `text-heading-xl` (32px, bold) — greeting, titles
- Heading M: `text-heading-m` (20px, semibold) — section headers
- Body: `text-body` (16px) — regular text
- Caption: `text-caption` (12px) — small labels, badges

### Component Patterns

- Use NativeWind `className` on all React Native components
- Cards: `bg-surface-card rounded-card` borderless, with warm shadow (`shadowColor: "#6B5E57"`, `shadowOpacity: 0.08, shadowRadius: 12, elevation: 2`)
- Submit buttons: `bg-accent rounded-full` (pill) with `text-text-inverse`, orange shadow
- Radio groups: pill-shaped (`rounded-full`), selected = `bg-accent`, unselected = `bg-surface-card border border-border`
- Toggle buttons: pill-shaped (`rounded-full`), "Sim" selected = `bg-accent`, "Nao" selected = `bg-surface-input`
- Inputs: `bg-surface-card border border-border rounded-full` with `placeholderTextColor="#A09389"`
- Section headers: `text-secondary` (deep brown #652D07), no divider line
- Icons: Use `@expo/vector-icons` Ionicons in warm pastel-bg rounded squares (36-44px), brown/orange/dark colors
- Touch targets: minimum `py-3` for interactive elements
- Border radius: `rounded-card` (16px) for cards, `rounded-button` (14px) for buttons, `rounded-full` for pills/toggles/radio
- Spacing: `p-5` for screen padding, `mb-5` between form elements, `gap-3` for grid layouts

### Navigation

- Headers: `backgroundColor: "#F8F2EF"`, `headerTintColor: "#292D32"`, `headerShadowVisible: false`
- Tab bar: bg `#FFFFFF`, borderTop `#E8DDD6`, active `#652D07`, inactive `#A09389`
- StatusBar: `style="dark"`
- `Link` components from expo-router use inline `style={{}}` with `color: "#652D07"`
- ActivityIndicator color: `"#FF7617"` (orange)

### Dashboard

- Greeting header with formatted date (e.g., "Quinta, 11 de Fevereiro")
- Horizontal `WeekSelector` component showing Mon-Sun with date numbers, active day = `bg-primary` (#292D32) with white text
- Vertical checklist cards with timeline: `ChecklistCard` component
- Card titles: "Como foi sua noite?", "Como foi sua manha?", "Como foi sua tarde?"
- Timeline with dotted line (#E8DDD6), orange filled circle (complete) or gray outline (pending)

### Accessibility

- `accessibilityRole` and `accessibilityState` on interactive components

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
