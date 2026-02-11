import { useState, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useEntryRange } from "../../src/hooks/useEntry";
import { EntryCard } from "../../src/components/history/EntryCard";
import { daysAgo } from "../../src/utils/date";

export default function HistoryScreen() {
  const [range, setRange] = useState(7);
  const { entries, loading, refresh } = useEntryRange(daysAgo(range), daysAgo(0));
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return (
    <ScrollView className="flex-1 bg-base-900" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="p-5">
        <View className="flex-row gap-2 mb-4">
          {[7, 14, 30].map((days) => (
            <TouchableOpacity
              key={days}
              onPress={() => setRange(days)}
              className={`flex-1 rounded-xl py-2 items-center ${
                range === days ? "bg-accent-dark" : "bg-base-800"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  range === days ? "text-white" : "text-base-400"
                }`}
              >
                {days} dias
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator color="#6366f1" size="large" className="mt-8" />
        ) : entries.length === 0 ? (
          <View className="bg-base-800 rounded-2xl p-6 items-center mt-4">
            <Text className="text-base-400 text-sm text-center mb-4">
              Nenhum registro encontrado neste periodo.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)" as any)}
              activeOpacity={0.7}
              className="bg-accent-dark rounded-xl px-6 py-3"
            >
              <Text className="text-white text-sm font-semibold">Preencher formulario</Text>
            </TouchableOpacity>
          </View>
        ) : (
          entries.map((entry) => (
            <EntryCard key={entry.dateString} entry={entry} />
          ))
        )}
      </View>
    </ScrollView>
  );
}
