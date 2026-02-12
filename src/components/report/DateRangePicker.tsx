import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { daysAgo, toDisplayDateSlash, parseDate, formatDate } from "../../utils/date";

interface DateRangePickerProps {
  startDate: string; // internal YYYY-MM-DD
  endDate: string; // internal YYYY-MM-DD
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
}

const PRESETS = [
  { label: "7 dias", days: 7 },
  { label: "14 dias", days: 14 },
  { label: "30 dias", days: 30 },
];

export function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: DateRangePickerProps) {
  const [showPicker, setShowPicker] = useState<"start" | "end" | null>(null);
  const today = new Date();

  function handlePreset(days: number) {
    onStartChange(daysAgo(days));
    onEndChange(daysAgo(0));
    setShowPicker(null);
  }

  function handleDateChange(_event: any, selectedDate?: Date) {
    if (Platform.OS === "android") {
      setShowPicker(null);
    }

    if (!selectedDate) return;

    const formatted = formatDate(selectedDate);

    if (showPicker === "start") {
      if (formatted <= endDate) {
        onStartChange(formatted);
      } else {
        onStartChange(formatted);
        onEndChange(formatted);
      }
    } else if (showPicker === "end") {
      const todayStr = formatDate(today);
      if (formatted >= startDate && formatted <= todayStr) {
        onEndChange(formatted);
      }
    }

    if (Platform.OS === "android") {
      setShowPicker(null);
    }
  }

  const activePreset = PRESETS.find(
    (p) => startDate === daysAgo(p.days) && endDate === daysAgo(0)
  );

  return (
    <View>
      {/* Preset buttons */}
      <View className="flex-row gap-2 mb-4">
        {PRESETS.map((preset) => {
          const isActive = activePreset?.days === preset.days;
          return (
            <TouchableOpacity
              key={preset.days}
              onPress={() => handlePreset(preset.days)}
              activeOpacity={0.7}
              className={`flex-1 py-2.5 rounded-button items-center border ${
                isActive
                  ? "bg-accent border-accent"
                  : "bg-surface-card border-border"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  isActive ? "text-text-inverse" : "text-text-muted"
                }`}
              >
                {preset.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Date buttons */}
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Text className="text-text text-sm font-semibold mb-2">
            Data Início
          </Text>
          <TouchableOpacity
            onPress={() => setShowPicker("start")}
            activeOpacity={0.7}
            className="bg-surface-card border border-border rounded-card px-4 py-3"
          >
            <Text className="text-text text-sm">
              {toDisplayDateSlash(startDate)}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1">
          <Text className="text-text text-sm font-semibold mb-2">
            Data Fim
          </Text>
          <TouchableOpacity
            onPress={() => setShowPicker("end")}
            activeOpacity={0.7}
            className="bg-surface-card border border-border rounded-card px-4 py-3"
          >
            <Text className="text-text text-sm">
              {toDisplayDateSlash(endDate)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Native DateTimePicker */}
      {showPicker && (
        <View className="mt-3">
          <DateTimePicker
            value={parseDate(showPicker === "start" ? startDate : endDate)}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={today}
            minimumDate={showPicker === "end" ? parseDate(startDate) : undefined}
            onChange={handleDateChange}
          />
          {Platform.OS === "ios" && (
            <TouchableOpacity
              onPress={() => setShowPicker(null)}
              activeOpacity={0.7}
              className="bg-accent rounded-button py-2.5 items-center mt-2"
            >
              <Text className="text-text-inverse text-sm font-semibold">OK</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
