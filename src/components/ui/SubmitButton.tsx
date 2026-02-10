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
      className={`w-full py-4 rounded-2xl items-center justify-center mt-2 mb-6 ${
        loading ? "bg-indigo-500/70" : "bg-indigo-500"
      }`}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" size="small" />
      ) : (
        <Text className="text-white text-base font-bold">{label}</Text>
      )}
    </TouchableOpacity>
  );
}
