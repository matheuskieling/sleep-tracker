import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export function RadioGroup({ options, value, onChange, label }: RadioGroupProps) {
  return (
    <View className="mb-5">
      <Text className="text-text text-body font-bold mb-3">
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-2.5">
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onChange(option.value)}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              className={`px-5 py-3.5 rounded-full ${
                isSelected
                  ? "bg-accent"
                  : "bg-surface-card border border-border"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  isSelected ? "text-text-inverse" : "text-text-secondary"
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
