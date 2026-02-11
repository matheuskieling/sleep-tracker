import React from "react";
import { View, Text } from "react-native";

interface SectionHeaderProps {
  title: string;
  icon?: string;
}

export function SectionHeader({ title, icon }: SectionHeaderProps) {
  return (
    <View className="mb-3 mt-2">
      <View className="flex-row items-center gap-2 mb-3">
        {icon && <Text className="text-lg">{icon}</Text>}
        <Text className="text-base-100 text-lg font-bold">{title}</Text>
      </View>
      <View className="h-px bg-accent/30 mb-3" />
    </View>
  );
}
