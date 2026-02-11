import { Stack } from "expo-router";

export default function ReportLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0f172a" },
        headerTintColor: "#f1f5f9",
        headerShadowVisible: false,
      }}
    />
  );
}
