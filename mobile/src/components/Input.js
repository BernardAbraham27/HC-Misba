import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors";
import spacing from "../theme/spacing";

export default function Input({
  label,
  error,
  style,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  ...props
}) {
  return (
    <View style={style}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputWrap, error ? styles.inputError : null]}>
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          secureTextEntry={secureTextEntry}
          {...props}
        />
        {rightIcon ? (
          <Pressable onPress={onRightIconPress} hitSlop={10} style={styles.iconButton}>
            <Ionicons name={rightIcon} size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    color: colors.navy,
    marginBottom: 8,
    fontWeight: "600",
  },
  inputWrap: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingRight: spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: 15,
  },
  inputError: {
    borderColor: colors.danger,
  },
  iconButton: {
    paddingLeft: spacing.sm,
  },
  error: {
    color: colors.danger,
    marginTop: 6,
    fontSize: 12,
  },
});
