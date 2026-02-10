import { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useEntryRange } from "../../src/hooks/useEntry";
import { EntryCard } from "../../src/components/history/EntryCard";
import { daysAgo } from "../../src/utils/date";

export default function HistoryScreen() {
  const [range, setRange] = useState(7);
  const { entries, loading } = useEntryRange(daysAgo(range), daysAgo(0));

  return (
    <ScrollView className="flex-1 bg-primary-950" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="p-5">
        <View className="flex-row gap-2 mb-4">
          {[7, 14, 30].map((days) => (
            <TouchableOpacity
              key={days}
              onPress={() => setRange(days)}
              className={`flex-1 rounded-xl py-2 items-center ${
                range === days ? "bg-indigo-600" : "bg-primary-900"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  range === days ? "text-indigo-100" : "text-indigo-400"
                }`}
              >
                {days} dias
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator color="#818cf8" size="large" className="mt-8" />
        ) : entries.length === 0 ? (
          <View className="bg-primary-900 rounded-2xl p-6 items-center mt-4">
            <Text className="text-indigo-300 text-sm text-center">
              Nenhum registro encontrado neste período.
            </Text>
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
