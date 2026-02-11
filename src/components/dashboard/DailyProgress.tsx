import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { FORM_CARD_TITLES } from "../../config/constants";
import type { FormType } from "../../types/entry";

const FORM_TYPES: FormType[] = ["morning", "noon", "evening"];

const FORM_CONFIG: Record<FormType, { icon: string; iconColor: string; iconBg: string }> = {
  morning: { icon: "moon-outline", iconColor: "#652D07", iconBg: "bg-pastel-brown" },
  noon: { icon: "sunny-outline", iconColor: "#FF7617", iconBg: "bg-pastel-orange" },
  evening: { icon: "partly-sunny-outline", iconColor: "#D46010", iconBg: "bg-pastel-amber" },
};

interface DailyProgressProps {
  status: { morning: boolean; noon: boolean; evening: boolean };
  onFormPress: (type: FormType) => void;
}

export function DailyProgress({ status, onFormPress }: DailyProgressProps) {
  return (
    <View className="flex-row gap-3">
      {FORM_TYPES.map((type) => {
        const completed = status[type];
        const config = FORM_CONFIG[type];

        return (
          <TouchableOpacity
            key={type}
            onPress={() => onFormPress(type)}
            activeOpacity={0.7}
            className={`flex-1 rounded-card p-4 items-center border ${
              completed
                ? "bg-success-light border-success"
                : "bg-surface-card border-border"
            }`}
            style={{
              shadowColor: "#6B5E57",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View className={`w-10 h-10 rounded-xl items-center justify-center mb-2 ${config.iconBg}`}>
              <Ionicons name={config.icon as any} size={20} color={config.iconColor} />
            </View>

            <Text
              className="text-text text-caption font-semibold text-center mb-2"
              numberOfLines={2}
            >
              {FORM_CARD_TITLES[type]}
            </Text>

            <View
              className={`px-3 py-1 rounded-full ${
                completed ? "bg-success" : "bg-surface-input"
              }`}
            >
              <Text
                className={`text-caption font-bold ${
                  completed ? "text-text-inverse" : "text-text-muted"
                }`}
              >
                {completed ? "Feito" : "Pendente"}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
