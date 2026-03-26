import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from "../constants/theme";

const MONTH_NAMES = [
  "जाने",
  "फेब्रु",
  "मार्च",
  "एप्रि",
  "मे",
  "जून",
  "जुलै",
  "ऑग",
  "सप्टें",
  "ऑक्टो",
  "नोव्हें",
  "डिसें",
];

function startOfDay(date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function clampDate(date, minimumDate, maximumDate) {
  const normalized = startOfDay(date);
  if (minimumDate && normalized < startOfDay(minimumDate)) return startOfDay(minimumDate);
  if (maximumDate && normalized > startOfDay(maximumDate)) return startOfDay(maximumDate);
  return normalized;
}

function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function shiftDatePart(currentDate, part, delta, minimumDate, maximumDate) {
  const nextDate = new Date(currentDate);

  if (part === "day") {
    nextDate.setDate(nextDate.getDate() + delta);
    return clampDate(nextDate, minimumDate, maximumDate);
  }

  if (part === "month") {
    const targetMonth = nextDate.getMonth() + delta;
    const targetYear = nextDate.getFullYear() + Math.floor(targetMonth / 12);
    const normalizedMonth = ((targetMonth % 12) + 12) % 12;
    const maxDay = getDaysInMonth(targetYear, normalizedMonth);
    const safeDay = Math.min(nextDate.getDate(), maxDay);
    return clampDate(new Date(targetYear, normalizedMonth, safeDay), minimumDate, maximumDate);
  }

  const targetYear = nextDate.getFullYear() + delta;
  const maxDay = getDaysInMonth(targetYear, nextDate.getMonth());
  const safeDay = Math.min(nextDate.getDate(), maxDay);
  return clampDate(new Date(targetYear, nextDate.getMonth(), safeDay), minimumDate, maximumDate);
}

function Stepper({ label, value, onMinus, onPlus }) {
  return (
    <View style={styles.stepperCard}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <TouchableOpacity style={styles.stepperButton} onPress={onPlus}>
        <Text style={styles.stepperButtonText}>+</Text>
      </TouchableOpacity>
      <Text style={styles.stepperValue}>{value}</Text>
      <TouchableOpacity style={styles.stepperButton} onPress={onMinus}>
        <Text style={styles.stepperButtonText}>-</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function AppDatePicker({
  open,
  date,
  maximumDate,
  minimumDate,
  onConfirm,
  onCancel,
}) {
  const [selectedDate, setSelectedDate] = useState(clampDate(date || new Date(), minimumDate, maximumDate));

  useEffect(() => {
    setSelectedDate(clampDate(date || new Date(), minimumDate, maximumDate));
  }, [date, maximumDate, minimumDate, open]);

  function updateDate(part, delta) {
    setSelectedDate((current) => shiftDatePart(current, part, delta, minimumDate, maximumDate));
  }

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>तारीख निवडा</Text>
          <Text style={styles.subtitle}>Expo Go साठी हलका, अॅपमध्ये चालणारा दिनांक निवड पर्याय.</Text>

          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>निवडलेली तारीख</Text>
            <Text style={styles.previewValue}>
              {selectedDate.toLocaleDateString("mr-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>

          <View style={styles.stepperRow}>
            <Stepper
              label="दिवस"
              value={String(selectedDate.getDate()).padStart(2, "0")}
              onPlus={() => updateDate("day", 1)}
              onMinus={() => updateDate("day", -1)}
            />
            <Stepper
              label="महिना"
              value={MONTH_NAMES[selectedDate.getMonth()]}
              onPlus={() => updateDate("month", 1)}
              onMinus={() => updateDate("month", -1)}
            />
            <Stepper
              label="वर्ष"
              value={String(selectedDate.getFullYear())}
              onPlus={() => updateDate("year", 1)}
              onMinus={() => updateDate("year", -1)}
            />
          </View>

          <View style={styles.quickRow}>
            <TouchableOpacity style={styles.quickChip} onPress={() => setSelectedDate(clampDate(new Date(), minimumDate, maximumDate))}>
              <Text style={styles.quickChipText}>आज</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickChip}
              onPress={() => setSelectedDate(shiftDatePart(selectedDate, "day", -7, minimumDate, maximumDate))}
            >
              <Text style={styles.quickChipText}>-७ दिवस</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickChip}
              onPress={() => setSelectedDate(shiftDatePart(selectedDate, "month", -1, minimumDate, maximumDate))}
            >
              <Text style={styles.quickChipText}>-१ महिना</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={onCancel}>
              <Text style={styles.secondaryText}>रद्द करा</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={() => onConfirm(selectedDate)}>
              <Text style={styles.primaryText}>निश्चित करा</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(44, 24, 16, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
  },
  dialog: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.md,
  },
  title: {
    fontSize: FONTS.h3,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  previewCard: {
    backgroundColor: COLORS.bgWarm,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  previewLabel: {
    fontSize: FONTS.tiny,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  previewValue: {
    fontSize: FONTS.h4,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  stepperRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  stepperCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  stepperLabel: {
    fontSize: FONTS.tiny,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  stepperButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.bgWarm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  stepperButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: -1,
  },
  stepperValue: {
    fontSize: FONTS.body,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginVertical: 8,
    minHeight: 22,
    textAlign: "center",
  },
  quickRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  quickChip: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.bgTeal,
  },
  quickChipText: {
    fontSize: FONTS.small,
    fontWeight: "600",
    color: COLORS.accent,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
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
