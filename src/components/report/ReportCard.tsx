import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import type { Report } from "../../types/entry";
import { toDisplayDateSlash } from "../../utils/date";

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
      className="bg-surface-card rounded-card p-4 mb-3"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-text text-sm font-semibold">
          {toDisplayDateSlash(report.startDate)} → {toDisplayDateSlash(report.endDate)}
        </Text>
        <TouchableOpacity
          onPress={() => onDelete(report.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text className="text-danger text-caption">Excluir</Text>
        </TouchableOpacity>
      </View>

      {createdDate ? (
        <Text className="text-text-muted text-caption mb-2">
          Criado em {createdDate}
        </Text>
      ) : null}

      <Text className="text-text-secondary text-caption" numberOfLines={2}>
        {preview}...
      </Text>
    </TouchableOpacity>
  );
}
