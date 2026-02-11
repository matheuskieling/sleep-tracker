import React from "react";
import { View, Text } from "react-native";

interface SectionHeaderProps {
  title: string;
  icon?: string;
}

export function SectionHeader({ title, icon }: SectionHeaderProps) {
  return (
    <View className="mb-4 mt-1">
      <View className="flex-row items-center gap-2">
        {icon && <Text className="text-lg">{icon}</Text>}
        <Text className="text-secondary text-lg font-bold">{title}</Text>
      </View>
    </View>
  );
}
