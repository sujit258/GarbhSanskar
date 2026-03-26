import React from "react";
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, ScrollView,
} from "react-native";
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from "../constants/theme";

let activeColors = COLORS;

export function setUIColors(colors) {
  activeColors = colors || COLORS;
}

// ─── Loading Card ───────────────────────────────────────────────────
export function LoadingCard({ message = "माहिती लोड होत आहे..." }) {
  return (
    <View style={[styles.loadingCard, { backgroundColor: activeColors.bgCard, borderColor: activeColors.borderLight }]}>
      <View style={[styles.loadingSpinnerWrap, { backgroundColor: activeColors.bgWarm }]}>
        <ActivityIndicator size="large" color={activeColors.primary} />
      </View>
      <Text style={[styles.loadingText, { color: activeColors.textSecondary }]}>{message}</Text>
    </View>
  );
}

// ─── Section Card ───────────────────────────────────────────────────
export function SectionCard({ children, style }) {
  return <View style={[styles.sectionCard, { backgroundColor: activeColors.bgCard, borderColor: activeColors.borderLight }, style]}>{children}</View>;
}

// ─── Chip / Tag ─────────────────────────────────────────────────────
export function Chip({ label, active, onPress, color }) {
  const bg = active ? (color || activeColors.primary) : activeColors.bgWarm;
  const textColor = active ? activeColors.textWhite : activeColors.textSecondary;
  return (
    <TouchableOpacity style={[styles.chip, { backgroundColor: bg }]} onPress={onPress}>
      <Text style={[styles.chipText, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Info Row ────────────────────────────────────────────────────────
export function InfoRow({ icon, label, value }) {
  return (
    <View style={[styles.infoRow, { borderBottomColor: activeColors.borderLight }]}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: activeColors.textLight }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: activeColors.textPrimary }]}>{value}</Text>
      </View>
    </View>
  );
}

