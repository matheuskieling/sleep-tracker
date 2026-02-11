import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import type { Report } from "../../types/entry";
import { toDisplayDate } from "../../utils/date";

interface ReportCardProps {
  report: Report;
  onDelete: (id: string) => void;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/[-*]\s+/g, "")
    .replace(/\n+/g, " ")
    .trim();
}

export function ReportCard({ report, onDelete }: ReportCardProps) {
  const router = useRouter();
  const preview = stripMarkdown(report.content).slice(0, 120);

  const createdDate = report.createdAt?.toDate
    ? report.createdAt.toDate().toLocaleDateString("pt-BR")
    : "";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/report/${report.id}` as any)}
      className="bg-base-800 rounded-2xl p-4 mb-3"
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-base-100 text-sm font-semibold">
          {toDisplayDate(report.startDate)} → {toDisplayDate(report.endDate)}
        </Text>
        <TouchableOpacity
          onPress={() => onDelete(report.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text className="text-red-400 text-xs">Excluir</Text>
        </TouchableOpacity>
      </View>

      {createdDate ? (
        <Text className="text-base-500 text-xs mb-2">
          Criado em {createdDate}
        </Text>
      ) : null}

      <Text className="text-base-400 text-xs" numberOfLines={2}>
        {preview}...
      </Text>
    </TouchableOpacity>
  );
}
