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
    <View className="mb-5">
      <Text className="text-text text-body font-bold mb-3">
        {label}
      </Text>
      <TextInput
        value={value ?? ""}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A09389"
        keyboardType="numeric"
        maxLength={5}
        className="bg-surface-card border border-border rounded-full px-5 py-3.5 text-text text-body"
      />
    </View>
  );
}
