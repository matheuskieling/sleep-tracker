# Sleep Tracker

A personal sleep and habit tracking app built to help my wife understand and manage her daytime sleepiness. The app collects data about sleep, meals, exercise, and mental state through three daily check-ins, then uses AI to analyze patterns and identify what's causing drowsiness throughout the day.

## How It Works

The app sends push notifications at three fixed times (Brazil timezone):

- **8:00 AM** — Morning form: sleep duration, quality, night awakenings, dinner size, wake sleepiness
- **12:00 PM** — Noon form: morning sleepiness, breakfast, caffeine, exercise, sunlight exposure, stress/anxiety/focus levels
- **8:00 PM** — Evening form: afternoon sleepiness, lunch, caffeine, exercise, stress/anxiety/focus levels

All data is stored per day in Firestore. When enough data is collected, the AI report feature sends the entries to Claude (Sonnet 4.5) for analysis — identifying correlations between habits and sleepiness, and providing actionable insights in Portuguese.

## Features

- **Dashboard** — Greeting with time-based message, weekly calendar selector, daily checklist with completion status, quick stats (avg sleep hours, most common quality, streak)
- **Forms** — Three structured questionnaires (morning/noon/evening) with radio groups, toggles, time pickers, and free-text observations. Supports editing previously submitted entries.
- **History** — Chronological list of entries with filter (7/14/30 days), entry detail view showing all submitted data
- **AI Reports** — Select a date range, generate a Claude-powered analysis of sleep patterns, save and revisit past reports
- **Push Notifications** — Firebase Cloud Functions send scheduled reminders, skipping if the form is already filled
- **Authentication** — Email/password login, registration, and password reset

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo SDK 54, React Native 0.81, React 19 |
| Routing | Expo Router (file-based) |
| Language | TypeScript (strict) |
| Styling | NativeWind v4 + Tailwind CSS v3 |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| Notifications | Firebase Cloud Messaging + Cloud Functions (Node.js) |
| AI | Claude API (Anthropic Sonnet 4.5) |

## Project Structure

```
app/
├── (auth)/           # Login, register, forgot-password
├── (tabs)/           # Dashboard, history, report
├── form/             # Morning, noon, evening forms
└── history/[date]    # Entry detail view

src/
├── components/       # UI, forms, dashboard, history, report components
├── services/         # Firebase auth, Firestore, FCM, Claude API
├── contexts/         # Auth context provider
├── hooks/            # useAuth, useEntry, useReport
├── types/            # TypeScript definitions
├── utils/            # Date formatting, PT-BR form labels
└── config/           # Firebase init, color palette, constants

functions/            # Firebase Cloud Functions (scheduled notifications)
```

## Getting Started

### Prerequisites

- Node.js
- Android Studio (with JDK) or Xcode
- Firebase project with Authentication, Firestore, and Cloud Messaging enabled

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add Firebase config files:
   - `android/app/google-services.json`
   - `ios/GoogleService-Info.plist`
4. Create a `.env` file:
   ```
   EXPO_PUBLIC_CLAUDE_API_KEY=your_anthropic_api_key
   ```
5. Build and run the dev client:
   ```bash
   npx expo run:android
   # or
   npx expo run:ios
   ```

> **Note:** This app uses `expo-dev-client` and cannot run on Expo Go due to native Firebase modules.

### Cloud Functions

```bash
cd functions
npm install
npm run build
npm run deploy
```

## Design

Warm, earthy wellness theme with a beige/brown/orange palette — designed to feel calm and friendly.

- **Background:** warm beige (#F8F2EF)
- **Accent:** orange (#FF7617) for buttons and active states
- **Secondary:** deep brown (#652D07) for headers
- **Cards:** white with soft shadows, 16px border radius
- **UI language:** Brazilian Portuguese (PT-BR)
