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
import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import { validateRequired } from "../../utils/validators";
import { showToast } from "../../utils/toast";

export default function ForgotPasswordScreen({ navigation }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!validateRequired(value)) {
      setError("Email or mobile number is required.");
      return;
    }

    setError("");
    showToast("Reset request sent");
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>Enter your email or mobile number to continue.</Text>

            <Input
              label="Email or Mobile Number"
              value={value}
              onChangeText={setValue}
              error={error}
              style={styles.gap}
            />
            <Button title="Send OTP / Reset" onPress={handleSubmit} style={styles.gap} />
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
});
