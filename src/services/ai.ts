import type { DayEntry } from "../types/entry";
import {
  SLEEP_QUALITY_LABELS,
  MEAL_SIZE_LABELS,
  WAKE_SLEEPINESS_LABELS,
  SLEEPINESS_LEVEL_LABELS,
  FOCUS_LEVEL_LABELS,
  STRESS_LEVEL_LABELS,
  ANXIETY_LEVEL_LABELS,
} from "../utils/form-labels";

const API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY;

function formatEntriesForAnalysis(entries: DayEntry[]): string {
  // Format entries into readable text for Claude
  return entries.map(entry => {
    let text = `\n--- ${entry.dateString} ---\n`;

    if (entry.morning) {
      const m = entry.morning;
      text += `Manhã:\n`;
      text += `  Horas de sono: ${m.hoursSlept}h\n`;
      text += `  Qualidade: ${SLEEP_QUALITY_LABELS[m.sleepQuality] ?? "Não informado"}\n`;
      text += `  Despertares: ${m.nightAwakenings}\n`;
      text += `  Janta: ${MEAL_SIZE_LABELS[m.dinner] ?? "Não informado"}\n`;
      text += `  Sono ao acordar: ${WAKE_SLEEPINESS_LABELS[m.wakeSleepiness] ?? "Não informado"}\n`;
      if (m.observations) text += `  Obs: ${m.observations}\n`;
    }

    if (entry.noon) {
      const n = entry.noon;
      text += `Meio-dia:\n`;
      text += `  Sono de manhã: ${SLEEPINESS_LEVEL_LABELS[n.morningSleepiness] ?? "Não informado"}\n`;
      if (n.sleepinessTime) text += `  Horário: ${n.sleepinessTime}\n`;
      text += `  Dormiu: ${n.slept ? "Sim" : "Não"}\n`;
      text += `  Luz solar: ${n.sunlight ? "Sim" : "Não"}\n`;
      text += `  Café da manhã: ${MEAL_SIZE_LABELS[n.breakfast] ?? "Não informado"}\n`;
      text += `  Café: ${n.coffee ? "Sim" : "Não"}\n`;
      text += `  Doce: ${n.sweets ? "Sim" : "Não"}\n`;
      text += `  Exercício: ${n.exercise ? "Sim" : "Não"}\n`;
      text += `  Foco: ${FOCUS_LEVEL_LABELS[n.focus] ?? "Não informado"}\n`;
      text += `  Estresse: ${STRESS_LEVEL_LABELS[n.stress] ?? "Não informado"}\n`;
      text += `  Ansiedade: ${ANXIETY_LEVEL_LABELS[n.anxiety] ?? "Não informado"}\n`;
      if (n.observations) text += `  Obs: ${n.observations}\n`;
    }

    if (entry.evening) {
      const e = entry.evening;
      text += `Noite:\n`;
      text += `  Sono à tarde: ${SLEEPINESS_LEVEL_LABELS[e.afternoonSleepiness] ?? "Não informado"}\n`;
      if (e.sleepinessTime) text += `  Horário: ${e.sleepinessTime}\n`;
      text += `  Dormiu: ${e.slept ? "Sim" : "Não"}\n`;
      text += `  Almoço: ${MEAL_SIZE_LABELS[e.lunch] ?? "Não informado"}\n`;
      text += `  Café: ${e.coffee ? "Sim" : "Não"}\n`;
      text += `  Doce: ${e.sweets ? "Sim" : "Não"}\n`;
      text += `  Exercício: ${e.exercise ? "Sim" : "Não"}\n`;
      text += `  Foco: ${FOCUS_LEVEL_LABELS[e.focus] ?? "Não informado"}\n`;
      text += `  Estresse: ${STRESS_LEVEL_LABELS[e.stress] ?? "Não informado"}\n`;
      text += `  Ansiedade: ${ANXIETY_LEVEL_LABELS[e.anxiety] ?? "Não informado"}\n`;
      if (e.observations) text += `  Obs: ${e.observations}\n`;
    }

    if (!entry.morning && !entry.noon && !entry.evening) {
      text += `  (Nenhum formulário preenchido)\n`;
    }

    return text;
  }).join("\n");
}

export function buildReportPrompt(entries: DayEntry[]): string {
  if (entries.length === 0) {
    throw new Error("Nenhum dado encontrado para o período selecionado.");
  }

  const formattedData = formatEntriesForAnalysis(entries);

  return `Analise os dados de sono e hábitos abaixo. Responda em português brasileiro com markdown conciso (até 4 seções curtas). Não inclua recomendações.

Foque em:
1. Padrões de sono (duração, qualidade, consistência)
2. Possíveis causas da sonolência diurna
3. Correlações entre alimentação, exercício e qualidade do sono
4. Impacto do estresse e ansiedade no sono

Dados:
${formattedData}`;
}

export async function generateReport(entries: DayEntry[]): Promise<string> {
  if (!API_KEY) {
    throw new Error("API key não configurada. Defina EXPO_PUBLIC_CLAUDE_API_KEY no arquivo .env");
  }

  const prompt = buildReportPrompt(entries);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `Erro na API: ${response.status} - ${errorData?.error?.message || "Erro desconhecido"}`
    );
  }

  const data = await response.json();
  return data.content[0].text;
}
