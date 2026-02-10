import React from "react";
import { View, Text } from "react-native";

interface SectionHeaderProps {
  title: string;
  icon?: string;
}

export function SectionHeader({ title, icon }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center gap-2 mb-3 mt-2">
      {icon && <Text className="text-lg">{icon}</Text>}
      <Text className="text-indigo-100 text-lg font-bold">{title}</Text>
    </View>
  );
}
