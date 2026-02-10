import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useTodayStatus } from "../../src/hooks/useEntry";
import { FORM_TITLES, FORM_DESCRIPTIONS, FORM_ICONS } from "../../src/config/constants";
import type { FormType } from "../../src/types/entry";

const FORM_TYPES: FormType[] = ["morning", "noon", "evening"];

export default function FormsScreen() {
  const router = useRouter();
  const { status, loading } = useTodayStatus();

  function handleFormPress(type: FormType) {
    router.push(`/form/${type}` as any);
  }

  if (loading) {
    return (
      <View className="flex-1 bg-primary-950 justify-center items-center" style={{ paddingTop: Constants.statusBarHeight }}>
        <ActivityIndicator color="#818cf8" size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-primary-950" style={{ paddingTop: Constants.statusBarHeight }} contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="p-5">
        <Text className="text-indigo-200 text-sm mb-4">
          Preencha os formulários diários para acompanhar seus hábitos.
        </Text>

        {FORM_TYPES.map((type) => {
          const completed = status[type];

          return (
            <TouchableOpacity
              key={type}
              onPress={() => handleFormPress(type)}
              activeOpacity={0.7}
              className={`rounded-2xl p-5 mb-4 border ${
                completed
                  ? "bg-indigo-500/20 border-indigo-500"
                  : "bg-primary-900 border-primary-800"
              }`}
            >
              <View className="flex-row items-center mb-2">
                <Text className="text-2xl mr-3">{FORM_ICONS[type]}</Text>
                <View className="flex-1">
                  <Text className="text-indigo-100 font-semibold text-base">
                    {FORM_TITLES[type]}
                  </Text>
                  <Text className="text-indigo-300 text-sm mt-1">
                    {FORM_DESCRIPTIONS[type]}
                  </Text>
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${
                    completed ? "bg-green-600" : "bg-primary-800"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      completed ? "text-green-100" : "text-indigo-400"
                    }`}
                  >
                    {completed ? "Feito" : "Pendente"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
