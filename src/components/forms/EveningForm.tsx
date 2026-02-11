import React, { useState } from "react";
import { TextInput, View, Text } from "react-native";
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
}

export function EveningForm({ onSubmit, initialData }: EveningFormProps) {
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
          label="Tive sono a tarde?"
        />

        {showSleepinessTime && (
          <TimeInput
            value={sleepinessTime}
            onChange={setSleepinessTime}
            label="Horario do sono"
          />
        )}

        <ToggleButton value={slept} onChange={setSlept} label="Dormiu?" />

        <RadioGroup
          options={mealSizeOptions}
          value={lunch}
          onChange={setLunch}
          label="Almoco"
        />

        <ToggleButton value={coffee} onChange={setCoffee} label="Cafe?" />

        <ToggleButton value={sweets} onChange={setSweets} label="Doce?" />

        <ToggleButton value={exercise} onChange={setExercise} label="Exercicio?" />

        <View className="mb-4">
          <TextInput
            value={observations}
            onChangeText={setObservations}
            placeholder="Observacoes"
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
    </KeyboardAwareScrollView>
  );
}
