export type SleepQuality = "muito_bom" | "bom" | "ok" | "ruim" | "pessimo";
export type MealSize = "leve" | "normal" | "pesado";
export type WakeSleepiness = "descansado" | "pouco_sono" | "muito_sono";
export type SleepinessLevel = "bastante" | "pouco" | "nada";
export type FocusLevel = "muito_bom" | "bom" | "ok" | "ruim" | "pessimo";
export type StressLevel = "muito" | "leve" | "nada";
export type AnxietyLevel = "muito" | "leve" | "nada";
export type FormType = "morning" | "noon" | "evening";

export interface MorningEntry {
  hoursSlept: number;
  sleepQuality: SleepQuality;
  nightAwakenings: number;
  dinner: MealSize;
  wakeSleepiness: WakeSleepiness;
  observations: string;
  submittedAt: any;
}

export interface NoonEntry {
  morningSleepiness: SleepinessLevel;
  sleepinessTime: string | null;
  slept: boolean;
  sunlight: boolean;
  breakfast: MealSize;
  coffee: boolean;
  sweets: boolean;
  exercise: boolean;
  observations: string;
  focus: FocusLevel;
  stress: StressLevel;
  anxiety: AnxietyLevel;
  submittedAt: any;
}

export interface EveningEntry {
  afternoonSleepiness: SleepinessLevel;
  sleepinessTime: string | null;
  slept: boolean;
  lunch: MealSize;
  coffee: boolean;
  sweets: boolean;
  exercise: boolean;
  observations: string;
  focus: FocusLevel;
  stress: StressLevel;
  anxiety: AnxietyLevel;
  submittedAt: any;
}

export interface DayEntry {
  dateString: string;
  createdAt: any;
  updatedAt: any;
  morning?: MorningEntry;
  noon?: NoonEntry;
  evening?: EveningEntry;
}

export interface UserProfile {
  name: string;
  email: string;
  createdAt: any;
  notificationsEnabled: boolean;
  fcmToken: string;
}

export interface Report {
  id: string;
  startDate: string;  // YYYY-MM-DD
  endDate: string;    // YYYY-MM-DD
  content: string;    // markdown
  createdAt: any;     // server timestamp
}
