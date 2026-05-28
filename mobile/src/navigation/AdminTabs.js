import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AdminPlaceholderScreen from "../screens/admin/AdminPlaceholderScreen";
import colors from "../theme/colors";

const Tab = createBottomTabNavigator();

const tabs = [
  { name: "Dashboard", icon: "speedometer" },
  { name: "Products", icon: "cube" },
  { name: "Customers", icon: "people" },
  { name: "Orders", icon: "receipt" },
  { name: "Settings", icon: "settings" },
];

export default function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDeep,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          height: 76,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: colors.white,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarIcon: ({ color, size }) => {
          const match = tabs.find((item) => item.name === route.name);
          return <Ionicons name={match?.icon || "ellipse"} size={size} color={color} />;
        },
      })}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={AdminPlaceholderScreen}
          initialParams={{ title: tab.name }}
        />
      ))}
    </Tab.Navigator>
  );
}
