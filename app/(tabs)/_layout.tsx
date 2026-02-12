import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E8DDD6",
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: "#652D07",
        tabBarInactiveTintColor: "#A09389",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Histórico",
          headerShown: true,
          headerStyle: { backgroundColor: "#F8F2EF" },
          headerTintColor: "#292D32",
          headerShadowVisible: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: "Relatório",
          headerShown: true,
          headerStyle: { backgroundColor: "#F8F2EF" },
          headerTintColor: "#292D32",
          headerShadowVisible: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
