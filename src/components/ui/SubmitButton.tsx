import React from "react";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";

interface SubmitButtonProps {
  onPress: () => void;
  loading?: boolean;
  label?: string;
}

export function SubmitButton({
  onPress,
  loading = false,
  label = "Enviar",
}: SubmitButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled: loading }}
      className={`w-full py-5 rounded-full items-center justify-center mt-2 mb-8 ${
        loading ? "bg-accent opacity-70" : "bg-accent"
      }`}
      style={{
        shadowColor: "#FF7617",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" size="small" />
      ) : (
        <Text className="text-text-inverse text-lg font-bold">{label}</Text>
      )}
    </TouchableOpacity>
  );
}
