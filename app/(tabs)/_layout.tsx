import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#1e1b4b", borderTopColor: "#312e81" },
        tabBarActiveTintColor: "#818cf8",
        tabBarInactiveTintColor: "#a5b4fc80",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="forms"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Histórico",
          headerShown: true,
          headerStyle: { backgroundColor: "#1e1b4b" },
          headerTintColor: "#e0e7ff",
          headerShadowVisible: false,
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>📊</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: "Relatório",
          headerShown: true,
          headerStyle: { backgroundColor: "#1e1b4b" },
          headerTintColor: "#e0e7ff",
          headerShadowVisible: false,
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🤖</Text>
          ),
        }}
      />
    </Tabs>
  );
}
