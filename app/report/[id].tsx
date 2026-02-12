import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../src/hooks/useAuth";
import { useReport } from "../../src/hooks/useReport";
import { ReportView } from "../../src/components/report/ReportView";
import { deleteReport } from "../../src/services/firestore";
import { toDisplayDateSlash } from "../../src/utils/date";

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { report, loading } = useReport(id);

  async function handleDelete() {
    if (!user || !id) return;
    Alert.alert("Excluir relatório", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await deleteReport(user.uid, id);
          router.back();
        },
      },
    ]);
  }

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: "Relatório" }} />
        <View className="flex-1 bg-surface items-center justify-center">
          <ActivityIndicator size="large" color="#FF7617" />
        </View>
      </>
    );
  }

  if (!report) {
    return (
      <>
        <Stack.Screen options={{ title: "Relatório" }} />
        <View className="flex-1 bg-surface items-center justify-center">
          <Text className="text-text-muted text-sm">Relatório não encontrado.</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Relatório" }} />
      <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        <View className="p-5">
          <Text className="text-text text-body font-semibold mb-1">
            {toDisplayDateSlash(report.startDate)} → {toDisplayDateSlash(report.endDate)}
          </Text>

          {report.createdAt?.toDate && (
            <Text className="text-text-muted text-caption mb-2">
              Criado em {report.createdAt.toDate().toLocaleDateString("pt-BR")}
            </Text>
          )}

          <ReportView report={report.content} />

          <TouchableOpacity
            onPress={handleDelete}
            activeOpacity={0.8}
            className="rounded-button p-4 items-center mt-6 bg-danger-light border border-danger"
          >
            <Text className="text-danger-dark font-semibold text-sm">
              Excluir relatório
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}
