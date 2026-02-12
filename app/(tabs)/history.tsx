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
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="p-5">
        <View className="flex-row gap-2 mb-4">
          {[7, 14, 30].map((days) => (
            <TouchableOpacity
              key={days}
              onPress={() => setRange(days)}
              className={`flex-1 rounded-button py-2.5 items-center ${
                range === days ? "bg-accent" : "bg-surface-card"
              }`}
              style={range !== days ? {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              } : undefined}
            >
              <Text
                className={`text-sm font-semibold ${
                  range === days ? "text-text-inverse" : "text-text-muted"
                }`}
              >
                {days} dias
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator color="#FF7617" size="large" className="mt-8" />
        ) : entries.length === 0 ? (
          <View
            className="bg-surface-card rounded-card p-6 items-center mt-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Text className="text-text-muted text-body text-center mb-4">
              Nenhum registro encontrado neste período.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)" as any)}
              activeOpacity={0.7}
              className="bg-primary rounded-button px-6 py-3"
            >
              <Text className="text-text-inverse text-sm font-semibold">Preencher formulário</Text>
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
