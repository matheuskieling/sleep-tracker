import type {
  SleepQuality,
  MealSize,
  WakeSleepiness,
  SleepinessLevel,
  FocusLevel,
  StressLevel,
  AnxietyLevel,
} from "../types/entry";

export const SLEEP_QUALITY_LABELS: Record<SleepQuality, string> = {
  muito_bom: "Muito Bom",
  bom: "Bom",
  ok: "OK",
  ruim: "Ruim",
  pessimo: "Péssimo",
};

export const MEAL_SIZE_LABELS: Record<MealSize, string> = {
  leve: "Leve",
  normal: "Normal",
  pesado: "Pesado",
};

export const WAKE_SLEEPINESS_LABELS: Record<WakeSleepiness, string> = {
  descansado: "Descansado",
  pouco_sono: "Pouco Sono",
  muito_sono: "Muito Sono",
};

export const SLEEPINESS_LEVEL_LABELS: Record<SleepinessLevel, string> = {
  bastante: "Bastante",
  pouco: "Pouco",
  nada: "Nada",
};

export const FOCUS_LEVEL_LABELS: Record<FocusLevel, string> = {
  muito_bom: "Muito Bom",
  bom: "Bom",
  ok: "OK",
  ruim: "Ruim",
  pessimo: "Péssimo",
};

export const STRESS_LEVEL_LABELS: Record<StressLevel, string> = {
  muito: "Muito",
  leve: "Leve",
  nada: "Nada",
};

export const ANXIETY_LEVEL_LABELS: Record<AnxietyLevel, string> = {
  muito: "Muito",
  leve: "Leve",
  nada: "Nada",
};
