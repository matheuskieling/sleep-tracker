import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface ToggleButtonProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

export function ToggleButton({ value, onChange, label }: ToggleButtonProps) {
  return (
    <View className="mb-5">
      <Text className="text-text text-body font-bold mb-3">
        {label}
      </Text>
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => onChange(true)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityState={{ selected: value }}
          className={`flex-1 py-3 rounded-full border items-center ${
            value
              ? "bg-accent border-accent"
              : "bg-surface-card border-border"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              value ? "text-text-inverse" : "text-text-muted"
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
          className={`flex-1 py-3 rounded-full border items-center ${
            !value
              ? "bg-surface-input border-border"
              : "bg-surface-card border-border"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              !value ? "text-text-secondary" : "text-text-muted"
            }`}
          >
            Nao
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
