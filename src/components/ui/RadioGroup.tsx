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
      <Text className="text-indigo-100 text-base font-semibold mb-2">
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
              className={`px-4 py-2 rounded-xl border ${
                isSelected
                  ? "bg-indigo-500 border-indigo-400"
                  : "bg-primary-900 border-primary-800"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  isSelected ? "text-white" : "text-indigo-300"
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
