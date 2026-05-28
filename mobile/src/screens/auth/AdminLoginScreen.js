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
import { validateEmail, validateRequired } from "../../utils/validators";
import { showToast } from "../../utils/toast";

export default function AdminLoginScreen({ navigation }) {
  const { adminLogin, error: authError } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validateForm() {
    const nextErrors = {};
    if (!validateEmail(form.email)) nextErrors.email = "Enter a valid email address.";
    if (!validateRequired(form.password)) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await adminLogin(form.email.trim(), form.password);
      showToast("Admin login successful");
      navigation.reset({ index: 0, routes: [{ name: "AdminTabs" }] });
    } catch {
      // Error exposed via auth state.
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
            <Text style={styles.title}>Admin Login</Text>
            <Text style={styles.subtitle}>Sign in with your admin credentials.</Text>

            <Input
              label="Email"
              value={form.email}
              onChangeText={(value) => updateField("email", value)}
              autoCapitalize="none"
              keyboardType="email-address"
              error={errors.email}
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

            <Button
              title="Admin Sign In"
              onPress={handleSubmit}
              loading={submitting}
              style={styles.gap}
            />
            <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
              Back to Customer Login
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
    marginTop: spacing.lg,
    color: colors.primaryDeep,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});
