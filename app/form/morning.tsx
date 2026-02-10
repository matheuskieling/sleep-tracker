import { Alert } from "react-native";
import { View } from "react-native";
import { Stack, useRouter } from "expo-router";

import { MorningForm } from "../../src/components/forms/MorningForm";
import { submitMorningEntry } from "../../src/services/firestore";
import { useAuth } from "../../src/hooks/useAuth";

export default function MorningFormScreen() {
  const { user } = useAuth();
  const router = useRouter();

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
      <MorningForm onSubmit={handleSubmit} />
    </View>
  );
}
