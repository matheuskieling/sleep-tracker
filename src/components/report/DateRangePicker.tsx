import React from "react";
import { View, Text, TextInput } from "react-native";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: DateRangePickerProps) {
  return (
    <View className="flex-row gap-3">
      <View className="flex-1">
        <Text className="text-indigo-100 text-sm font-semibold mb-2">
          Data Início
        </Text>
        <TextInput
          value={startDate}
          onChangeText={onStartChange}
          placeholder="YYYY-MM-DD"
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
          value={endDate}
          onChangeText={onEndChange}
          placeholder="YYYY-MM-DD"
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
