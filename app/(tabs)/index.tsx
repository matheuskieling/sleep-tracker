import { useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { useAuth } from "../../src/hooks/useAuth";
import { useDateStatus, useEntryRange } from "../../src/hooks/useEntry";
import { WeekSelector } from "../../src/components/dashboard/WeekSelector";
import { ChecklistCard, ChecklistCardSkeleton } from "../../src/components/dashboard/ChecklistCard";
import { QuickStats, QuickStatsSkeleton } from "../../src/components/dashboard/QuickStats";
import { signOut } from "../../src/services/auth";
import { daysAgo, getTodayString, formatDate } from "../../src/utils/date";
import { FORM_CARD_TITLES } from "../../src/config/constants";
import type { FormType } from "../../src/types/entry";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function getFormattedDate(): string {
  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const d = new Date();
  return `${days[d.getDay()]}, ${d.getDate()} de ${months[d.getMonth()]}`;
}

function computeStreak(entries: any[]): number {
  const sorted = [...entries].sort((a, b) =>
    b.dateString.localeCompare(a.dateString)
  );
  let streak = 0;
  for (const entry of sorted) {
    const hasData = !!entry.morning || !!entry.noon || !!entry.evening;
    if (hasData) streak++;
    else break;
  }
  return streak;
}

const FORM_TYPES: FormType[] = ["morning", "noon", "evening"];

export default function DashboardScreen() {
  const { user, userName } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const { status, loading: statusLoading, refresh: refreshStatus } = useDateStatus(selectedDate);
  const { entries, loading: entriesLoading, refresh: refreshEntries } = useEntryRange(daysAgo(7), daysAgo(0));

  useFocusEffect(
    useCallback(() => {
      refreshStatus();
      refreshEntries();
    }, [refreshStatus, refreshEntries])
  );

  function handleFormPress(type: FormType) {
    router.push({ pathname: `/form/${type}` as any, params: { date: selectedDate } });
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

  const streak = entriesLoading ? 0 : computeStreak(entries);
  const firstName = userName?.split(" ")[0] || "usuario";

  return (
    <ScrollView
      className="flex-1 bg-surface"
      style={{ paddingTop: Constants.statusBarHeight + 24 }}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="p-5">
        {/* Greeting Header */}
        <View className="flex-row justify-between items-start mb-6">
          <View className="flex-1">
            <Text className="text-heading-xl text-text">
              {getGreeting()}, {firstName}!
            </Text>
            <Text className="text-body text-text-muted mt-1">
              {getFormattedDate()}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="w-11 h-11 rounded-full bg-surface-card items-center justify-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#652D07" />
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <Text className="text-heading-m text-text mb-3">
          Últimos 7 dias
        </Text>

        {entriesLoading ? (
          <QuickStatsSkeleton />
        ) : (
          <QuickStats entries={entries} />
        )}

        {/* Week Day Selector */}
        <View className="mt-6">
          <WeekSelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </View>

        {/* Checklist Section */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-heading-m text-text">Registro do dia</Text>
        </View>

        {statusLoading ? (
          <View>
            {FORM_TYPES.map((type, index) => (
              <ChecklistCardSkeleton
                key={type}
                type={type}
                title={FORM_CARD_TITLES[type]}
                isLast={index === FORM_TYPES.length - 1}
              />
            ))}
          </View>
        ) : (
          <View>
            {FORM_TYPES.map((type, index) => (
              <ChecklistCard
                key={type}
                type={type}
                title={FORM_CARD_TITLES[type]}
                completed={status[type]}
                streak={streak}
                isLast={index === FORM_TYPES.length - 1}
                onPress={() => handleFormPress(type)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
