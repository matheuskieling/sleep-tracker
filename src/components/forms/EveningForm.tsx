import React, { useState } from "react";
import { TextInput, View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RadioGroup } from "../ui/RadioGroup";
import { ToggleButton } from "../ui/ToggleButton";
import { TimeInput } from "../ui/TimeInput";
import { SectionHeader } from "../ui/SectionHeader";
import { FormCard } from "../ui/FormCard";
import { SubmitButton } from "../ui/SubmitButton";

import type {
  EveningEntry,
  SleepinessLevel,
  MealSize,
  FocusLevel,
  StressLevel,
  AnxietyLevel,
} from "../../types/entry";
import {
  SLEEPINESS_LEVEL_LABELS,
  MEAL_SIZE_LABELS,
  FOCUS_LEVEL_LABELS,
  STRESS_LEVEL_LABELS,
  ANXIETY_LEVEL_LABELS,
} from "../../utils/form-labels";

function labelsToOptions<T extends string>(labels: Record<T, string>) {
  return Object.entries(labels).map(([value, label]) => ({
    value: value as string,
    label: label as string,
  }));
}

const sleepinessOptions = labelsToOptions(SLEEPINESS_LEVEL_LABELS);
const mealSizeOptions = labelsToOptions(MEAL_SIZE_LABELS);
const focusOptions = labelsToOptions(FOCUS_LEVEL_LABELS);
const stressOptions = labelsToOptions(STRESS_LEVEL_LABELS);
const anxietyOptions = labelsToOptions(ANXIETY_LEVEL_LABELS);

interface EveningFormProps {
  onSubmit: (data: Omit<EveningEntry, "submittedAt">) => Promise<void>;
  initialData?: EveningEntry;
  onClear?: () => Promise<void>;
}

export function EveningForm({ onSubmit, initialData, onClear }: EveningFormProps) {
  const insets = useSafeAreaInsets();
  const [afternoonSleepiness, setAfternoonSleepiness] = useState<string>(initialData?.afternoonSleepiness ?? "");
  const [sleepinessTime, setSleepinessTime] = useState<string | null>(initialData?.sleepinessTime ?? null);
  const [slept, setSlept] = useState<boolean>(initialData?.slept ?? false);
  const [lunch, setLunch] = useState<string>(initialData?.lunch ?? "");
  const [coffee, setCoffee] = useState<boolean>(initialData?.coffee ?? false);
  const [sweets, setSweets] = useState<boolean>(initialData?.sweets ?? false);
  const [exercise, setExercise] = useState<boolean>(initialData?.exercise ?? false);
  const [observations, setObservations] = useState<string>(initialData?.observations ?? "");
  const [focus, setFocus] = useState<string>(initialData?.focus ?? "");
  const [stress, setStress] = useState<string>(initialData?.stress ?? "");
  const [anxiety, setAnxiety] = useState<string>(initialData?.anxiety ?? "");
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleClear = () => {
    if (!onClear) return;
    Alert.alert("Limpar registro?", "Os dados desta seção serão removidos.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Limpar",
        style: "destructive",
        onPress: async () => {
          setClearing(true);
          try {
            await onClear();
          } finally {
            setClearing(false);
          }
        },
      },
    ]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({
        afternoonSleepiness: afternoonSleepiness as SleepinessLevel,
        sleepinessTime,
        slept,
        lunch: lunch as MealSize,
        coffee,
        sweets,
        exercise,
        observations,
        focus: focus as FocusLevel,
        stress: stress as StressLevel,
        anxiety: anxiety as AnxietyLevel,
      });
    } finally {
      setLoading(false);
    }
  };

  const showSleepinessTime = afternoonSleepiness !== "" && afternoonSleepiness !== "nada";

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-surface"
      contentContainerClassName="px-5 py-8"
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      {initialData && (
        <View className="bg-accent-subtle rounded-full p-3 mb-4">
          <Text className="text-accent-dark text-sm font-medium text-center">Editando registro existente</Text>
        </View>
      )}

      <FormCard>
        <SectionHeader title="Tarde" icon="🌇" />

        <RadioGroup
          options={sleepinessOptions}
          value={afternoonSleepiness}
          onChange={setAfternoonSleepiness}
          label="Tive sono à tarde?"
        />

        {showSleepinessTime && (
          <TimeInput
            value={sleepinessTime}
            onChange={setSleepinessTime}
            label="Horário do sono"
          />
        )}

        <ToggleButton value={slept} onChange={setSlept} label="Dormiu?" />

        <RadioGroup
          options={mealSizeOptions}
          value={lunch}
          onChange={setLunch}
          label="Almoço"
        />

        <ToggleButton value={coffee} onChange={setCoffee} label="Café?" />

        <ToggleButton value={sweets} onChange={setSweets} label="Doce?" />

        <ToggleButton value={exercise} onChange={setExercise} label="Exercício?" />

        <View className="mb-4">
          <TextInput
            value={observations}
            onChangeText={setObservations}
            placeholder="Observações"
            placeholderTextColor="#A09389"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="bg-surface-card border border-border text-text rounded-[20px] p-4"
          />
        </View>
      </FormCard>

      <FormCard>
        <SectionHeader title="Estado Mental" icon="🧠" />

        <RadioGroup
          options={focusOptions}
          value={focus}
          onChange={setFocus}
          label="Foco"
        />

        <RadioGroup
          options={stressOptions}
          value={stress}
          onChange={setStress}
          label="Estresse"
        />

        <RadioGroup
          options={anxietyOptions}
          value={anxiety}
          onChange={setAnxiety}
          label="Ansiedade"
        />
      </FormCard>

      <SubmitButton onPress={handleSubmit} loading={loading} label="Enviar" />

      {onClear && (
        <TouchableOpacity
          onPress={handleClear}
          disabled={clearing}
          className="border border-danger rounded-full py-5 mt-3 mb-8"
          accessibilityRole="button"
          accessibilityState={{ disabled: clearing }}
        >
          {clearing ? (
            <ActivityIndicator color="#E53935" />
          ) : (
            <View className="flex-row items-center justify-center gap-2">
              <Ionicons name="trash-outline" size={20} color="#E53935" />
              <Text className="text-danger text-lg font-bold">Limpar Registro</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </KeyboardAwareScrollView>
  );
}
