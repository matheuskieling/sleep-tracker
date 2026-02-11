import { Stack } from "expo-router";

export default function FormLayout() {
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
