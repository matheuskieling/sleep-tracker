import { Alert, View, ActivityIndicator } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";

import { NoonForm } from "../../src/components/forms/NoonForm";
import { submitNoonEntry, clearFormSection } from "../../src/services/firestore";
import { useAuth } from "../../src/hooks/useAuth";
import { useEntry } from "../../src/hooks/useEntry";
import { toDisplayDateSlash } from "../../src/utils/date";

export default function NoonFormScreen() {
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
    data: Parameters<typeof submitNoonEntry>[1]
  ) => {
    try {
      await submitNoonEntry(user!.uid, data, date);
      Alert.alert("Sucesso", `Formulário do dia ${toDisplayDateSlash(date)} salvo!`);
      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar. Tente novamente.");
    }
  };

  const handleClear = async () => {
    try {
      await clearFormSection(user!.uid, date, "noon");
      Alert.alert("Sucesso", "Registro limpo com sucesso.");
      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível limpar. Tente novamente.");
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen
        options={{
          title: "Como foi sua manhã?",
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
        <NoonForm
          onSubmit={handleSubmit}
          initialData={entry?.noon}
          onClear={entry?.noon ? handleClear : undefined}
        />
      )}
    </View>
  );
}
