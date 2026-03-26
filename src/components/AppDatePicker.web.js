import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from "../constants/theme";

function formatInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseInputDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export default function AppDatePicker({
  open,
  date,
  maximumDate,
  minimumDate,
  onConfirm,
  onCancel,
}) {
  const [selectedValue, setSelectedValue] = useState(formatInputDate(date || new Date()));

  useEffect(() => {
    setSelectedValue(formatInputDate(date || new Date()));
  }, [date, open]);

  if (!open) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        <Text style={styles.title}>तारीख निवडा</Text>
        <Text style={styles.subtitle}>वेबवर साधा दिनांक निवडणारा पर्याय वापरला आहे.</Text>
        <input
          type="date"
          value={selectedValue}
          max={maximumDate ? formatInputDate(maximumDate) : undefined}
          min={minimumDate ? formatInputDate(minimumDate) : undefined}
          onChange={(event) => setSelectedValue(event.target.value)}
          style={styles.input}
        />
        <View style={styles.actions}>
          <TouchableOpacity style={styles.secondaryButton} onPress={onCancel}>
            <Text style={styles.secondaryText}>रद्द करा</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              const parsedDate = parseInputDate(selectedValue);
              if (parsedDate) onConfirm(parsedDate);
            }}
          >
            <Text style={styles.primaryText}>निश्चित करा</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(44, 24, 16, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
    zIndex: 1000,
  },
  dialog: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.md,
  },
  title: {
    fontSize: FONTS.h3,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    fontSize: "16px",
    color: COLORS.textPrimary,
    backgroundColor: COLORS.bg,
    outline: "none",
    boxSizing: "border-box",
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.md,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  secondaryText: {
    fontSize: FONTS.body,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  primaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  primaryText: {
    fontSize: FONTS.body,
    fontWeight: "700",
    color: COLORS.textWhite,
  },
});
