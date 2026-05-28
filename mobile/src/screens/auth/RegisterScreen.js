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
import {
  validateEmail,
  validateMobileNumber,
  validatePincode,
  validateRequired,
} from "../../utils/validators";
import { showToast } from "../../utils/toast";

export default function RegisterScreen({ navigation }) {
  const { register, error: authError } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validateForm() {
    const nextErrors = {};
    if (!validateRequired(form.fullName)) nextErrors.fullName = "Full name is required.";
    if (!form.email && !form.mobileNumber) {
      nextErrors.email = "Email or mobile number is required.";
      nextErrors.mobileNumber = "Email or mobile number is required.";
    }
    if (form.email && !validateEmail(form.email)) nextErrors.email = "Enter a valid email address.";
    if (form.mobileNumber && !validateMobileNumber(form.mobileNumber)) {
      nextErrors.mobileNumber = "Enter a valid mobile number.";
    }
    if (!validateRequired(form.password)) nextErrors.password = "Password is required.";
    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords must match.";
    }
    if (form.pincode && !validatePincode(form.pincode)) {
      nextErrors.pincode = "Enter a valid pincode.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleRegister() {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await register({
        fullName: form.fullName.trim(),
        mobileNumber: form.mobileNumber.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        address: form.address.trim(),
        city: form.city.trim(),
        pincode: form.pincode.trim(),
      });
      showToast("Account created successfully");
      navigation.reset({ index: 0, routes: [{ name: "CustomerTabs" }] });
    } catch {
      // Error surfaced via auth state.
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Register your customer account to save orders and checkout faster.
            </Text>

            <Input
              label="Full Name"
              value={form.fullName}
              onChangeText={(value) => updateField("fullName", value)}
              error={errors.fullName}
              style={styles.gap}
            />
            <Input
              label="Mobile Number"
              value={form.mobileNumber}
              onChangeText={(value) => updateField("mobileNumber", value)}
              keyboardType="phone-pad"
              error={errors.mobileNumber}
              style={styles.gap}
            />
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
            <Input
              label="Confirm Password"
              value={form.confirmPassword}
              onChangeText={(value) => updateField("confirmPassword", value)}
              secureTextEntry={!showConfirmPassword}
              rightIcon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowConfirmPassword((value) => !value)}
              error={errors.confirmPassword}
              style={styles.gap}
            />
            <Input
              label="Address (Optional)"
              value={form.address}
              onChangeText={(value) => updateField("address", value)}
              style={styles.gap}
            />
            <Input
              label="City (Optional)"
              value={form.city}
              onChangeText={(value) => updateField("city", value)}
              style={styles.gap}
            />
            <Input
              label="Pincode (Optional)"
              value={form.pincode}
              onChangeText={(value) => updateField("pincode", value)}
              keyboardType="number-pad"
              error={errors.pincode}
              style={styles.gap}
            />
            {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

            <Button title="Register" onPress={handleRegister} loading={submitting} style={styles.gap} />
            <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
              Already have an account? Sign In
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
    marginTop: spacing.lg,
    color: colors.primaryDeep,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});
