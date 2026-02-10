import { Alert } from "react-native";
import { View } from "react-native";
import { Stack, useRouter } from "expo-router";

import { NoonForm } from "../../src/components/forms/NoonForm";
import { submitNoonEntry } from "../../src/services/firestore";
import { useAuth } from "../../src/hooks/useAuth";

export default function NoonFormScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (
    data: Parameters<typeof submitNoonEntry>[1]
  ) => {
    try {
      await submitNoonEntry(user!.uid, data);
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
          title: "Formulário do Meio-dia",
          headerStyle: { backgroundColor: "#312e81" },
          headerTintColor: "#e0e7ff",
        }}
      />
      <NoonForm onSubmit={handleSubmit} />
    </View>
  );
}
