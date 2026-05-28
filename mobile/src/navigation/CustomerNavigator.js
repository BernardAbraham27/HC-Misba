import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from "./BottomTabs";
import SplashScreen from "../screens/customer/SplashScreen";
import ProductDetailsScreen from "../screens/customer/ProductDetailsScreen";
import CartScreen from "../screens/customer/CartScreen";

const Stack = createNativeStackNavigator();

export default function CustomerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabs} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
}
