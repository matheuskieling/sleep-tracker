import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import type { DayEntry } from "../../types/entry";
import { getWeekdayName, formatDateExtended } from "../../utils/date";
import { SLEEP_QUALITY_LABELS } from "../../utils/form-labels";
import type { FormType } from "../../types/entry";

interface EntryCardProps {
  entry: DayEntry;
}

const INDICATOR_CONFIG: Record<FormType, { icon: string; color: string; bg: string }> = {
  morning: { icon: "moon-outline", color: "#652D07", bg: "bg-pastel-brown" },
  noon: { icon: "sunny-outline", color: "#FF7617", bg: "bg-pastel-orange" },
  evening: { icon: "partly-sunny-outline", color: "#D46010", bg: "bg-pastel-amber" },
};

interface FormIndicatorProps {
  filled: boolean;
  type: FormType;
}

function FormIndicator({ filled, type }: FormIndicatorProps) {
  const config = INDICATOR_CONFIG[type];
  return (
    <View
      className={`w-9 h-9 rounded-full items-center justify-center ${
        filled ? config.bg : "bg-surface-input"
      }`}
    >
      <Ionicons
        name={config.icon as any}
        size={16}
        color={filled ? config.color : "#A09389"}
      />
    </View>
  );
}

export function EntryCard({ entry }: EntryCardProps) {
  const router = useRouter();
  const hasMorning = !!entry.morning;
  const hasNoon = !!entry.noon;
  const hasEvening = !!entry.evening;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/history/${entry.dateString}`)}
      className="bg-surface-card rounded-card p-4 mb-3"
      style={{
        shadowColor: "#6B5E57",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Header row: date + form indicators */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-1">
          <Text className="text-text text-sm font-bold" numberOfLines={1}>
            {getWeekdayName(entry.dateString)}
          </Text>
          <Text className="text-text-muted text-caption mt-0.5" numberOfLines={1}>
            {formatDateExtended(entry.dateString)}
          </Text>
        </View>

        <View className="flex-row gap-2">
          <FormIndicator filled={hasMorning} type="morning" />
          <FormIndicator filled={hasNoon} type="noon" />
          <FormIndicator filled={hasEvening} type="evening" />
        </View>
      </View>

      {/* Sleep details when morning data exists */}
      {hasMorning && (
        <View className="flex-row items-center gap-3 mt-1">
          <View className="flex-row items-center gap-1">
            <Text className="text-text-muted text-caption">Sono:</Text>
            <Text className="text-text text-caption font-bold">
              {entry.morning!.hoursSlept}h
            </Text>
          </View>

          <View className="flex-row items-center gap-1">
            <Text className="text-text-muted text-caption">Qualidade:</Text>
            <Text className="text-text text-caption font-bold">
              {SLEEP_QUALITY_LABELS[entry.morning!.sleepQuality]}
            </Text>
          </View>
        </View>
      )}

      {/* No data indicator */}
      {!hasMorning && !hasNoon && !hasEvening && (
        <Text className="text-text-muted text-caption mt-1">
          Nenhum formulário preenchido
        </Text>
      )}
    </TouchableOpacity>
  );
}
