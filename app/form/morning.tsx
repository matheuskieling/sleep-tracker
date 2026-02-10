import { Alert, View, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";

import { MorningForm } from "../../src/components/forms/MorningForm";
import { submitMorningEntry } from "../../src/services/firestore";
import { useAuth } from "../../src/hooks/useAuth";
import { useEntry } from "../../src/hooks/useEntry";

export default function MorningFormScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { entry, loading } = useEntry();

  const handleSubmit = async (
    data: Parameters<typeof submitMorningEntry>[1]
  ) => {
    try {
      await submitMorningEntry(user!.uid, data);
      Alert.alert("Sucesso", "Formulário salvo!");
      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar. Tente novamente.");
    }
  };

  return (
    <View className="flex-1 bg-primary-950">
      <Stack.Screen
        options={{
          title: "Formulário da Manhã",
          headerStyle: { backgroundColor: "#312e81" },
          headerTintColor: "#e0e7ff",
        }}
      />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <MorningForm onSubmit={handleSubmit} initialData={entry?.morning} />
      )}
    </View>
  );
}
