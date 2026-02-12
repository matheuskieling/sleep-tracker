import React, { useState } from "react";
import { TextInput, View, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RadioGroup } from "../ui/RadioGroup";
import { NumberInput } from "../ui/NumberInput";
import { FormCard } from "../ui/FormCard";
import { SubmitButton } from "../ui/SubmitButton";

import type {
  MorningEntry,
  SleepQuality,
  MealSize,
  WakeSleepiness,
} from "../../types/entry";
import {
  SLEEP_QUALITY_LABELS,
  MEAL_SIZE_LABELS,
  WAKE_SLEEPINESS_LABELS,
} from "../../utils/form-labels";

function labelsToOptions<T extends string>(labels: Record<T, string>) {
  return Object.entries(labels).map(([value, label]) => ({
    value: value as string,
    label: label as string,
  }));
}

const sleepQualityOptions = labelsToOptions(SLEEP_QUALITY_LABELS);
const mealSizeOptions = labelsToOptions(MEAL_SIZE_LABELS);
const wakeSleepinessOptions = labelsToOptions(WAKE_SLEEPINESS_LABELS);

interface MorningFormProps {
  onSubmit: (data: Omit<MorningEntry, "submittedAt">) => Promise<void>;
  initialData?: MorningEntry;
}

export function MorningForm({ onSubmit, initialData }: MorningFormProps) {
  const insets = useSafeAreaInsets();
  const [hoursSlept, setHoursSlept] = useState<number>(initialData?.hoursSlept ?? 7);
  const [sleepQuality, setSleepQuality] = useState<string>(initialData?.sleepQuality ?? "");
  const [nightAwakenings, setNightAwakenings] = useState<number>(initialData?.nightAwakenings ?? 0);
  const [dinner, setDinner] = useState<string>(initialData?.dinner ?? "");
  const [wakeSleepiness, setWakeSleepiness] = useState<string>(initialData?.wakeSleepiness ?? "");
  const [observations, setObservations] = useState<string>(initialData?.observations ?? "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({
        hoursSlept,
        sleepQuality: sleepQuality as SleepQuality,
        nightAwakenings,
        dinner: dinner as MealSize,
        wakeSleepiness: wakeSleepiness as WakeSleepiness,
        observations,
      });
    } finally {
      setLoading(false);
    }
  };

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
        <NumberInput
          value={hoursSlept}
          onChange={setHoursSlept}
          label="Horas de sono"
          min={0}
          max={24}
          step={0.5}
          unit="h"
        />

        <RadioGroup
          options={sleepQualityOptions}
          value={sleepQuality}
          onChange={setSleepQuality}
          label="Qualidade do sono"
        />

        <NumberInput
          value={nightAwakenings}
          onChange={setNightAwakenings}
          label="Despertares noturnos"
          min={0}
          max={20}
        />

        <RadioGroup
          options={mealSizeOptions}
          value={dinner}
          onChange={setDinner}
          label="Janta (ontem)"
        />

        <RadioGroup
          options={wakeSleepinessOptions}
          value={wakeSleepiness}
          onChange={setWakeSleepiness}
          label="Nível de sono ao acordar"
        />

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

      <SubmitButton onPress={handleSubmit} loading={loading} label="Enviar" />
    </KeyboardAwareScrollView>
  );
}
