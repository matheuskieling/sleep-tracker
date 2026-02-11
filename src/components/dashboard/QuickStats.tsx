import React from "react";
import { View, Text } from "react-native";

import type { DayEntry } from "../../types/entry";
import { SLEEP_QUALITY_LABELS } from "../../utils/form-labels";
import type { SleepQuality } from "../../types/entry";

interface QuickStatsProps {
  entries: DayEntry[];
}

function computeAverageSleep(entries: DayEntry[]): string {
  const mornings = entries.filter((e) => e.morning);
  if (mornings.length === 0) return "--";
  const total = mornings.reduce((sum, e) => sum + e.morning!.hoursSlept, 0);
  return (total / mornings.length).toFixed(1);
}

function computeMostCommonQuality(entries: DayEntry[]): string {
  const mornings = entries.filter((e) => e.morning);
  if (mornings.length === 0) return "--";

  const counts: Record<string, number> = {};
  mornings.forEach((e) => {
    const q = e.morning!.sleepQuality;
    counts[q] = (counts[q] || 0) + 1;
  });

  const topQuality = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  return SLEEP_QUALITY_LABELS[topQuality as SleepQuality];
}

function computeStreak(entries: DayEntry[]): number {
  // Count consecutive days from most recent that have at least one form filled
  const sorted = [...entries].sort((a, b) =>
    b.dateString.localeCompare(a.dateString)
  );

  let streak = 0;
  for (const entry of sorted) {
    const hasData = !!entry.morning || !!entry.noon || !!entry.evening;
    if (hasData) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <View className="flex-1 bg-base-800 rounded-2xl p-4 items-center">
      <Text className="text-xl mb-1">{icon}</Text>
      <Text className="text-base-100 text-lg font-bold">{value}</Text>
      <Text className="text-base-400 text-xs text-center mt-1">{label}</Text>
    </View>
  );
}

export function QuickStats({ entries }: QuickStatsProps) {
  if (entries.length === 0) {
    return (
      <View className="bg-base-800 rounded-2xl p-6 items-center">
        <Text className="text-base-400 text-sm text-center">
          Nenhum dado disponivel. Preencha os formularios para ver estatisticas.
        </Text>
      </View>
    );
  }

  const avgSleep = computeAverageSleep(entries);
  const topQuality = computeMostCommonQuality(entries);
  const streak = computeStreak(entries);

  return (
    <View className="flex-row gap-3">
      <StatCard
        icon="😴"
        label="Media de sono"
        value={avgSleep === "--" ? "--" : `${avgSleep}h`}
      />
      <StatCard
        icon="⭐"
        label="Qualidade comum"
        value={topQuality}
      />
      <StatCard
        icon="🔥"
        label="Sequencia"
        value={`${streak} dia${streak !== 1 ? "s" : ""}`}
      />
    </View>
  );
}
