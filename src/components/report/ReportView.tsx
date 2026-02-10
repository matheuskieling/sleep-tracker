import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";

interface ReportViewProps {
  report: string | null;
  loading: boolean;
}

export function ReportView({ report, loading }: ReportViewProps) {
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="text-indigo-300 text-sm mt-4">
          Gerando relatório...
        </Text>
      </View>
    );
  }

  if (report) {
    return (
      <ScrollView
        className="flex-1 bg-primary-900 rounded-2xl p-4 mt-4"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-indigo-100 text-sm leading-6">{report}</Text>
      </ScrollView>
    );
  }

  return (
    <View className="flex-1 items-center justify-center py-16">
      <Text className="text-indigo-400 text-sm text-center">
        Selecione um período e gere o relatório
      </Text>
    </View>
  );
}
