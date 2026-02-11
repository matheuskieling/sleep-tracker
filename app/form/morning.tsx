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
      Alert.alert("Sucesso", "Formulario salvo!");
      router.back();
    } catch {
      Alert.alert("Erro", "Nao foi possivel salvar. Tente novamente.");
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen
        options={{
          title: "Formulario da Manha",
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
