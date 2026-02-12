import { Alert, View, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";

import { EveningForm } from "../../src/components/forms/EveningForm";
import { submitEveningEntry } from "../../src/services/firestore";
import { useAuth } from "../../src/hooks/useAuth";
import { useEntry } from "../../src/hooks/useEntry";

export default function EveningFormScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { entry, loading } = useEntry();

  const handleSubmit = async (
    data: Parameters<typeof submitEveningEntry>[1]
  ) => {
    try {
      await submitEveningEntry(user!.uid, data);
      Alert.alert("Sucesso", "Formulário salvo!");
      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar. Tente novamente.");
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen
        options={{
          title: "Como foi sua tarde?",
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
        <EveningForm onSubmit={handleSubmit} initialData={entry?.evening} />
      )}
    </View>
  );
}
