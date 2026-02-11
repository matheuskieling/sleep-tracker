import React from "react";
import { View } from "react-native";

interface FormCardProps {
  children: React.ReactNode;
}

export function FormCard({ children }: FormCardProps) {
  return (
    <View className="bg-base-800 border border-base-700 rounded-2xl p-4 mb-4">{children}</View>
  );
}
