import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export function NumberInput({
  value,
  onChange,
  label,
  min = 0,
  max = 99,
  step = 1,
  unit,
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
    <View className="mb-5">
      <Text className="text-text text-body font-bold mb-3">
        {label}
      </Text>
      <View className="flex-row items-center gap-3">
        <TouchableOpacity
          onPress={handleDecrement}
          disabled={isAtMin}
          activeOpacity={0.7}
          accessibilityRole="adjustable"
          className={`w-12 h-12 rounded-full border items-center justify-center ${
            isAtMin
              ? "bg-surface-input border-border opacity-40"
              : "bg-surface-card border-border"
          }`}
          style={!isAtMin ? {
            shadowColor: "#6B5E57",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 4,
            elevation: 1,
          } : undefined}
        >
          <Text
            className={`text-xl font-bold ${
              isAtMin ? "text-text-muted" : "text-accent"
            }`}
          >
            -
          </Text>
        </TouchableOpacity>
        <View className="min-w-[48px] items-center">
          <Text className="text-text text-2xl font-bold">
            {value}{unit ? unit : ""}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleIncrement}
          disabled={isAtMax}
          activeOpacity={0.7}
          accessibilityRole="adjustable"
          className={`w-12 h-12 rounded-full border items-center justify-center ${
            isAtMax
              ? "bg-surface-input border-border opacity-40"
              : "bg-surface-card border-border"
          }`}
          style={!isAtMax ? {
            shadowColor: "#6B5E57",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 4,
            elevation: 1,
          } : undefined}
        >
          <Text
            className={`text-xl font-bold ${
              isAtMax ? "text-text-muted" : "text-accent"
            }`}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