// ─── Bullet List ─────────────────────────────────────────────────────
export function BulletList({ items, color }) {
  return (
    <View>
      {items?.map((item, i) => (
        <View key={i} style={styles.bulletRow}>
          <View style={[styles.bullet, { backgroundColor: color || activeColors.primary }]} />
          <Text style={[styles.bulletText, { color: activeColors.textPrimary }]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Gradient Header ─────────────────────────────────────────────────
export function GradientHeader({ title, subtitle, emoji, color, darkColor }) {
  return (
    <View style={[styles.gradientHeader, { backgroundColor: color || activeColors.primary }]}> 
      <Text style={styles.headerEmoji}>{emoji}</Text>
      <Text style={styles.headerTitle}>{title}</Text>
      {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

// ─── Pill Badge ──────────────────────────────────────────────────────
export function PillBadge({ label, color, textColor }) {
  return (
    <View style={[styles.pillBadge, { backgroundColor: color || activeColors.bgWarm }]}> 
      <Text style={[styles.pillText, { color: textColor || activeColors.textSecondary }]}>{label}</Text>
    </View>
  );
}

// ─── Name Card ───────────────────────────────────────────────────────
export function NameCard({ name, onSave, isSaved }) {
  return (
    <View style={[styles.nameCard, { backgroundColor: activeColors.bgCard, borderColor: activeColors.borderLight }]}> 
      <View style={styles.nameHeader}>
        <View style={styles.nameMain}>
          <Text style={[styles.nameDevanagari, { color: activeColors.textPrimary }]}>{name.name}</Text>
          <Text style={[styles.nameEnglish, { color: activeColors.textLight }]}>{name.english}</Text>
        </View>
        <TouchableOpacity onPress={() => onSave(name)} style={styles.heartBtn}>
          <Text style={styles.heartIcon}>{isSaved ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.nameMeaning, { color: activeColors.textSecondary }]}>अर्थ: {name.meaning}</Text>
      <View style={styles.nameFooter}>
        <PillBadge label={name.origin} color={activeColors.bgTeal} textColor={activeColors.accent} />
        {name.numerology ? (
          <PillBadge label={`अंक ${name.numerology}`} color={activeColors.bgWarm} textColor={activeColors.primaryDark} />
        ) : null}
        {name.gender === "boy" ? (
          <PillBadge label="मुलगा" color="#E3F2FD" textColor="#1565C0" />
        ) : name.gender === "girl" ? (
          <PillBadge label="मुलगी" color="#FCE4EC" textColor="#C2185B" />
        ) : (
          <PillBadge label="उभय" color="#F3E5F5" textColor="#7B1FA2" />
        )}
      </View>
      {name.famous ? (
        <Text style={[styles.nameFamous, { color: activeColors.gold }]}>✨ {name.famous}</Text>
      ) : null}
    </View>
  );
}

// ─── Tab Bar ─────────────────────────────────────────────────────────
export function TabBar({ tabs, activeTab, onTabPress, compact = false }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.tabBar, { backgroundColor: activeColors.bg }]} contentContainerStyle={styles.tabBarContent}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            { backgroundColor: activeColors.bgCard, borderColor: activeColors.borderLight },
            activeTab === tab.id && { backgroundColor: activeColors.primary, borderColor: activeColors.primary },
            compact && styles.tabCompact,
          ]}
          onPress={() => onTabPress(tab.id)}
        >
          <Text style={[styles.tabEmoji, compact && styles.tabEmojiCompact]}>{tab.emoji}</Text>
          {!compact && (
            <Text style={[styles.tabLabel, { color: activeColors.textLight }, activeTab === tab.id && { color: activeColors.textWhite, fontWeight: "700" }]}>
              {tab.label}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ─── Error State ──────────────────────────────────────────────────────
export function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.errorState}>
      <Text style={styles.errorEmoji}>⚠️</Text>
      <Text style={[styles.errorText, { color: activeColors.textSecondary }]}>{message || "काहीतरी चुकले. पुन्हा प्रयत्न करा."}</Text>
      {onRetry && (
        <TouchableOpacity style={[styles.retryBtn, { backgroundColor: activeColors.primary }]} onPress={onRetry}>
          <Text style={styles.retryText}>पुन्हा प्रयत्न करा</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
    gap: SPACING.md,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  loadingSpinnerWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.bgWarm,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.body,
    textAlign: "center",
    lineHeight: 22,
  },
  sectionCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    marginRight: SPACING.xs,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  chipText: { fontSize: FONTS.small, fontWeight: "700" },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoIcon: { fontSize: 20, marginRight: SPACING.md, marginTop: 1 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: FONTS.small, color: COLORS.textLight, marginBottom: 4 },
  infoValue: { fontSize: FONTS.body, color: COLORS.textPrimary, fontWeight: "600", lineHeight: 22 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: SPACING.sm },
  bullet: { width: 7, height: 7, borderRadius: 4, marginTop: 7, marginRight: SPACING.sm },
  bulletText: { flex: 1, fontSize: FONTS.body, color: COLORS.textPrimary, lineHeight: 22 },
  gradientHeader: {
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    alignItems: "center",
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  headerEmoji: { fontSize: 42, marginBottom: SPACING.sm },
  headerTitle: {
    fontSize: FONTS.h2,
    fontWeight: "800",
    color: COLORS.textWhite,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: FONTS.body,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginTop: SPACING.xs,
  },
  pillBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  pillText: { fontSize: FONTS.tiny, fontWeight: "700" },
  nameCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  nameHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: SPACING.sm },
  nameMain: { flex: 1 },
  nameDevanagari: { fontSize: FONTS.h3, fontWeight: "700", color: COLORS.textPrimary, marginBottom: 2 },
  nameEnglish: { fontSize: FONTS.small, color: COLORS.textLight, fontStyle: "italic" },
  heartBtn: { padding: SPACING.xs },
  heartIcon: { fontSize: 22 },
  nameMeaning: { fontSize: FONTS.body, color: COLORS.textSecondary, lineHeight: 22, marginBottom: SPACING.sm },
  nameFooter: { flexDirection: "row", flexWrap: "wrap" },
  nameFamous: { fontSize: FONTS.small, color: COLORS.gold, marginTop: SPACING.xs, fontStyle: "italic" },
  tabBar: {
    backgroundColor: COLORS.bg,
    maxHeight: 58,
  },
  tabBarContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
    minWidth: 46,
    height: 40,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  tabEmoji: { fontSize: 16, marginBottom: 0 },
  tabLabel: {
    fontSize: FONTS.tiny,
    color: COLORS.textLight,
    fontWeight: "700",
    lineHeight: 12,
  },
  tabLabelActive: { color: COLORS.textWhite, fontWeight: "700" },
  tabCompact: {
    minWidth: 52,
    height: 42,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  tabEmojiCompact: {
    fontSize: 17,
    marginBottom: 0,
  },
  errorState: { alignItems: "center", padding: SPACING.xxl },
  errorEmoji: { fontSize: 40, marginBottom: SPACING.md },
  errorText: { fontSize: FONTS.body, color: COLORS.textSecondary, textAlign: "center", marginBottom: SPACING.md, lineHeight: 22 },
  retryBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: RADIUS.full, ...SHADOWS.sm },
  retryText: { color: COLORS.textWhite, fontWeight: "600", fontSize: FONTS.body },
});
