import React, { useState } from "react";
import { ScrollView, TextInput, View } from "react-native";

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
}

export function MorningForm({ onSubmit }: MorningFormProps) {
  const [hoursSlept, setHoursSlept] = useState<number>(7);
  const [sleepQuality, setSleepQuality] = useState<string>("");
  const [nightAwakenings, setNightAwakenings] = useState<number>(0);
  const [dinner, setDinner] = useState<string>("");
  const [wakeSleepiness, setWakeSleepiness] = useState<string>("");
  const [observations, setObservations] = useState<string>("");
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
    <ScrollView
      className="flex-1 bg-primary-950"
      contentContainerClassName="px-4 py-6"
      showsVerticalScrollIndicator={false}
    >
      <FormCard>
        <NumberInput
          value={hoursSlept}
          onChange={setHoursSlept}
          label="Horas de sono"
          min={0}
          max={24}
          step={0.5}
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
            placeholderTextColor="#6366f1"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="bg-primary-900 border border-indigo-700 text-white rounded-xl p-4"
          />
        </View>
      </FormCard>

      <SubmitButton onPress={handleSubmit} loading={loading} label="Enviar" />
    </ScrollView>
  );
}
