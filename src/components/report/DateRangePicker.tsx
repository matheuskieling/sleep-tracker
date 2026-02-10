import React from "react";
import { View, Text, TextInput } from "react-native";
import { toDisplayDate, fromDisplayDate } from "../../utils/date";

interface DateRangePickerProps {
  startDate: string; // internal YYYY-MM-DD
  endDate: string; // internal YYYY-MM-DD
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: DateRangePickerProps) {
  function handleStartChange(text: string) {
    // User types DD-MM-YYYY, convert to internal YYYY-MM-DD
    if (text.match(/^\d{2}-\d{2}-\d{4}$/)) {
      onStartChange(fromDisplayDate(text));
    } else {
      // Allow partial typing by storing raw - will convert when complete
      onStartChange(text);
    }
  }

  function handleEndChange(text: string) {
    if (text.match(/^\d{2}-\d{2}-\d{4}$/)) {
      onEndChange(fromDisplayDate(text));
    } else {
      onEndChange(text);
    }
  }

  // Display as DD-MM-YYYY if the value is valid internal format
  const displayStart = startDate.match(/^\d{4}-\d{2}-\d{2}$/)
    ? toDisplayDate(startDate)
    : startDate;
  const displayEnd = endDate.match(/^\d{4}-\d{2}-\d{2}$/)
    ? toDisplayDate(endDate)
    : endDate;

  return (
    <View className="flex-row gap-3">
      <View className="flex-1">
        <Text className="text-indigo-100 text-sm font-semibold mb-2">
          Data Início
        </Text>
        <TextInput
          value={displayStart}
          onChangeText={handleStartChange}
          placeholder="DD-MM-YYYY"
          placeholderTextColor="#6366f1"
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          className="bg-primary-900 border border-indigo-700 text-white rounded-xl px-4 py-3 text-sm"
        />
      </View>

      <View className="flex-1">
        <Text className="text-indigo-100 text-sm font-semibold mb-2">
          Data Fim
        </Text>
        <TextInput
          value={displayEnd}
          onChangeText={handleEndChange}
          placeholder="DD-MM-YYYY"
          placeholderTextColor="#6366f1"
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          className="bg-primary-900 border border-indigo-700 text-white rounded-xl px-4 py-3 text-sm"
        />
      </View>
    </View>
  );
}
