import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
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
        Alert.alert("Sem dados", "Nenhum registro encontrado no período selecionado.");
        return;
      }

      const result = await generateReport(entries);
      setReport(result);

      await saveReport(user.uid, startDate, endDate, result);
      refreshReports();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      console.error("Erro ao gerar relatório:", err);
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
        Alert.alert("Sem dados", "Nenhum registro encontrado no período selecionado.");
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
          disabled={generating || copyingPrompt}
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

        <TouchableOpacity
          onPress={handleCopyPrompt}
          disabled={generating || copyingPrompt}
          activeOpacity={0.8}
          className={`rounded-xl p-4 items-center mt-3 border ${
            promptCopied ? "border-green-500 bg-green-600/20" : "border-indigo-700 bg-indigo-500/10"
          }`}
        >
          {copyingPrompt ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="#a5b4fc" />
              <Text className="text-indigo-300 font-semibold text-base ml-2">
                Copiando...
              </Text>
            </View>
          ) : (
            <Text className={`font-semibold text-base ${
              promptCopied ? "text-green-400" : "text-indigo-300"
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
