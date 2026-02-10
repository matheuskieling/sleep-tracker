import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useEntryRange } from "../../src/hooks/useEntry";
import { DateRangePicker } from "../../src/components/report/DateRangePicker";
import { ReportView } from "../../src/components/report/ReportView";
import { generateReport } from "../../src/services/ai";
import { daysAgo } from "../../src/utils/date";

export default function ReportScreen() {
  const [startDate, setStartDate] = useState(daysAgo(7));
  const [endDate, setEndDate] = useState(daysAgo(0));
  const [report, setReport] = useState("");
  const [generating, setGenerating] = useState(false);

  const { entries, loading: entriesLoading } = useEntryRange(startDate, endDate);

  async function handleGenerate() {
    if (entries.length === 0) {
      Alert.alert("Sem dados", "Nenhum registro encontrado no período selecionado.");
      return;
    }

    setGenerating(true);
    setReport("");

    try {
      const result = await generateReport(entries);
      setReport(result);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível gerar o relatório. Tente novamente.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-primary-950">
      <View className="p-5">
        <Text className="text-indigo-200 text-sm mb-4">
          Selecione um período para gerar uma análise com IA dos seus dados de sono e hábitos.
        </Text>

        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
        />

        <TouchableOpacity
          onPress={handleGenerate}
          disabled={generating || entriesLoading}
          activeOpacity={0.8}
          className={`rounded-xl p-4 items-center mt-4 mb-6 ${
            generating ? "bg-indigo-800" : "bg-indigo-600"
          }`}
        >
          {generating ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="#e0e7ff" />
              <Text className="text-indigo-100 font-semibold text-base ml-2">
                Analisando...
              </Text>
            </View>
          ) : (
            <Text className="text-indigo-100 font-semibold text-base">
              Gerar Relatório IA
            </Text>
          )}
        </TouchableOpacity>

        <ReportView report={report} loading={generating} />
      </View>
    </ScrollView>
  );
}
