import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from "../constants/theme";

export default function LoginScreen({ onGoogleSignIn, colors = COLORS, errorText = "", isBusy = false }) {
  const [localError, setLocalError] = useState("");
  const isWeb = Platform.OS === "web";

  async function handleLogin() {
    setLocalError("");
    try {
      await onGoogleSignIn?.();
    } catch (error) {
      setLocalError(error?.message || "Google sign-in failed");
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }]}> 
        <Text style={styles.logo}>🕉️</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>गर्भसंस्कार</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Google ने लॉगिन करा आणि तुमचा डेटा सर्व डिव्हाइसमध्ये सुरक्षित ठेवा.</Text>

        <TouchableOpacity
          style={[styles.googleBtn, { backgroundColor: colors.primary }, isBusy && styles.googleBtnDisabled]}
          onPress={handleLogin}
          disabled={isBusy}
        >
          <Text style={styles.googleBtnText}>{isBusy ? "कृपया थांबा..." : "Google ने सुरू करा"}</Text>
        </TouchableOpacity>

        {!isWeb && (
          <Text style={[styles.note, { color: colors.textSecondary }]}>टीप: या रिलीझमध्ये Google sign-in वेबवर सक्रिय आहे.</Text>
        )}

        {!!(errorText || localError) && (
          <Text style={styles.errorText}>{errorText || localError}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
  },
  card: {
    width: "100%",
    maxWidth: 460,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.xl,
    ...SHADOWS.md,
  },
  logo: {
    fontSize: 56,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONTS.h1,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    marginTop: SPACING.sm,
    fontSize: FONTS.body,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  googleBtn: {
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.md,
    alignItems: "center",
    ...SHADOWS.sm,
  },
  googleBtnDisabled: {
    opacity: 0.7,
  },
  googleBtnText: {
    color: COLORS.textWhite,
    fontSize: FONTS.body,
    fontWeight: "800",
  },
  note: {
    marginTop: SPACING.md,
    fontSize: FONTS.small,
    textAlign: "center",
  },
  errorText: {
    marginTop: SPACING.md,
    color: COLORS.error,
    fontSize: FONTS.small,
    textAlign: "center",
    fontWeight: "700",
  },
});
