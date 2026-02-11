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

  const isValid = value ? /^\d{2}:\d{2}$/.test(value) : false;

  return (
    <View className="mb-4">
      <Text className="text-base-100 text-base font-semibold mb-2">
        {label}
      </Text>
      <TextInput
        value={value ?? ""}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#64748b"
        keyboardType="numeric"
        maxLength={5}
        className={`bg-base-800 border rounded-xl px-4 py-3 text-base-100 text-base ${
          isValid ? "border-emerald-600" : "border-base-700"
        }`}
      />
    </View>
  );
}
