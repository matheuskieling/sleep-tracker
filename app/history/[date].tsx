import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEntry } from "../../src/hooks/useEntry";
import { formatDateDisplay } from "../../src/utils/date";
import { FORM_ICONS, FORM_TITLES } from "../../src/config/constants";
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
    <View className="flex-row justify-between items-center py-2 border-b border-base-700">
      <Text className="text-base-400 text-sm flex-1">{label}</Text>
      <Text className="text-base-100 text-sm font-semibold">{value}</Text>
    </View>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <View className="flex-row items-center gap-2 mb-3 mt-5">
      <Text className="text-lg">{icon}</Text>
      <Text className="text-base-100 text-base font-bold">{title}</Text>
    </View>
  );
}

function MorningSection({ data }: { data: MorningEntry }) {
  return (
    <View className="bg-base-800 rounded-2xl p-4">
      <InfoRow label="Horas de sono" value={`${data.hoursSlept}h`} />
      <InfoRow label="Qualidade do sono" value={SLEEP_QUALITY_LABELS[data.sleepQuality]} />
      <InfoRow label="Despertares noturnos" value={String(data.nightAwakenings)} />
      <InfoRow label="Jantar (noite anterior)" value={MEAL_SIZE_LABELS[data.dinner]} />
      <InfoRow label="Sonolencia ao acordar" value={WAKE_SLEEPINESS_LABELS[data.wakeSleepiness]} />
      {data.observations ? (
        <View className="mt-3">
          <Text className="text-base-400 text-sm mb-1">Observacoes</Text>
          <Text className="text-base-100 text-sm">{data.observations}</Text>
        </View>
      ) : null}
    </View>
  );
}

function NoonSection({ data }: { data: NoonEntry }) {
  return (
    <View className="bg-base-800 rounded-2xl p-4">
      <InfoRow label="Sonolencia pela manha" value={SLEEPINESS_LEVEL_LABELS[data.morningSleepiness]} />
      {data.sleepinessTime ? (
        <InfoRow label="Horario da sonolencia" value={data.sleepinessTime} />
      ) : null}
      <InfoRow label="Dormiu" value={data.slept ? "Sim" : "Nao"} />
      <InfoRow label="Tomou sol" value={data.sunlight ? "Sim" : "Nao"} />
      <InfoRow label="Cafe da manha" value={MEAL_SIZE_LABELS[data.breakfast]} />
      <InfoRow label="Cafe/cafeina" value={data.coffee ? "Sim" : "Nao"} />
      <InfoRow label="Doces" value={data.sweets ? "Sim" : "Nao"} />
      <InfoRow label="Exercicio" value={data.exercise ? "Sim" : "Nao"} />
      <InfoRow label="Foco" value={FOCUS_LEVEL_LABELS[data.focus]} />
      <InfoRow label="Estresse" value={STRESS_LEVEL_LABELS[data.stress]} />
      <InfoRow label="Ansiedade" value={ANXIETY_LEVEL_LABELS[data.anxiety]} />
      {data.observations ? (
        <View className="mt-3">
          <Text className="text-base-400 text-sm mb-1">Observacoes</Text>
          <Text className="text-base-100 text-sm">{data.observations}</Text>
        </View>
      ) : null}
    </View>
  );
}

function EveningSection({ data }: { data: EveningEntry }) {
  return (
    <View className="bg-base-800 rounded-2xl p-4">
      <InfoRow label="Sonolencia a tarde" value={SLEEPINESS_LEVEL_LABELS[data.afternoonSleepiness]} />
      {data.sleepinessTime ? (
        <InfoRow label="Horario da sonolencia" value={data.sleepinessTime} />
      ) : null}
      <InfoRow label="Dormiu" value={data.slept ? "Sim" : "Nao"} />
      <InfoRow label="Almoco" value={MEAL_SIZE_LABELS[data.lunch]} />
      <InfoRow label="Cafe/cafeina" value={data.coffee ? "Sim" : "Nao"} />
      <InfoRow label="Doces" value={data.sweets ? "Sim" : "Nao"} />
      <InfoRow label="Exercicio" value={data.exercise ? "Sim" : "Nao"} />
      <InfoRow label="Foco" value={FOCUS_LEVEL_LABELS[data.focus]} />
      <InfoRow label="Estresse" value={STRESS_LEVEL_LABELS[data.stress]} />
      <InfoRow label="Ansiedade" value={ANXIETY_LEVEL_LABELS[data.anxiety]} />
      {data.observations ? (
        <View className="mt-3">
          <Text className="text-base-400 text-sm mb-1">Observacoes</Text>
          <Text className="text-base-100 text-sm">{data.observations}</Text>
        </View>
      ) : null}
    </View>
  );
}

function EmptySection({ title }: { title: string }) {
  return (
    <View className="bg-base-800/50 rounded-2xl p-4 items-center">
      <Text className="text-base-500/60 text-sm">{title} nao preenchido</Text>
    </View>
  );
}

export default function EntryDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { entry, loading } = useEntry(date);
  const insets = useSafeAreaInsets();

  const displayDate = date ? formatDateDisplay(date) : "";

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: displayDate || "Detalhes" }} />
        <View className="flex-1 bg-base-900 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      </>
    );
  }

  if (!entry) {
    return (
      <>
        <Stack.Screen options={{ title: displayDate || "Detalhes" }} />
        <View className="flex-1 bg-base-900 items-center justify-center">
          <Text className="text-base-500 text-sm">Registro nao encontrado.</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: displayDate }} />
      <ScrollView
        className="flex-1 bg-base-900"
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <View className="p-5">
          {/* Morning */}
          <SectionHeader icon={FORM_ICONS.morning} title={FORM_TITLES.morning} />
          {entry.morning ? (
            <MorningSection data={entry.morning} />
          ) : (
            <EmptySection title="Formulario da manha" />
          )}

          {/* Noon */}
          <SectionHeader icon={FORM_ICONS.noon} title={FORM_TITLES.noon} />
          {entry.noon ? (
            <NoonSection data={entry.noon} />
          ) : (
            <EmptySection title="Formulario do meio-dia" />
          )}

          {/* Evening */}
          <SectionHeader icon={FORM_ICONS.evening} title={FORM_TITLES.evening} />
          {entry.evening ? (
            <EveningSection data={entry.evening} />
          ) : (
            <EmptySection title="Formulario da noite" />
          )}
        </View>
      </ScrollView>
    </>
  );
}
