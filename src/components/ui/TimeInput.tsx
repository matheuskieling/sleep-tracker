import React from "react";
import { View, Text, TextInput } from "react-native";

interface TimeInputProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label: string;
  placeholder?: string;
}

export function TimeInput({
  value,
  onChange,
  label,
  placeholder = "HH:MM",
}: TimeInputProps) {
  const handleChangeText = (text: string) => {
    // Allow only digits and colon
    const cleaned = text.replace(/[^0-9:]/g, "");

    // Auto-insert colon after 2 digits if user hasn't typed one
    let formatted = cleaned;
    if (formatted.length === 2 && !formatted.includes(":") && (value?.length ?? 0) < 2) {
      formatted = formatted + ":";
    }

    // Limit to 5 characters (HH:MM)
    formatted = formatted.slice(0, 5);

    onChange(formatted.length > 0 ? formatted : null);
  };

  return (
    <View className="mb-4">
      <Text className="text-indigo-100 text-base font-semibold mb-2">
        {label}
      </Text>
      <TextInput
        value={value ?? ""}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6366f1"
        keyboardType="numeric"
        maxLength={5}
        className="bg-primary-900 border border-primary-800 rounded-xl px-4 py-3 text-indigo-100 text-base"
      />
    </View>
  );
}
