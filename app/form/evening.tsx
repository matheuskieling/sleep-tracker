import { Alert } from "react-native";
import { View } from "react-native";
import { Stack, useRouter } from "expo-router";

import { EveningForm } from "../../src/components/forms/EveningForm";
import { submitEveningEntry } from "../../src/services/firestore";
import { useAuth } from "../../src/hooks/useAuth";

export default function EveningFormScreen() {
  const { user } = useAuth();
  const router = useRouter();

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
    <View className="flex-1 bg-primary-950">
      <Stack.Screen
        options={{
          title: "Formulário da Noite",
          headerStyle: { backgroundColor: "#312e81" },
          headerTintColor: "#e0e7ff",
        }}
      />
      <EveningForm onSubmit={handleSubmit} />
    </View>
  );
}
