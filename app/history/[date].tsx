import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEntry } from "../../src/hooks/useEntry";
import { formatDateFull } from "../../src/utils/date";
import { FORM_TITLES } from "../../src/config/constants";
import type { FormType } from "../../src/types/entry";
import {
  SLEEP_QUALITY_LABELS,
  MEAL_SIZE_LABELS,
  WAKE_SLEEPINESS_LABELS,
  SLEEPINESS_LEVEL_LABELS,
  FOCUS_LEVEL_LABELS,
  STRESS_LEVEL_LABELS,
  ANXIETY_LEVEL_LABELS,
} from "../../src/utils/form-labels";
import type { MorningEntry, NoonEntry, EveningEntry } from "../../src/types/entry";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-center py-2 border-b border-border">
      <Text className="text-text-muted text-sm flex-1">{label}</Text>
      <Text className="text-text text-sm font-semibold">{value}</Text>
    </View>
  );
}

const SECTION_ICONS: Record<FormType, { icon: string; color: string; bg: string }> = {
  morning: { icon: "moon-outline", color: "#652D07", bg: "bg-pastel-brown" },
  noon: { icon: "sunny-outline", color: "#FF7617", bg: "bg-pastel-orange" },
  evening: { icon: "partly-sunny-outline", color: "#D46010", bg: "bg-pastel-amber" },
};

function SectionHeader({ type, title }: { type: FormType; title: string }) {
  const config = SECTION_ICONS[type];
  return (
    <View className="flex-row items-center gap-3 mb-3 mt-5">
      <View className={`w-9 h-9 rounded-full items-center justify-center ${config.bg}`}>
        <Ionicons name={config.icon as any} size={18} color={config.color} />
      </View>
      <Text className="text-text text-body font-bold">{title}</Text>
    </View>
  );
}

function MorningSection({ data }: { data: MorningEntry }) {
  return (
    <View
      className="bg-surface-card rounded-card p-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <InfoRow label="Horas de sono" value={`${data.hoursSlept}h`} />
      <InfoRow label="Qualidade do sono" value={SLEEP_QUALITY_LABELS[data.sleepQuality]} />
      <InfoRow label="Despertares noturnos" value={String(data.nightAwakenings)} />
      <InfoRow label="Jantar (noite anterior)" value={MEAL_SIZE_LABELS[data.dinner]} />
      <InfoRow label="Sonolência ao acordar" value={WAKE_SLEEPINESS_LABELS[data.wakeSleepiness]} />
      {data.observations ? (
        <View className="mt-3">
          <Text className="text-text-muted text-sm mb-1">Observações</Text>
          <Text className="text-text text-sm">{data.observations}</Text>
        </View>
      ) : null}
    </View>
  );
}

function NoonSection({ data }: { data: NoonEntry }) {
  return (
    <View
      className="bg-surface-card rounded-card p-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <InfoRow label="Sonolência pela manhã" value={SLEEPINESS_LEVEL_LABELS[data.morningSleepiness]} />
      {data.sleepinessTime ? (
        <InfoRow label="Horário da sonolência" value={data.sleepinessTime} />
      ) : null}
      <InfoRow label="Dormiu" value={data.slept ? "Sim" : "Não"} />
      <InfoRow label="Tomou sol" value={data.sunlight ? "Sim" : "Não"} />
      <InfoRow label="Café da manhã" value={MEAL_SIZE_LABELS[data.breakfast]} />
      <InfoRow label="Café/cafeína" value={data.coffee ? "Sim" : "Não"} />
      <InfoRow label="Doces" value={data.sweets ? "Sim" : "Não"} />
      <InfoRow label="Exercício" value={data.exercise ? "Sim" : "Não"} />
      <InfoRow label="Foco" value={FOCUS_LEVEL_LABELS[data.focus]} />
      <InfoRow label="Estresse" value={STRESS_LEVEL_LABELS[data.stress]} />
      <InfoRow label="Ansiedade" value={ANXIETY_LEVEL_LABELS[data.anxiety]} />
      {data.observations ? (
        <View className="mt-3">
          <Text className="text-text-muted text-sm mb-1">Observações</Text>
          <Text className="text-text text-sm">{data.observations}</Text>
        </View>
      ) : null}
    </View>
  );
}

function EveningSection({ data }: { data: EveningEntry }) {
  return (
    <View
      className="bg-surface-card rounded-card p-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <InfoRow label="Sonolência à tarde" value={SLEEPINESS_LEVEL_LABELS[data.afternoonSleepiness]} />
      {data.sleepinessTime ? (
        <InfoRow label="Horário da sonolência" value={data.sleepinessTime} />
      ) : null}
      <InfoRow label="Dormiu" value={data.slept ? "Sim" : "Não"} />
      <InfoRow label="Almoço" value={MEAL_SIZE_LABELS[data.lunch]} />
      <InfoRow label="Café/cafeína" value={data.coffee ? "Sim" : "Não"} />
      <InfoRow label="Doces" value={data.sweets ? "Sim" : "Não"} />
      <InfoRow label="Exercício" value={data.exercise ? "Sim" : "Não"} />
      <InfoRow label="Foco" value={FOCUS_LEVEL_LABELS[data.focus]} />
      <InfoRow label="Estresse" value={STRESS_LEVEL_LABELS[data.stress]} />
      <InfoRow label="Ansiedade" value={ANXIETY_LEVEL_LABELS[data.anxiety]} />
      {data.observations ? (
        <View className="mt-3">
          <Text className="text-text-muted text-sm mb-1">Observações</Text>
          <Text className="text-text text-sm">{data.observations}</Text>
        </View>
      ) : null}
    </View>
  );
}

function EmptySection({ title }: { title: string }) {
  return (
    <View className="bg-surface-input rounded-card p-4 items-center">
      <Text className="text-text-muted text-sm">{title} não preenchido</Text>
    </View>
  );
}

export default function EntryDetailScreen() {
  const { date: dateParam } = useLocalSearchParams<{ date: string }>();
  const date = typeof dateParam === "string" ? dateParam : "";
  const { entry, loading } = useEntry(date);
  const insets = useSafeAreaInsets();

  const displayDate = date ? formatDateFull(date) : "";

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: displayDate || "Detalhes" }} />
        <View className="flex-1 bg-surface items-center justify-center">
          <ActivityIndicator size="large" color="#FF7617" />
        </View>
      </>
    );
  }

  if (!entry) {
    return (
      <>
        <Stack.Screen options={{ title: displayDate || "Detalhes" }} />
        <View className="flex-1 bg-surface items-center justify-center">
          <Text className="text-text-muted text-sm">Registro não encontrado.</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: displayDate }} />
      <ScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <View className="p-5">
          {/* Morning */}
          <SectionHeader type="morning" title={FORM_TITLES.morning} />
          {entry.morning ? (
            <MorningSection data={entry.morning} />
          ) : (
            <EmptySection title="Formulário da manhã" />
          )}

          {/* Noon */}
          <SectionHeader type="noon" title={FORM_TITLES.noon} />
          {entry.noon ? (
            <NoonSection data={entry.noon} />
          ) : (
            <EmptySection title="Formulário do meio-dia" />
          )}

          {/* Evening */}
          <SectionHeader type="evening" title={FORM_TITLES.evening} />
          {entry.evening ? (
            <EveningSection data={entry.evening} />
          ) : (
            <EmptySection title="Formulário da noite" />
          )}
        </View>
      </ScrollView>
    </>
  );
}
