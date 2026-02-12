import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Skeleton } from "../ui/Skeleton";

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
  iconColor: string;
  iconBg: string;
}

function StatCard({ label, value, icon, iconColor, iconBg }: StatCardProps) {
  return (
    <View
      className="flex-1 bg-surface-card rounded-card p-3 items-center"
      style={{
        shadowColor: "#6B5E57",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className={`w-9 h-9 rounded-xl items-center justify-center mb-2 ${iconBg}`}>
        <Ionicons name={icon as any} size={18} color={iconColor} />
      </View>
      <Text className="text-text text-heading-m font-bold">{value}</Text>
      <Text className="text-text-muted text-caption text-center mt-1">{label}</Text>
    </View>
  );
}

export function QuickStats({ entries }: QuickStatsProps) {
  if (entries.length === 0) {
    return (
      <View
        className="bg-surface-card rounded-card p-6 items-center"
        style={{
          shadowColor: "#6B5E57",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <Text className="text-text-muted text-body text-center">
          Nenhum dado disponível. Preencha os formulários para ver estatísticas.
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
        icon="bed-outline"
        iconColor="#652D07"
        iconBg="bg-pastel-brown"
        label="Média de sono"
        value={avgSleep === "--" ? "--" : `${avgSleep}h`}
      />
      <StatCard
        icon="star-outline"
        iconColor="#FF7617"
        iconBg="bg-pastel-orange"
        label="Qualidade"
        value={topQuality}
      />
      <StatCard
        icon="flame-outline"
        iconColor="#D46010"
        iconBg="bg-pastel-amber"
        label="Sequência"
        value={`${streak}d`}
      />
    </View>
  );
}

function StatCardSkeleton({ icon, iconColor, iconBg, label }: Omit<StatCardProps, "value">) {
  return (
    <View
      className="flex-1 bg-surface-card rounded-card p-3 items-center"
      style={{
        shadowColor: "#6B5E57",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className={`w-9 h-9 rounded-xl items-center justify-center mb-2 ${iconBg}`}>
        <Ionicons name={icon as any} size={18} color={iconColor} />
      </View>
      <Skeleton width={40} height={28} borderRadius={6} />
      <Text className="text-text-muted text-caption text-center mt-1">{label}</Text>
    </View>
  );
}

export function QuickStatsSkeleton() {
  return (
    <View className="flex-row gap-3">
      <StatCardSkeleton
        icon="bed-outline"
        iconColor="#652D07"
        iconBg="bg-pastel-brown"
        label="Média de sono"
      />
      <StatCardSkeleton
        icon="star-outline"
        iconColor="#FF7617"
        iconBg="bg-pastel-orange"
        label="Qualidade"
      />
      <StatCardSkeleton
        icon="flame-outline"
        iconColor="#D46010"
        iconBg="bg-pastel-amber"
        label="Sequência"
      />
    </View>
  );
}
