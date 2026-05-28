import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import SplashScreen from "../screens/customer/SplashScreen";
import AuthChoiceScreen from "../screens/auth/AuthChoiceScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import AdminLoginScreen from "../screens/auth/AdminLoginScreen";
import BottomTabs from "./BottomTabs";
import AdminTabs from "./AdminTabs";
import ProductDetailsScreen from "../screens/customer/ProductDetailsScreen";
import CartScreen from "../screens/customer/CartScreen";
import CheckoutScreen from "../screens/customer/CheckoutScreen";
import MyOrdersScreen from "../screens/customer/MyOrdersScreen";
import OrderDetailsScreen from "../screens/customer/OrderDetailsScreen";
import OrderSuccessScreen from "../screens/customer/OrderSuccessScreen";
import TrackOrderScreen from "../screens/customer/TrackOrderScreen";
import colors from "../theme/colors";

const Stack = createNativeStackNavigator();

function LaunchingScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: "800" }}>
        Loading...
      </Text>
    </View>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isAdmin, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <LaunchingScreen />;
  }

  const initialRouteName = isAuthenticated
    ? isAdmin
      ? "AdminTabs"
      : "CustomerTabs"
    : "Splash";

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="AuthChoice" component={AuthChoiceScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="CustomerTabs" component={BottomTabs} />
        <Stack.Screen name="AdminTabs" component={AdminTabs} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
