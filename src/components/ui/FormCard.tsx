import React from "react";
import { View } from "react-native";

interface FormCardProps {
  children: React.ReactNode;
}

export function FormCard({ children }: FormCardProps) {
  return (
    <View
      className="bg-surface-card rounded-card p-5 mb-5"
      style={{
        shadowColor: "#6B5E57",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      {children}
    </View>
  );
}
