import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomerDashboardScreen from "../screens/customer/CustomerDashboardScreen";
import ProductsScreen from "../screens/customer/ProductsScreen";
import SearchScreen from "../screens/customer/SearchScreen";
import OffersScreen from "../screens/customer/OffersScreen";
import ProfileScreen from "../screens/customer/ProfileScreen";
import colors from "../theme/colors";

const Tab = createBottomTabNavigator();

const iconMap = {
  Home: "home",
  Categories: "grid",
  Search: "search",
  Offers: "pricetags",
  Account: "person",
};

function TabIcon({ label, focused, color }) {
  const scale = useRef(new Animated.Value(focused ? 1.08 : 1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.08 : 1,
      useNativeDriver: true,
      speed: 24,
      bounciness: 6,
    }).start();
  }, [focused, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: focused ? colors.primarySoft : "transparent",
        }}
      >
        <Ionicons name={iconMap[label]} size={18} color={color} />
      </View>
    </Animated.View>
  );
}

function TabLabel({ focused, color, children }) {
  return (
    <Text
      numberOfLines={1}
      style={{
        fontSize: 11,
        fontWeight: focused ? "700" : "600",
        color,
        marginBottom: 2,
      }}
    >
      {children}
    </Text>
  );
}

export default function BottomTabs() {
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
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarLabel: ({ focused, color }) => (
          <TabLabel focused={focused} color={color}>
            {route.name}
          </TabLabel>
        ),
        tabBarIcon: ({ focused, color }) => (
          <TabIcon focused={focused} color={color} label={route.name} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={CustomerDashboardScreen} />
      <Tab.Screen
        name="Categories"
        component={ProductsScreen}
        initialParams={{ screenMode: "categories" }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        initialParams={{ screenMode: "search" }}
      />
      <Tab.Screen name="Offers" component={OffersScreen} />
      <Tab.Screen name="Account" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
