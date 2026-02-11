import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { FormType } from "../../types/entry";

interface ChecklistCardProps {
  type: FormType;
  title: string;
  completed: boolean;
  streak: number;
  isLast?: boolean;
  onPress: () => void;
}

const CARD_CONFIG: Record<FormType, { icon: string; iconBg: string; iconColor: string }> = {
  morning: { icon: "moon-outline", iconBg: "bg-pastel-brown", iconColor: "#652D07" },
  noon: { icon: "sunny-outline", iconBg: "bg-pastel-orange", iconColor: "#FF7617" },
  evening: { icon: "partly-sunny-outline", iconBg: "bg-pastel-amber", iconColor: "#D46010" },
};

export function ChecklistCard({ type, title, completed, streak, isLast = false, onPress }: ChecklistCardProps) {
  const config = CARD_CONFIG[type];

  return (
    <View className="flex-row">
      {/* Timeline column */}
      <View className="items-center mr-3 pt-1" style={{ width: 28 }}>
        {/* Status circle */}
        <View
          className={`w-7 h-7 rounded-full items-center justify-center ${
            completed ? "bg-accent" : "border-2 border-border"
          }`}
        >
          {completed && (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          )}
        </View>
        {/* Dotted line */}
        {!isLast && (
          <View className="flex-1 items-center mt-1" style={{ width: 2 }}>
            <View
              className="flex-1"
              style={{
                width: 2,
                borderLeftWidth: 2,
                borderLeftColor: "#E8DDD6",
                borderStyle: "dashed",
              }}
            />
          </View>
        )}
      </View>

      {/* Card */}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="flex-1 bg-surface-card rounded-card p-4 mb-3 flex-row items-center"
        style={{
          shadowColor: "#6B5E57",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        {/* Icon container */}
        <View
          className={`w-11 h-11 rounded-xl items-center justify-center mr-3 ${config.iconBg}`}
        >
          <Ionicons name={config.icon as any} size={22} color={config.iconColor} />
        </View>

        {/* Text content */}
        <View className="flex-1">
          <Text className="text-text text-body font-semibold" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-text-muted text-caption mt-0.5">
            {completed
              ? streak > 0
                ? `Sequencia ${streak} dia${streak !== 1 ? "s" : ""}`
                : "Concluido"
              : "Pendente"}
          </Text>
        </View>

        {/* Status badge */}
        <View
          className={`px-3 py-1.5 rounded-full ${
            completed ? "bg-success-light" : "bg-surface-input"
          }`}
        >
          <Text
            className={`text-caption font-semibold ${
              completed ? "text-success-dark" : "text-text-muted"
            }`}
          >
            {completed ? "Feito" : "Aberto"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
