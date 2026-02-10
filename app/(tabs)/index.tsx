import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/hooks/useAuth";
import { useTodayStatus, useEntryRange } from "../../src/hooks/useEntry";
import { DailyProgress } from "../../src/components/dashboard/DailyProgress";
import { QuickStats } from "../../src/components/dashboard/QuickStats";
import { signOut } from "../../src/services/auth";
import { daysAgo } from "../../src/utils/date";
import type { FormType } from "../../src/types/entry";

export default function DashboardScreen() {
  const { user, userName } = useAuth();
  const router = useRouter();
  const { status, loading: statusLoading } = useTodayStatus();
  const { entries, loading: entriesLoading } = useEntryRange(daysAgo(7), daysAgo(0));

  function handleFormPress(type: FormType) {
    router.push(`/form/${type}` as any);
  }

  async function handleLogout() {
    await signOut();
  }

  return (
    <ScrollView className="flex-1 bg-primary-950" style={{ paddingTop: Constants.statusBarHeight }} contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="p-5">
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-2xl font-bold text-indigo-100">
              Olá, {userName || "usuário"}!
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-primary-900 rounded-xl px-4 py-2"
          >
            <Text className="text-indigo-300 text-sm">Sair</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-indigo-200 font-semibold text-base mb-3">
          Formulários de Hoje
        </Text>

        {statusLoading ? (
          <ActivityIndicator color="#818cf8" className="my-4" />
        ) : (
          <DailyProgress status={status} onFormPress={handleFormPress} />
        )}

        <Text className="text-indigo-200 font-semibold text-base mt-6 mb-3">
          Últimos 7 dias
        </Text>

        {entriesLoading ? (
          <ActivityIndicator color="#818cf8" className="my-4" />
        ) : (
          <QuickStats entries={entries} />
        )}
      </View>
    </ScrollView>
  );
}
