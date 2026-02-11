import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useAuth } from "../../src/hooks/useAuth";
import { useReports } from "../../src/hooks/useReport";
import { DateRangePicker } from "../../src/components/report/DateRangePicker";
import { ReportView } from "../../src/components/report/ReportView";
import { ReportCard } from "../../src/components/report/ReportCard";
import { generateReport, buildReportPrompt } from "../../src/services/ai";
import * as Clipboard from "expo-clipboard";
import { getEntriesInRange, saveReport, deleteReport } from "../../src/services/firestore";
import { daysAgo } from "../../src/utils/date";

export default function ReportScreen() {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState(daysAgo(7));
  const [endDate, setEndDate] = useState(daysAgo(0));
  const [report, setReport] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copyingPrompt, setCopyingPrompt] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);

  const { reports, loading: reportsLoading, refresh: refreshReports } = useReports();

  async function handleGenerate() {
    if (!user) return;

    setGenerating(true);
    setReport("");

    try {
      const entries = await getEntriesInRange(user.uid, startDate, endDate);

      if (entries.length === 0) {
        Alert.alert("Sem dados", "Nenhum registro encontrado no periodo selecionado.");
        return;
      }

      const result = await generateReport(entries);
      setReport(result);

      await saveReport(user.uid, startDate, endDate, result);
      refreshReports();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      console.error("Erro ao gerar relatorio:", err);
      Alert.alert("Erro", message);
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopyPrompt() {
    if (!user) return;

    setCopyingPrompt(true);

    try {
      const entries = await getEntriesInRange(user.uid, startDate, endDate);

      if (entries.length === 0) {
        Alert.alert("Sem dados", "Nenhum registro encontrado no periodo selecionado.");
        return;
      }

      const prompt = buildReportPrompt(entries);
      await Clipboard.setStringAsync(prompt);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      Alert.alert("Erro", message);
    } finally {
      setCopyingPrompt(false);
    }
  }

  async function handleDelete(reportId: string) {
    if (!user) return;
    Alert.alert("Excluir relatorio", "Tem certeza?", [
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
    <ScrollView className="flex-1 bg-base-900" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="p-5">
        <Text className="text-base-300 text-sm mb-4">
          Selecione um periodo para gerar uma analise com IA dos seus dados de sono e habitos.
        </Text>

        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
        />

        <TouchableOpacity
          onPress={handleGenerate}
          disabled={generating || copyingPrompt}
          activeOpacity={0.8}
          className={`rounded-xl p-4 items-center mt-4 ${
            generating ? "bg-accent-dark opacity-70" : "bg-accent-dark"
          }`}
        >
          {generating ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="#f1f5f9" />
              <Text className="text-white font-semibold text-base ml-2">
                Analisando...
              </Text>
            </View>
          ) : (
            <Text className="text-white font-semibold text-base">
              Gerar Relatorio IA
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCopyPrompt}
          disabled={generating || copyingPrompt}
          activeOpacity={0.8}
          className={`rounded-xl p-4 items-center mt-3 border ${
            promptCopied ? "border-green-500 bg-green-600/20" : "border-base-700 bg-accent-subtle"
          }`}
        >
          {copyingPrompt ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="#94a3b8" />
              <Text className="text-base-400 font-semibold text-base ml-2">
                Copiando...
              </Text>
            </View>
          ) : (
            <Text className={`font-semibold text-base ${
              promptCopied ? "text-green-400" : "text-base-400"
            }`}>
              {promptCopied ? "Prompt copiado!" : "Copiar Prompt"}
            </Text>
          )}
        </TouchableOpacity>

        {report && (
          <>
            <ReportView report={report} />
            <TouchableOpacity
              onPress={() => setReport("")}
              activeOpacity={0.8}
              className="rounded-xl p-3 items-center mt-3 border border-base-700"
            >
              <Text className="text-base-400 font-semibold text-sm">
                Ocultar relatorio
              </Text>
            </TouchableOpacity>
          </>
        )}

        <Text className="text-base-300 font-semibold text-base mt-8 mb-4">
          Relatorios salvos
        </Text>

        {reportsLoading ? (
          <ActivityIndicator color="#6366f1" className="my-4" />
        ) : reports.length === 0 ? (
          <Text className="text-base-500 text-sm text-center py-8">
            Nenhum relatorio salvo ainda.
          </Text>
        ) : (
          reports.map((r) => (
            <ReportCard key={r.id} report={r} onDelete={handleDelete} />
          ))
        )}
      </View>
    </ScrollView>
  );
}
