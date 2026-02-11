import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { FORM_TITLES, FORM_ICONS } from "../../config/constants";
import type { FormType } from "../../types/entry";

const FORM_TYPES: FormType[] = ["morning", "noon", "evening"];

const FORM_COLORS: Record<FormType, { border: string; bg: string }> = {
  morning: { border: "border-amber-500", bg: "bg-amber-500/10" },
  noon: { border: "border-sky-500", bg: "bg-sky-500/10" },
  evening: { border: "border-violet-500", bg: "bg-violet-500/10" },
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
        const colors = FORM_COLORS[type];

        return (
          <TouchableOpacity
            key={type}
            onPress={() => onFormPress(type)}
            activeOpacity={0.7}
            className={`flex-1 rounded-2xl p-4 items-center border ${
              completed
                ? `${colors.bg} ${colors.border}`
                : "bg-base-800 border-base-700"
            }`}
          >
            <Text className="text-2xl mb-2">{FORM_ICONS[type]}</Text>

            <Text
              className="text-base-100 text-xs font-semibold text-center mb-2"
              numberOfLines={2}
            >
              {FORM_TITLES[type]}
            </Text>

            <View
              className={`px-3 py-1 rounded-full ${
                completed ? "bg-green-600" : "bg-base-700"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  completed ? "text-green-100" : "text-base-400"
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
