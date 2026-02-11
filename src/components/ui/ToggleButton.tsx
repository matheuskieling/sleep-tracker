import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface ToggleButtonProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

export function ToggleButton({ value, onChange, label }: ToggleButtonProps) {
  return (
    <View className="mb-4">
      <Text className="text-base-100 text-base font-semibold mb-2">
        {label}
      </Text>
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => onChange(true)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityState={{ selected: value }}
          className={`flex-1 py-3 rounded-xl border items-center ${
            value
              ? "bg-emerald-600 border-emerald-500"
              : "bg-base-800 border-base-700"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              value ? "text-white" : "text-base-400"
            }`}
          >
            Sim
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onChange(false)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityState={{ selected: !value }}
          className={`flex-1 py-3 rounded-xl border items-center ${
            !value
              ? "bg-red-500/20 border-red-500"
              : "bg-base-800 border-base-700"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              !value ? "text-red-400" : "text-base-400"
            }`}
          >
            Nao
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
