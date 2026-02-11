import React, { useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, Dimensions, FlatList } from "react-native";

const WEEKDAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
const SCREEN_WIDTH = Dimensions.get("window").width;
const WEEKS_BUFFER = 52; // 52 weeks back, current week, and could go forward if needed

interface WeekSelectorProps {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (date: string) => void;
}

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDateStr(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  d.setDate(d.getDate() - ((dayOfWeek + 6) % 7));
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDays(monday: Date): { label: string; day: number; dateStr: string; isToday: boolean; isFuture: boolean }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    d.setHours(0, 0, 0, 0);

    days.push({
      label: WEEKDAY_LABELS[i],
      day: d.getDate(),
      dateStr: formatDateStr(d),
      isToday: d.getTime() === today.getTime(),
      isFuture: d.getTime() > today.getTime(),
    });
  }
  return days;
}

// Generate array of week mondays centered around current week
function generateWeeks(centerMonday: Date, count: number): Date[] {
  const weeks: Date[] = [];
  for (let i = -count; i <= count; i++) {
    const monday = new Date(centerMonday);
    monday.setDate(centerMonday.getDate() + i * 7);
    weeks.push(monday);
  }
  return weeks;
}

interface WeekPageProps {
  monday: Date;
  selectedDate: string;
  onDateChange: (date: string) => void;
  width: number;
}

function WeekPage({ monday, selectedDate, onDateChange, width }: WeekPageProps) {
  const weekDays = getWeekDays(monday);

  return (
    <View style={{ width, paddingHorizontal: 20 }}>
      {/* Weekday labels */}
      <View className="flex-row justify-between mb-2">
        {weekDays.map((d) => (
          <View key={d.dateStr + "-label"} className="flex-1 items-center">
            <Text
              className={`text-caption font-medium ${
                d.isFuture
                  ? "text-text-muted opacity-40"
                  : d.dateStr === selectedDate
                  ? "text-text"
                  : "text-text-muted"
              }`}
            >
              {d.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Day number circles */}
      <View className="flex-row justify-between">
        {weekDays.map((d) => {
          const isSelected = d.dateStr === selectedDate;
          return (
            <View key={d.dateStr} className="flex-1 items-center">
              <TouchableOpacity
                onPress={() => !d.isFuture && onDateChange(d.dateStr)}
                activeOpacity={d.isFuture ? 1 : 0.7}
                disabled={d.isFuture}
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  d.isFuture
                    ? ""
                    : isSelected
                    ? "bg-primary"
                    : d.isToday
                    ? "bg-surface-hover"
                    : ""
                }`}
              >
                <Text
                  className={`text-body font-semibold ${
                    d.isFuture
                      ? "text-text-muted opacity-40"
                      : isSelected
                      ? "text-text-inverse"
                      : "text-text"
                  }`}
                >
                  {d.day}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function WeekSelector({ selectedDate, onDateChange }: WeekSelectorProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentMonday = getMondayOfWeek(today);
  const weeks = generateWeeks(currentMonday, WEEKS_BUFFER);
  const initialIndex = WEEKS_BUFFER; // center index = current week

  const flatListRef = useRef<FlatList>(null);

  const renderItem = useCallback(({ item }: { item: Date }) => (
    <WeekPage
      monday={item}
      selectedDate={selectedDate}
      onDateChange={onDateChange}
      width={SCREEN_WIDTH}
    />
  ), [selectedDate, onDateChange]);

  const keyExtractor = useCallback((item: Date) => formatDateStr(item), []);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  }), []);

  return (
    <View className="mb-6" style={{ marginHorizontal: -20 }}>
      <FlatList
        ref={flatListRef}
        data={weeks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialIndex}
        getItemLayout={getItemLayout}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="start"
      />
    </View>
  );
}
