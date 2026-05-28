import React from "react";
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import Button from "../../components/Button";
import colors from "../../theme/colors";
import spacing from "../../theme/spacing";

const contact = {
  phone: "+91 98765 43210",
  email: "hello@godgracehomeproducts.com",
  whatsapp:
    "https://wa.me/919876543210?text=Hello%20God%20Grace%20Home%20Products%2C%20I%20would%20like%20to%20enquire%20about%20your%20products.",
  address: "God Grace Home Products, Your City, Your State, India",
};

export default function ContactScreen() {
  async function openWhatsApp() {
    const canOpen = await Linking.canOpenURL(contact.whatsapp);
    if (!canOpen) {
      Alert.alert("WhatsApp", "WhatsApp is not available on this device.");
      return;
    }
    Linking.openURL(contact.whatsapp);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <AppHeader title="Contact" subtitle="We are here to help" showBack />
      <View style={styles.card}>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{contact.phone}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{contact.email}</Text>

        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>{contact.address}</Text>

        <Button title="Open WhatsApp" onPress={openWhatsApp} style={styles.buttonGap} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 28,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: spacing.md,
  },
  value: {
    color: colors.navy,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6,
    lineHeight: 24,
  },
  buttonGap: {
    marginTop: spacing.xl,
  },
});
