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
  NoonEntry,
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

interface NoonFormProps {
  onSubmit: (data: Omit<NoonEntry, "submittedAt">) => Promise<void>;
  initialData?: NoonEntry;
}

export function NoonForm({ onSubmit, initialData }: NoonFormProps) {
  const insets = useSafeAreaInsets();
  const [morningSleepiness, setMorningSleepiness] = useState<string>(initialData?.morningSleepiness ?? "");
  const [sleepinessTime, setSleepinessTime] = useState<string | null>(initialData?.sleepinessTime ?? null);
  const [slept, setSlept] = useState<boolean>(initialData?.slept ?? false);
  const [sunlight, setSunlight] = useState<boolean>(initialData?.sunlight ?? false);
  const [breakfast, setBreakfast] = useState<string>(initialData?.breakfast ?? "");
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
        morningSleepiness: morningSleepiness as SleepinessLevel,
        sleepinessTime,
        slept,
        sunlight,
        breakfast: breakfast as MealSize,
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

  const showSleepinessTime = morningSleepiness !== "" && morningSleepiness !== "nada";

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-base-900"
      contentContainerClassName="px-4 py-6"
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      {initialData && (
        <View className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-4">
          <Text className="text-amber-400 text-sm font-medium">Editando registro existente</Text>
        </View>
      )}

      <FormCard>
        <SectionHeader title="Manha" icon="☀️" />

        <RadioGroup
          options={sleepinessOptions}
          value={morningSleepiness}
          onChange={setMorningSleepiness}
          label="Tive sono de manha?"
        />

        {showSleepinessTime && (
          <TimeInput
            value={sleepinessTime}
            onChange={setSleepinessTime}
            label="Horario do sono"
          />
        )}

        <ToggleButton value={slept} onChange={setSlept} label="Dormiu?" />

        <ToggleButton value={sunlight} onChange={setSunlight} label="Luz solar?" />

        <RadioGroup
          options={mealSizeOptions}
          value={breakfast}
          onChange={setBreakfast}
          label="Cafe da manha"
        />

        <ToggleButton value={coffee} onChange={setCoffee} label="Cafe?" />

        <ToggleButton value={sweets} onChange={setSweets} label="Doce?" />

        <ToggleButton value={exercise} onChange={setExercise} label="Exercicio?" />

        <View className="mb-4">
          <TextInput
            value={observations}
            onChangeText={setObservations}
            placeholder="Observacoes"
            placeholderTextColor="#64748b"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="bg-base-800 border border-base-700 text-base-100 rounded-xl p-4"
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
