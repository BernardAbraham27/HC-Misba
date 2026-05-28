import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useAuth } from "../../context/AuthContext";
import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import { validateRequired } from "../../utils/validators";
import { showToast } from "../../utils/toast";

export default function LoginScreen({ navigation, route }) {
  const { login, error: authError } = useAuth();
  const [form, setForm] = useState({ emailOrMobile: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const redirectTo = route.params?.redirectTo;

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validateForm() {
    const nextErrors = {};
    if (!validateRequired(form.emailOrMobile)) {
      nextErrors.emailOrMobile = "Email or mobile number is required.";
    }
    if (!validateRequired(form.password)) {
      nextErrors.password = "Password is required.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleLogin() {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await login(form.emailOrMobile.trim(), form.password);
      showToast("Login successful");
      if (redirectTo) {
        navigation.replace(redirectTo);
      } else {
        navigation.reset({ index: 0, routes: [{ name: "CustomerTabs" }] });
      }
    } catch {
      // Error is already exposed via auth store.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>Customer Sign In</Text>
            <Text style={styles.subtitle}>Use your email or mobile number to continue.</Text>

            <Input
              label="Email or Mobile Number"
              value={form.emailOrMobile}
              onChangeText={(value) => updateField("emailOrMobile", value)}
              autoCapitalize="none"
              error={errors.emailOrMobile}
              style={styles.gap}
            />
            <Input
              label="Password"
              value={form.password}
              onChangeText={(value) => updateField("password", value)}
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowPassword((value) => !value)}
              error={errors.password}
              style={styles.gap}
            />
            {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

            <Button title="Sign In" onPress={handleLogin} loading={submitting} style={styles.gap} />
            <Button
              title="Create Account"
              onPress={() => navigation.navigate("Register", route.params || {})}
              variant="secondary"
              style={styles.gap}
            />
            <Text style={styles.link} onPress={() => navigation.navigate("ForgotPassword")}>
              Forgot Password
            </Text>
            <Text style={styles.link} onPress={() => navigation.navigate("AdminLogin")}>
              Admin Login
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  gap: {
    marginTop: spacing.md,
  },
  errorText: {
    marginTop: spacing.md,
    color: colors.danger,
    fontSize: 13,
  },
  link: {
    marginTop: spacing.md,
    color: colors.primaryDeep,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});
