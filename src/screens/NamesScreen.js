import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Alert,
} from "react-native";
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, RASHIS, NAKSHATRAS, MARATHI_ALPHABET } from "../constants/theme";
import { fetchBabyNames, browseBabyNames } from "../services/claudeApi";
import { LoadingCard, NameCard, Chip, ErrorState, SectionCard } from "../components/UIComponents";

const MODES = [
  { id: "rashi", label: "राशी / नक्षत्र", emoji: "⭐" },
  { id: "browse", label: "अक्षरावरून", emoji: "🔤" },
  { id: "saved", label: "जतन केलेली", emoji: "❤️" },
];

export default function NamesScreen({ savedNames, toggleSaveName, isNameSaved, babyGender, colors = COLORS }) {
  const [mode, setMode] = useState("rashi");
  const [selectedRashi, setSelectedRashi] = useState(null);
  const [selectedNakshatra, setSelectedNakshatra] = useState(null);
  const [selectedGender, setSelectedGender] = useState(babyGender === "unknown" ? "all" : babyGender);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [selectedOrigin, setSelectedOrigin] = useState("संस्कृत");
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleRashiSearch() {
    if (!selectedRashi || !selectedNakshatra) {
      Alert.alert("आवश्यक माहिती", "कृपया राशी आणि नक्षत्र निवडा.");
      return;
    }
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const result = await fetchBabyNames(selectedRashi, selectedNakshatra, selectedGender === "all" ? "both" : selectedGender);
      setNames(result.names || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleBrowse() {
    if (!selectedLetter) {
      Alert.alert("अक्षर निवडा", "कृपया एक अक्षर निवडा.");
      return;
    }
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const result = await browseBabyNames(selectedLetter, selectedGender === "all" ? "both" : selectedGender, selectedOrigin);
      setNames(result.names || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}> 
      <View style={[styles.heroWrap, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }]}> 
        <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>नाव सुचवणी</Text>
        <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>राशी, नक्षत्र किंवा अक्षरावरून सुंदर नाव निवडा</Text>
      </View>

      {/* Mode Tabs */}
      <View style={[styles.modeTabs, { backgroundColor: colors.bg }]}> 
        {MODES.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[styles.modeTab, { backgroundColor: colors.bgCard, borderColor: colors.borderLight }, mode === m.id && { backgroundColor: colors.bgWarm, borderColor: colors.primary }]}
            onPress={() => { setMode(m.id); setNames([]); setHasSearched(false); }}
          >
            <Text style={styles.modeEmoji}>{m.emoji}</Text>
            <Text style={[styles.modeLabel, { color: colors.textSecondary }, mode === m.id && { color: colors.primary }]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ─── Rashi / Nakshatra Mode ─── */}
        {mode === "rashi" && (
          <View style={styles.filterSection}>
            <SectionCard>
              <Text style={[styles.filterTitle, { color: colors.textPrimary }]}>🔮 राशी निवडा</Text>
              <View style={styles.chipWrap}>
                {RASHIS.map((r) => (
                  <Chip key={r} label={r} active={selectedRashi === r} onPress={() => setSelectedRashi(r)} />
                ))}
              </View>
            </SectionCard>

            <SectionCard>
              <Text style={[styles.filterTitle, { color: colors.textPrimary }]}>⭐ नक्षत्र निवडा</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chipWrap}>
                  {NAKSHATRAS.map((n) => (
                    <Chip key={n} label={n} active={selectedNakshatra === n} onPress={() => setSelectedNakshatra(n)} />
                  ))}
                </View>
              </ScrollView>
            </SectionCard>

            <SectionCard>
              <Text style={[styles.filterTitle, { color: colors.textPrimary }]}>👶 बाळाचे लिंग</Text>
              <View style={styles.genderRow}>
                {[{ v: "boy", l: "👦 मुलगा" }, { v: "girl", l: "👧 मुलगी" }, { v: "all", l: "🤍 दोन्ही" }].map(({ v, l }) => (
                  <TouchableOpacity
                    key={v}
                    style={[styles.genderPill, selectedGender === v && styles.genderPillActive]}
                    onPress={() => setSelectedGender(v)}
                  >
                    <Text style={[styles.genderPillText, { color: colors.textSecondary }, selectedGender === v && { color: colors.primary, fontWeight: "700" }]}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </SectionCard>

            <TouchableOpacity style={[styles.searchBtn, { backgroundColor: colors.primary }]} onPress={handleRashiSearch}>
              <Text style={styles.searchBtnText}>✨ नावे शोधा</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ─── Browse by Letter Mode ─── */}
        {mode === "browse" && (
          <View style={styles.filterSection}>
            <SectionCard>
              <Text style={[styles.filterTitle, { color: colors.textPrimary }]}>🔤 अक्षर निवडा</Text>
              <View style={styles.alphabetGrid}>
                {MARATHI_ALPHABET.map((l) => (
                  <TouchableOpacity
                    key={l}
                    style={[styles.letterCell, selectedLetter === l && styles.letterCellActive]}
                    onPress={() => setSelectedLetter(l)}
                  >
                    <Text style={[styles.letterText, { color: colors.textPrimary }, selectedLetter === l && styles.letterTextActive]}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </SectionCard>

            <SectionCard>
              <Text style={[styles.filterTitle, { color: colors.textPrimary }]}>📚 मूळ</Text>
              <View style={styles.chipWrap}>
                {["संस्कृत", "मराठी", "दोन्ही"].map((o) => (
                  <Chip key={o} label={o} active={selectedOrigin === o} onPress={() => setSelectedOrigin(o)} color={COLORS.accent} />
                ))}
              </View>
            </SectionCard>

            <SectionCard>
              <Text style={[styles.filterTitle, { color: colors.textPrimary }]}>👶 बाळाचे लिंग</Text>
              <View style={styles.genderRow}>
                {[{ v: "boy", l: "👦 मुलगा" }, { v: "girl", l: "👧 मुलगी" }, { v: "all", l: "🤍 दोन्ही" }].map(({ v, l }) => (
                  <TouchableOpacity
                    key={v}
                    style={[styles.genderPill, selectedGender === v && styles.genderPillActive]}
                    onPress={() => setSelectedGender(v)}
                  >
                    <Text style={[styles.genderPillText, { color: colors.textSecondary }, selectedGender === v && { color: colors.primary, fontWeight: "700" }]}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </SectionCard>

            <TouchableOpacity style={[styles.searchBtn, { backgroundColor: colors.accent }]} onPress={handleBrowse}>
              <Text style={styles.searchBtnText}>🔍 नावे पहा</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ─── Saved Names Mode ─── */}
        {mode === "saved" && (
          <View style={styles.filterSection}>
            {savedNames.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🤍</Text>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>अजून कोणतेही नाव जतन केलेले नाही.</Text>
                <Text style={[styles.emptyHint, { color: colors.textLight }]}>नावांवरील ❤️ दाबून जतन करा.</Text>
              </View>
            ) : (
              <>
                <Text style={[styles.savedCount, { color: colors.primary }]}>{savedNames.length} नावे जतन केली</Text>
                {savedNames.map((name, i) => (
                  <NameCard key={i} name={name} onSave={toggleSaveName} isSaved={true} />
                ))}
              </>
            )}
          </View>
        )}

        {/* ─── Results ─── */}
        {(mode === "rashi" || mode === "browse") && (
          <View style={styles.resultsSection}>
            {loading && <LoadingCard message="नावे शोधत आहे..." />}
            {error && !loading && <ErrorState message={error} onRetry={mode === "rashi" ? handleRashiSearch : handleBrowse} />}
            {!loading && !error && hasSearched && names.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🔍</Text>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>कोणतेही नाव सापडले नाही. पुन्हा प्रयत्न करा.</Text>
              </View>
            )}
            {!loading && names.length > 0 && (
              <>
                <Text style={[styles.resultsCount, { color: colors.primary }]}>✨ {names.length} नावे सापडली</Text>
                {names.map((name, i) => (
                  <NameCard key={i} name={name} onSave={toggleSaveName} isSaved={isNameSaved(name.name)} />
                ))}
              </>
            )}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  heroWrap: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.sm,
  },
  heroTitle: {
    fontSize: FONTS.h3,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  heroSubtitle: {
    marginTop: 4,
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  modeTabs: {
    flexDirection: "row",
    backgroundColor: COLORS.bg,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  modeTab: {
    flex: 1, alignItems: "center",
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.bgCard,
    ...SHADOWS.sm,
  },
  modeTabActive: { backgroundColor: COLORS.bgWarm, borderColor: COLORS.primary, transform: [{ translateY: -1 }] },
  modeEmoji: { fontSize: 22, marginBottom: 4 },
  modeLabel: { fontSize: FONTS.small, color: COLORS.textSecondary, textAlign: "center", fontWeight: "700" },
  modeLabelActive: { color: COLORS.primary, fontWeight: "700" },
  filterSection: { padding: SPACING.md, paddingTop: SPACING.sm },
  filterTitle: { fontSize: FONTS.h4, fontWeight: "800", color: COLORS.textPrimary, marginBottom: SPACING.sm },
  chipWrap: { flexDirection: "row", flexWrap: "wrap" },
  genderRow: { flexDirection: "row", gap: SPACING.sm },
  genderPill: {
    flex: 1, alignItems: "center", paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full, borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.bgCard,
  },
  genderPillActive: { backgroundColor: COLORS.bgWarm, borderColor: COLORS.primary, ...SHADOWS.sm },
  genderPillText: { fontSize: FONTS.small, color: COLORS.textSecondary, fontWeight: "600" },
  genderPillTextActive: { color: COLORS.primary, fontWeight: "700" },
  searchBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    ...SHADOWS.md,
  },
  searchBtnText: { color: COLORS.textWhite, fontSize: FONTS.h4, fontWeight: "800" },
  alphabetGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: SPACING.xs,
  },
  letterCell: {
    width: 42, height: 42,
    alignItems: "center", justifyContent: "center",
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  letterCellActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primaryDark, ...SHADOWS.sm },
  letterText: { fontSize: FONTS.body, color: COLORS.textPrimary, fontWeight: "600" },
  letterTextActive: { color: COLORS.textWhite },
  resultsSection: { paddingHorizontal: SPACING.md, paddingTop: SPACING.xs },
  resultsCount: { fontSize: FONTS.h4, fontWeight: "800", color: COLORS.primary, marginBottom: SPACING.md },
  emptyState: { alignItems: "center", padding: SPACING.xxl },
  emptyEmoji: { fontSize: 52, marginBottom: SPACING.md },
  emptyText: { fontSize: FONTS.body, color: COLORS.textSecondary, textAlign: "center", lineHeight: 22 },
  emptyHint: { fontSize: FONTS.small, color: COLORS.textLight, marginTop: SPACING.sm, textAlign: "center" },
  savedCount: { fontSize: FONTS.h4, fontWeight: "800", color: COLORS.primary, padding: SPACING.md },
});
