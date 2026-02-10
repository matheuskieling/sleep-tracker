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
      <Text className="text-indigo-100 text-base font-semibold mb-2">
        {label}
      </Text>
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => onChange(true)}
          activeOpacity={0.7}
          className={`flex-1 py-3 rounded-xl border items-center ${
            value
              ? "bg-indigo-500 border-indigo-400"
              : "bg-primary-900 border-primary-800"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              value ? "text-white" : "text-indigo-300"
            }`}
          >
            Sim
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onChange(false)}
          activeOpacity={0.7}
          className={`flex-1 py-3 rounded-xl border items-center ${
            !value
              ? "bg-indigo-500 border-indigo-400"
              : "bg-primary-900 border-primary-800"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              !value ? "text-white" : "text-indigo-300"
            }`}
          >
            Não
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
