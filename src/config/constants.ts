import type { FormType } from "../types/entry";

export const NOTIFICATION_HOURS: Record<FormType, number> = {
  morning: 8,
  noon: 12,
  evening: 20,
};

export const FORM_TITLES: Record<FormType, string> = {
  morning: "Formulário da Manhã",
  noon: "Formulário do Meio-dia",
  evening: "Formulário da Noite",
};

export const FORM_CARD_TITLES: Record<FormType, string> = {
  morning: "Como foi sua noite?",
  noon: "Como foi sua manhã?",
  evening: "Como foi sua tarde?",
};

export const FORM_DESCRIPTIONS: Record<FormType, string> = {
  morning: "Registre como foi sua noite de sono",
  noon: "Registre como foi sua manhã",
  evening: "Registre como foi sua tarde",
};

export const FORM_ICONS: Record<FormType, string> = {
  morning: "🌅",
  noon: "☀️",
  evening: "🌙",
};
