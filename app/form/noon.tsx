import { Alert, View, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";

import { NoonForm } from "../../src/components/forms/NoonForm";
import { submitNoonEntry } from "../../src/services/firestore";
import { useAuth } from "../../src/hooks/useAuth";
import { useEntry } from "../../src/hooks/useEntry";

export default function NoonFormScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { entry, loading } = useEntry();

  const handleSubmit = async (
    data: Parameters<typeof submitNoonEntry>[1]
  ) => {
    try {
      await submitNoonEntry(user!.uid, data);
      Alert.alert("Sucesso", "Formulario salvo!");
      router.back();
    } catch {
      Alert.alert("Erro", "Nao foi possivel salvar. Tente novamente.");
    }
  };

  return (
    <View className="flex-1 bg-base-900">
      <Stack.Screen
        options={{
          title: "Formulario do Meio-dia",
          headerStyle: { backgroundColor: "#0f172a" },
          headerTintColor: "#f1f5f9",
          headerShadowVisible: false,
        }}
      />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <NoonForm onSubmit={handleSubmit} initialData={entry?.noon} />
      )}
    </View>
  );
}
