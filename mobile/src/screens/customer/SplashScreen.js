import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../theme/colors";

const splashBackground = require("../../../assets/images/banners/splash-bg.png");
const logo = require("../../../assets/images/brands/mispa-logo.png");
const heroProduct = require("../../../assets/images/products/transparent/mispa-fabric-conditioner-blue.png");

export default function SplashScreen({ navigation }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const productTranslate = useRef(new Animated.Value(18)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(productTranslate, {
          toValue: 0,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [buttonOpacity, logoOpacity, productTranslate]);

  return (
    <ImageBackground source={splashBackground} resizeMode="cover" style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.logoWrap, { opacity: logoOpacity }]}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>God Grace Home Products</Text>
          <Text style={styles.subtitle}>Premium cleaning products for home and business</Text>
        </Animated.View>

        <Animated.View style={[styles.heroCard, { transform: [{ translateY: productTranslate }] }]}>
          <View style={styles.heroAccent} />
          <Image source={heroProduct} style={styles.heroImage} resizeMode="contain" />
          <Text style={styles.heroLabel}>MISPA Home Care</Text>
          <Text style={styles.heroCopy}>
            Trusted fabric, floor, washroom, and kitchen cleaning essentials in one catalog.
          </Text>
        </Animated.View>

        <Animated.View style={{ opacity: buttonOpacity }}>
          <Pressable style={styles.button} onPress={() => navigation.replace("AuthChoice")}>
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
    justifyContent: "space-between",
  },
  logoWrap: {
    alignItems: "center",
    marginTop: 10,
  },
  logo: {
    width: 180,
    height: 92,
    marginBottom: 10,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  heroCard: {
    position: "relative",
    marginHorizontal: 4,
    borderRadius: 34,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 22,
    paddingVertical: 24,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 16 },
    elevation: 7,
    alignItems: "center",
  },
  heroAccent: {
    position: "absolute",
    top: 22,
    right: 24,
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#e3f3ff",
  },
  heroImage: {
    width: 220,
    height: 280,
    marginBottom: 12,
  },
  heroLabel: {
    color: colors.primaryDeep,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heroCopy: {
    marginTop: 8,
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "800",
  },
});
