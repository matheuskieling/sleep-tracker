import { useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import Constants from "expo-constants";
import { useRouter, useFocusEffect } from "expo-router";
import { useAuth } from "../../src/hooks/useAuth";
import { useTodayStatus, useEntryRange } from "../../src/hooks/useEntry";
import { DailyProgress } from "../../src/components/dashboard/DailyProgress";
import { QuickStats } from "../../src/components/dashboard/QuickStats";
import { signOut } from "../../src/services/auth";
import { daysAgo } from "../../src/utils/date";
import type { FormType } from "../../src/types/entry";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardScreen() {
  const { user, userName } = useAuth();
  const router = useRouter();
  const { status, loading: statusLoading, refresh: refreshStatus } = useTodayStatus();
  const { entries, loading: entriesLoading, refresh: refreshEntries } = useEntryRange(daysAgo(7), daysAgo(0));

  useFocusEffect(
    useCallback(() => {
      refreshStatus();
      refreshEntries();
    }, [refreshStatus, refreshEntries])
  );

  function handleFormPress(type: FormType) {
    router.push(`/form/${type}` as any);
  }

  function handleLogout() {
    Alert.alert("Sair", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  }

  return (
    <ScrollView className="flex-1 bg-base-900" style={{ paddingTop: Constants.statusBarHeight }} contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="p-5">
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-2xl font-bold text-base-100">
              {getGreeting()}, {userName || "usuario"}!
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-base-800 rounded-xl px-4 py-2"
          >
            <Text className="text-base-400 text-sm">Sair</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-base-300 font-semibold text-base mb-3">
          Formularios de Hoje
        </Text>

        {statusLoading ? (
          <ActivityIndicator color="#6366f1" className="my-4" />
        ) : (
          <DailyProgress status={status} onFormPress={handleFormPress} />
        )}

        <Text className="text-base-300 font-semibold text-base mt-6 mb-3">
          Ultimos 7 dias
        </Text>

        {entriesLoading ? (
          <ActivityIndicator color="#6366f1" className="my-4" />
        ) : (
          <QuickStats entries={entries} />
        )}
      </View>
    </ScrollView>
  );
}
