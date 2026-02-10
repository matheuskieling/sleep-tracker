import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({
  value,
  onChange,
  label,
  min = 0,
  max = 99,
  step = 1,
}: NumberInputProps) {
  const handleDecrement = () => {
    const next = value - step;
    if (next >= min) {
      onChange(next);
    }
  };

  const handleIncrement = () => {
    const next = value + step;
    if (next <= max) {
      onChange(next);
    }
  };

  const isAtMin = value <= min;
  const isAtMax = value >= max;

  return (
    <View className="mb-4">
      <Text className="text-indigo-100 text-base font-semibold mb-2">
        {label}
      </Text>
      <View className="flex-row items-center gap-3">
        <TouchableOpacity
          onPress={handleDecrement}
          disabled={isAtMin}
          activeOpacity={0.7}
          className={`w-12 h-12 rounded-xl border items-center justify-center ${
            isAtMin
              ? "bg-primary-950 border-primary-800 opacity-40"
              : "bg-primary-900 border-primary-800"
          }`}
        >
          <Text
            className={`text-xl font-bold ${
              isAtMin ? "text-indigo-300" : "text-indigo-100"
            }`}
          >
            -
          </Text>
        </TouchableOpacity>
        <View className="min-w-[48px] items-center">
          <Text className="text-indigo-100 text-2xl font-bold">{value}</Text>
        </View>
        <TouchableOpacity
          onPress={handleIncrement}
          disabled={isAtMax}
          activeOpacity={0.7}
          className={`w-12 h-12 rounded-xl border items-center justify-center ${
            isAtMax
              ? "bg-primary-950 border-primary-800 opacity-40"
              : "bg-primary-900 border-primary-800"
          }`}
        >
          <Text
            className={`text-xl font-bold ${
              isAtMax ? "text-indigo-300" : "text-indigo-100"
            }`}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
