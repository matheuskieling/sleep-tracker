import React, { useState } from "react";
import { ScrollView, TextInput, View } from "react-native";

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
}

export function NoonForm({ onSubmit }: NoonFormProps) {
  const [morningSleepiness, setMorningSleepiness] = useState<string>("");
  const [sleepinessTime, setSleepinessTime] = useState<string | null>(null);
  const [slept, setSlept] = useState<boolean>(false);
  const [sunlight, setSunlight] = useState<boolean>(false);
  const [breakfast, setBreakfast] = useState<string>("");
  const [coffee, setCoffee] = useState<boolean>(false);
  const [sweets, setSweets] = useState<boolean>(false);
  const [exercise, setExercise] = useState<boolean>(false);
  const [observations, setObservations] = useState<string>("");
  const [focus, setFocus] = useState<string>("");
  const [stress, setStress] = useState<string>("");
  const [anxiety, setAnxiety] = useState<string>("");
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
    <ScrollView
      className="flex-1 bg-primary-950"
      contentContainerClassName="px-4 py-6"
      showsVerticalScrollIndicator={false}
    >
      <FormCard>
        <SectionHeader title="Manhã" icon="☀️" />

        <RadioGroup
          options={sleepinessOptions}
          value={morningSleepiness}
          onChange={setMorningSleepiness}
          label="Tive sono de manhã?"
        />

        {showSleepinessTime && (
          <TimeInput
            value={sleepinessTime}
            onChange={setSleepinessTime}
            label="Horário do sono"
          />
        )}

        <ToggleButton value={slept} onChange={setSlept} label="Dormiu?" />

        <ToggleButton value={sunlight} onChange={setSunlight} label="Luz solar?" />

        <RadioGroup
          options={mealSizeOptions}
          value={breakfast}
          onChange={setBreakfast}
          label="Café da manhã"
        />

        <ToggleButton value={coffee} onChange={setCoffee} label="Café?" />

        <ToggleButton value={sweets} onChange={setSweets} label="Doce?" />

        <ToggleButton value={exercise} onChange={setExercise} label="Exercício?" />

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
    </ScrollView>
  );
}
