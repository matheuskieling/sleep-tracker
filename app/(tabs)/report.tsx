import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useAuth } from "../../src/hooks/useAuth";
import { useEntryRange } from "../../src/hooks/useEntry";
import { useReports } from "../../src/hooks/useReport";
import { DateRangePicker } from "../../src/components/report/DateRangePicker";
import { ReportView } from "../../src/components/report/ReportView";
import { ReportCard } from "../../src/components/report/ReportCard";
import { generateReport } from "../../src/services/ai";
import { saveReport, deleteReport } from "../../src/services/firestore";
import { daysAgo } from "../../src/utils/date";

export default function ReportScreen() {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState(daysAgo(7));
  const [endDate, setEndDate] = useState(daysAgo(0));
  const [report, setReport] = useState("");
  const [generating, setGenerating] = useState(false);

  const { entries, loading: entriesLoading } = useEntryRange(startDate, endDate);
  const { reports, loading: reportsLoading, refresh: refreshReports } = useReports();

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

      if (user) {
        await saveReport(user.uid, startDate, endDate, result);
        refreshReports();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      console.error("Erro ao gerar relatório:", err);
      Alert.alert("Erro", message);
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete(reportId: string) {
    if (!user) return;
    Alert.alert("Excluir relatório", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await deleteReport(user.uid, reportId);
          refreshReports();
        },
      },
    ]);
  }

  return (
    <KeyboardAwareScrollView className="flex-1 bg-primary-950" contentContainerStyle={{ paddingBottom: 100 }}>
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
          className={`rounded-xl p-4 items-center mt-4 ${
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

        {report && (
          <>
            <ReportView report={report} />
            <TouchableOpacity
              onPress={() => setReport("")}
              activeOpacity={0.8}
              className="rounded-xl p-3 items-center mt-3 border border-indigo-700"
            >
              <Text className="text-indigo-300 font-semibold text-sm">
                Ocultar relatório
              </Text>
            </TouchableOpacity>
          </>
        )}

        <Text className="text-indigo-200 font-semibold text-base mt-8 mb-4">
          Relatórios salvos
        </Text>

        {reportsLoading ? (
          <ActivityIndicator color="#818cf8" className="my-4" />
        ) : reports.length === 0 ? (
          <Text className="text-indigo-400 text-sm text-center py-8">
            Nenhum relatório salvo ainda.
          </Text>
        ) : (
          reports.map((r) => (
            <ReportCard key={r.id} report={r} onDelete={handleDelete} />
          ))
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}
