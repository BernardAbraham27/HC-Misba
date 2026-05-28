import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import { useAuth } from "../../context/AuthContext";

const logo = require("../../../assets/images/brands/mispa-logo.png");

export default function AuthChoiceScreen({ navigation }) {
  const { continueAsGuest } = useAuth();
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslate, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardOpacity, cardTranslate]);

  async function handleGuest() {
    await continueAsGuest();
    navigation.replace("CustomerTabs");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardOpacity,
              transform: [{ translateY: cardTranslate }],
            },
          ]}
        >
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Welcome to God Grace Home Products</Text>
          <Text style={styles.subtitle}>
            Shop trusted cleaning products for home and business.
          </Text>

          <Button title="Sign In" onPress={() => navigation.navigate("Login")} style={styles.gap} />
          <Button
            title="Create Account"
            onPress={() => navigation.navigate("Register")}
            variant="secondary"
            style={styles.gap}
          />
          <Button title="Continue as Guest" onPress={handleGuest} variant="ghost" style={styles.gap} />
          <Text style={styles.adminLink} onPress={() => navigation.navigate("AdminLogin")}>
            Admin Login
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  logo: {
    width: 140,
    height: 72,
    alignSelf: "center",
  },
  title: {
    marginTop: spacing.lg,
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  gap: {
    marginTop: spacing.md,
  },
  adminLink: {
    marginTop: spacing.lg,
    color: colors.primaryDeep,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});
