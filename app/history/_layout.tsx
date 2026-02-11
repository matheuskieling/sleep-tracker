import { Stack } from "expo-router";

export default function HistoryLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#F8F2EF" },
        headerTintColor: "#292D32",
        headerShadowVisible: false,
      }}
    />
  );
}
