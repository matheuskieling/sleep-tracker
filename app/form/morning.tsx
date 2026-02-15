import { Alert, View, ActivityIndicator } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";

import { MorningForm } from "../../src/components/forms/MorningForm";
import { submitMorningEntry } from "../../src/services/firestore";
import { useAuth } from "../../src/hooks/useAuth";
import { useEntry } from "../../src/hooks/useEntry";
import { toDisplayDateSlash } from "../../src/utils/date";

export default function MorningFormScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { date: dateParam } = useLocalSearchParams<{ date: string }>();

  if (typeof dateParam !== "string") {
    Alert.alert("Erro", "Data não encontrada.", [
      { text: "OK", onPress: () => router.back() },
    ]);
    return null;
  }

  const date = dateParam;
  const { entry, loading } = useEntry(date);

  const handleSubmit = async (
    data: Parameters<typeof submitMorningEntry>[1]
  ) => {
    try {
      await submitMorningEntry(user!.uid, data, date);
      Alert.alert("Sucesso", `Formulário do dia ${toDisplayDateSlash(date)} salvo!`);
      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar. Tente novamente.");
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen
        options={{
          title: "Como foi sua noite?",
          headerStyle: { backgroundColor: "#F8F2EF" },
          headerTintColor: "#292D32",
          headerShadowVisible: false,
        }}
      />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF7617" />
        </View>
      ) : (
        <MorningForm onSubmit={handleSubmit} initialData={entry?.morning} />
      )}
    </View>
  );
}
