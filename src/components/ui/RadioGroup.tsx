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
    <View className="mb-4">
      <Text className="text-base-100 text-base font-semibold mb-2">
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onChange(option.value)}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              className={`px-4 py-3 rounded-xl border ${
                isSelected
                  ? "bg-accent border-accent-light"
                  : "bg-base-800 border-base-700"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  isSelected ? "text-white" : "text-base-400"
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
