import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import type { DayEntry } from "../../types/entry";
import { formatDateDisplay } from "../../utils/date";
import { SLEEP_QUALITY_LABELS } from "../../utils/form-labels";
import { FORM_ICONS } from "../../config/constants";

interface EntryCardProps {
  entry: DayEntry;
}

interface FormIndicatorProps {
  icon: string;
  filled: boolean;
  type: "morning" | "noon" | "evening";
}

const INDICATOR_COLORS = {
  morning: "bg-amber-500/30",
  noon: "bg-sky-500/30",
  evening: "bg-violet-500/30",
};

function FormIndicator({ icon, filled, type }: FormIndicatorProps) {
  return (
    <View
      className={`w-9 h-9 rounded-full items-center justify-center ${
        filled ? INDICATOR_COLORS[type] : "bg-base-700"
      }`}
    >
      <Text className={`text-base ${filled ? "opacity-100" : "opacity-30"}`}>
        {icon}
      </Text>
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
      className="bg-base-800 rounded-2xl p-4 mb-3"
    >
      {/* Header row: date + form indicators */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-base-100 text-sm font-semibold flex-1" numberOfLines={1}>
          {formatDateDisplay(entry.dateString)}
        </Text>

        <View className="flex-row gap-2">
          <FormIndicator icon={FORM_ICONS.morning} filled={hasMorning} type="morning" />
          <FormIndicator icon={FORM_ICONS.noon} filled={hasNoon} type="noon" />
          <FormIndicator icon={FORM_ICONS.evening} filled={hasEvening} type="evening" />
        </View>
      </View>

      {/* Sleep details when morning data exists */}
      {hasMorning && (
        <View className="flex-row items-center gap-3 mt-1">
          <View className="flex-row items-center gap-1">
            <Text className="text-base-500 text-xs">Sono:</Text>
            <Text className="text-base-100 text-xs font-bold">
              {entry.morning!.hoursSlept}h
            </Text>
          </View>

          <View className="flex-row items-center gap-1">
            <Text className="text-base-500 text-xs">Qualidade:</Text>
            <Text className="text-base-100 text-xs font-bold">
              {SLEEP_QUALITY_LABELS[entry.morning!.sleepQuality]}
            </Text>
          </View>
        </View>
      )}

      {/* No data indicator */}
      {!hasMorning && !hasNoon && !hasEvening && (
        <Text className="text-base-500/60 text-xs mt-1">
          Nenhum formulario preenchido
        </Text>
      )}
    </TouchableOpacity>
  );
}
