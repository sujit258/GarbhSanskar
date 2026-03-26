import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform,
} from "react-native";
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, TRIMESTER_INFO } from "../constants/theme";

const WEEK_EMOJIS = {
  1:"🌱",2:"🌱",3:"🌿",4:"🫘",5:"🌿",6:"🟢",7:"🫐",8:"🍓",9:"🍇",10:"🍓",
  11:"🫐",12:"🍋",13:"🫛",14:"🍑",15:"🍎",16:"🥭",17:"🍐",18:"🫑",19:"🍅",
  20:"🍌",21:"🥕",22:"🌿",23:"🍊",24:"🌽",25:"🥦",26:"🥒",27:"🥦",
  28:"🍆",29:"🎃",30:"🥒",31:"🥥",32:"🍑",33:"🍍",34:"🍈",35:"🍉",
  36:"🥬",37:"🎃",38:"🍈",39:"🍉",40:"🍉",
};

export default function WeeksScreen({ currentWeek, onSelectWeek, colors = COLORS, isMobileWeb = false }) {
  const isWeb = Platform.OS === "web" && !isMobileWeb;
  const [activeTrimester, setActiveTrimester] = useState(
    currentWeek <= 13 ? 1 : currentWeek <= 27 ? 2 : 3
  );

  const trimesterWeeks = {
    1: Array.from({ length: 13 }, (_, i) => i + 1),
    2: Array.from({ length: 14 }, (_, i) => i + 14),
    3: Array.from({ length: 13 }, (_, i) => i + 28),
  };

  const weeks = trimesterWeeks[activeTrimester];
  const tri = TRIMESTER_INFO[activeTrimester];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}> 
      {/* Trimester Tabs */}
      <View style={[styles.triTabs, { backgroundColor: colors.bg, borderBottomColor: colors.borderLight }, isWeb && styles.triTabsWeb]}>
        {[1, 2, 3].map((t) => {
          const info = TRIMESTER_INFO[t];
          const isActive = activeTrimester === t;
          return (
            <TouchableOpacity
              key={t}
              style={[styles.triTab, isActive && { backgroundColor: info.color, borderColor: info.dark }]}
              onPress={() => setActiveTrimester(t)}
            >
              <Text style={styles.triTabEmoji}>{info.emoji}</Text>
              <Text style={[styles.triTabLabel, { color: colors.textSecondary }, isActive && { color: info.dark, fontWeight: "700" }]}>
                {info.label}
              </Text>
              <Text style={[styles.triTabWeeks, { color: isActive ? info.dark : colors.textLight }]}>
                {info.weeks}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Trimester Info */}
      <View style={[styles.triInfo, { backgroundColor: tri.color }, isWeb && styles.triInfoWeb]}>
        <Text style={[styles.triInfoTitle, { color: tri.dark }]}>{tri.label}</Text>
        <Text style={[styles.triInfoWeeks, { color: tri.dark }]}>आठवडे {tri.weeks}</Text>
      </View>

      {/* Week Grid */}
      <ScrollView contentContainerStyle={[styles.weekGrid, isWeb && styles.weekGridWeb]} showsVerticalScrollIndicator={false}>
        {weeks.map((w) => {
          const isCurrentWeek = w === currentWeek;
          const isPast = w < currentWeek;
          return (
            <TouchableOpacity
              key={w}
              style={[
                styles.weekCell,
                isWeb && styles.weekCellWeb,
                { backgroundColor: colors.bgCard, borderColor: colors.borderLight },
                isCurrentWeek && { backgroundColor: tri.dark, ...SHADOWS.md },
                isPast && !isCurrentWeek && { backgroundColor: tri.color, opacity: 0.8 },
              ]}
              onPress={() => onSelectWeek(w)}
            >
              {isCurrentWeek && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>●</Text>
                </View>
              )}
              <Text style={styles.weekEmoji}>{WEEK_EMOJIS[w] || "🌿"}</Text>
              <Text style={[styles.weekNum, { color: colors.textPrimary }, isCurrentWeek && styles.weekNumCurrent]}>
                {w}
              </Text>
              <Text style={[styles.weekLabel, { color: colors.textLight }, isCurrentWeek && styles.weekLabelCurrent]}>
                आठवडा
              </Text>
              {isPast && !isCurrentWeek && (
                <View style={styles.checkMark}>
                  <Text style={{ fontSize: 10, color: tri.dark }}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  triTabs: {
    flexDirection: "row",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  triTabsWeb: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  triTab: {
    flex: 1, alignItems: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5, borderColor: COLORS.borderLight,
    backgroundColor: COLORS.bgCard,
    ...SHADOWS.sm,
  },
  triTabEmoji: { fontSize: 22, marginBottom: 4 },
  triTabLabel: { fontSize: FONTS.small, color: COLORS.textSecondary, textAlign: "center", fontWeight: "700" },
  triTabWeeks: { fontSize: FONTS.tiny, marginTop: 3, textAlign: "center" },
  triInfo: {
    flexDirection: "row", justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    ...SHADOWS.sm,
  },
  triInfoWeb: {
    marginHorizontal: SPACING.lg,
  },
  triInfoTitle: { fontSize: FONTS.h4, fontWeight: "700" },
  triInfoWeeks: { fontSize: FONTS.body },
  weekGrid: {
    flexDirection: "row", flexWrap: "wrap",
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  weekGridWeb: {
    paddingHorizontal: SPACING.lg,
    maxWidth: 1100,
    alignSelf: "center",
    width: "100%",
    gap: SPACING.md,
  },
  weekCell: {
    width: "23%",
    aspectRatio: 0.92,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    position: "relative",
    ...SHADOWS.sm,
  },
  weekCellWeb: {
    width: "15.8%",
    minHeight: 108,
  },
  currentBadge: {
    position: "absolute", top: 4, right: 4,
  },
  currentBadgeText: { fontSize: 8, color: COLORS.goldLight },
  weekEmoji: { fontSize: 24, marginBottom: 4 },
  weekNum: { fontSize: FONTS.h4, fontWeight: "700", color: COLORS.textPrimary },
  weekNumCurrent: { color: COLORS.textWhite },
  weekLabel: { fontSize: FONTS.tiny, color: COLORS.textLight },
  weekLabelCurrent: { color: "rgba(255,255,255,0.8)" },
  checkMark: {
    position: "absolute", bottom: 4, right: 4,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center", justifyContent: "center",
  },
});
