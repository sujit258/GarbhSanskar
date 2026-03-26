import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, getColors, COLORS_DARK } from "./src/constants/theme";
import { setUIColors } from "./src/components/UIComponents";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import HomeScreen from "./src/screens/HomeScreen";
import WeeksScreen from "./src/screens/WeeksScreen";
import WeekDetailScreen from "./src/screens/WeekDetailScreen";
import NamesScreen from "./src/screens/NamesScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

const STORAGE_KEY = "garbh_user_profile";
const SAVED_NAMES_KEY = "garbh_saved_names";
const DARK_MODE_KEY = "garbh_dark_mode";
const IS_WEB = Platform.OS === "web";

const NAV_TABS = [
  { id: "home", emoji: "🏠", label: "मुख्यपान", hint: "आजचा प्रवास" },
  { id: "weeks", emoji: "📅", label: "आठवडे", hint: "संपूर्ण टाइमलाइन" },
  { id: "names", emoji: "👶", label: "नावे", hint: "नाव सुचवणी" },
  { id: "profile", emoji: "👩", label: "प्रोफाइल", hint: "तुमची माहिती" },
];

export default function App() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [navigationStack, setNavigationStack] = useState([]);
  const [savedNames, setSavedNames] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const currentColors = isDarkMode ? COLORS_DARK : COLORS;
  setUIColors(currentColors);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [profileData, namesData, darkModeData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(SAVED_NAMES_KEY),
        AsyncStorage.getItem(DARK_MODE_KEY),
      ]);
      if (profileData) {
        const parsedProfile = JSON.parse(profileData);
        if (parsedProfile.lmpDate) {
          const diffMs = new Date() - new Date(parsedProfile.lmpDate);
          parsedProfile.currentWeek = Math.max(
            1,
            Math.min(40, Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7)) + 1)
          );
        }
        setProfile(parsedProfile);
      }
      if (namesData) setSavedNames(JSON.parse(namesData));
      if (darkModeData) setIsDarkMode(JSON.parse(darkModeData));
    } catch (e) {
      console.error("Load error", e);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveProfile(newProfile) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (e) {
      console.error("Save error", e);
    }
  }

  async function toggleSaveName(nameObj) {
    try {
      const exists = savedNames.find((item) => item.name === nameObj.name);
      const updated = exists
        ? savedNames.filter((item) => item.name !== nameObj.name)
        : [...savedNames, nameObj];
      await AsyncStorage.setItem(SAVED_NAMES_KEY, JSON.stringify(updated));
      setSavedNames(updated);
    } catch (e) {
      console.error("Save name error", e);
    }
  }

  function isNameSaved(name) {
    return savedNames.some((item) => item.name === name);
  }

  async function toggleDarkMode() {
    try {
      const newDarkMode = !isDarkMode;
      setIsDarkMode(newDarkMode);
      await AsyncStorage.setItem(DARK_MODE_KEY, JSON.stringify(newDarkMode));
    } catch (e) {
      console.error("Dark mode toggle error", e);
    }
  }

  function navigate(screen, params = {}) {
    setNavigationStack((prev) => [...prev, { screen, params }]);
  }

  function goBack() {
    setNavigationStack((prev) => prev.slice(0, -1));
  }

  function handleTabPress(tabId) {
    setActiveTab(tabId);
    if (IS_WEB) setNavigationStack([]);
  }

  function renderMainScreen() {
    if (activeTab === "home") {
      return <HomeScreen profile={profile} onNavigate={navigate} colors={currentColors} />;
    }

    if (activeTab === "weeks") {
      return (
        <WeeksScreen
          currentWeek={profile.currentWeek}
          colors={currentColors}
          onSelectWeek={(week) => navigate("weekDetail", { week })}
        />
      );
    }

    if (activeTab === "names") {
      return (
        <NamesScreen
          savedNames={savedNames}
          toggleSaveName={toggleSaveName}
          isNameSaved={isNameSaved}
          babyGender={profile.babyGender}
          colors={currentColors}
        />
      );
    }

    return (
      <ProfileScreen
        profile={profile}
        onUpdateProfile={saveProfile}
        savedNames={savedNames}
        colors={currentColors}
      />
    );
  }

  function renderDetailScreen(stackEntry) {
    if (stackEntry?.screen === "weekDetail") {
      return (
        <WeekDetailScreen
          week={stackEntry.params.week}
          initialTab={stackEntry.params.tab || "baby"}
          colors={currentColors}
          isDarkMode={isDarkMode}
        />
      );
    }
    return null;
  }

  if (isLoading) {
    return (
      <View style={styles.splashScreen}>
        <Text style={styles.splashEmoji}>🕉️</Text>
        <Text style={styles.splashTitle}>गर्भसंस्कार</Text>
        <Text style={styles.splashSubtitle}>लोड होत आहे...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
        {IS_WEB ? (
          <View style={styles.webOnboardingRoot}>
            <View style={styles.webOnboardingHero}>
              <Text style={styles.webOnboardingIcon}>🕉️</Text>
              <Text style={styles.webOnboardingTitle}>गर्भसंस्कार</Text>
              <Text style={styles.webOnboardingSubtitle}>
                वेबवर विस्तृत डॅशबोर्ड, अॅपमध्ये साधा मोबाइल अनुभव.
              </Text>
              <View style={styles.webOnboardingList}>
                <Text style={styles.webOnboardingListItem}>• आठवड्यानुसार मार्गदर्शन</Text>
                <Text style={styles.webOnboardingListItem}>• नावे, संस्कार, योग, पोषण</Text>
                <Text style={styles.webOnboardingListItem}>• पुढे लॉगिन आणि क्लाउड डेटा साठवण</Text>
              </View>
            </View>
            <View style={styles.webOnboardingCard}>
              <OnboardingScreen onComplete={saveProfile} />
            </View>
          </View>
        ) : (
          <OnboardingScreen onComplete={saveProfile} />
        )}
      </SafeAreaView>
    );
  }

  const currentStack = navigationStack[navigationStack.length - 1];
  const activeTabMeta = NAV_TABS.find((tab) => tab.id === activeTab);

  if (IS_WEB) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.bg }]}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={currentColors.bg} />
        <View style={[styles.webBackdrop, { backgroundColor: currentColors.bg }]}>
          <View style={[styles.webShell, { backgroundColor: currentColors.bg }]}>
            <View style={[styles.webSidebar, isDarkMode && { backgroundColor: currentColors.primaryDark }]}>
              <View style={styles.webBrandCard}>
                <Text style={styles.webBrandEmoji}>🕉️</Text>
                <Text style={styles.webBrandTitle}>गर्भसंस्कार</Text>
                <Text style={styles.webBrandSubtitle}>Marathi pregnancy companion</Text>
              </View>

              <View style={styles.webWeekCard}>
                <Text style={styles.webWeekValue}>{profile.currentWeek}</Text>
                <Text style={styles.webWeekLabel}>सध्याचा आठवडा</Text>
              </View>

              <View style={styles.webNavList}>
                {NAV_TABS.map((tab) => {
                  const isActive = activeTab === tab.id && !currentStack;
                  return (
                    <TouchableOpacity
                      key={tab.id}
                      style={[styles.webNavItem, isActive && styles.webNavItemActive]}
                      onPress={() => handleTabPress(tab.id)}
                    >
                      <Text style={styles.webNavEmoji}>{tab.emoji}</Text>
                      <View style={styles.webNavTextWrap}>
                        <Text style={[styles.webNavLabel, isActive && styles.webNavLabelActive]}>
                          {tab.label}
                        </Text>
                        <Text style={styles.webNavHint}>{tab.hint}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.webSidebarFooter}>
                <Text style={styles.webSidebarName}>{profile.name || "आई"}</Text>
                <Text style={styles.webSidebarNote}>वेबवर डेस्कटॉप डॅशबोर्ड, अॅपमध्ये मोबाइल-फर्स्ट UI.</Text>
                {IS_WEB && (
                  <TouchableOpacity
                    style={styles.darkModeToggle}
                    onPress={toggleDarkMode}
                  >
                    <Text style={styles.darkModeIcon}>{isDarkMode ? "🌞" : "🌙"}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={[styles.webMainPane, { backgroundColor: currentColors.bg }]}>
              <View style={styles.webTopBar}>
                <View>
                  <Text style={styles.webEyebrow}>
                    {currentStack ? "आठवड्याचे मार्गदर्शन" : "डॅशबोर्ड"}
                  </Text>
                  <Text style={styles.webPageTitle}>
                    {currentStack ? `आठवडा ${currentStack.params.week}` : activeTabMeta?.label}
                  </Text>
                </View>

                {currentStack ? (
                  <TouchableOpacity style={styles.webBackChip} onPress={goBack}>
                    <Text style={styles.webBackChipText}>← मागे जा</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.webTopBadge}>
                    <Text style={styles.webTopBadgeNum}>{savedNames.length}</Text>
                    <Text style={styles.webTopBadgeLabel}>जतन नावे</Text>
                  </View>
                )}
              </View>

              <View style={styles.webContentStage}>
                <View style={styles.webContentSurface}>
                  {currentStack ? renderDetailScreen(currentStack) : renderMainScreen()}
                </View>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (currentStack) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.bg }]}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={currentColors.bgCard} />
        <View style={[styles.stackHeader, { backgroundColor: currentColors.bgCard, borderBottomColor: currentColors.border }]}> 
          <TouchableOpacity style={styles.backBtn} onPress={goBack}>
            <Text style={[styles.backBtnText, { color: currentColors.primary }]}>← मागे</Text>
          </TouchableOpacity>
          <Text style={[styles.stackTitle, { color: currentColors.textPrimary }]}>
            {currentStack.screen === "weekDetail" ? `आठवडा ${currentStack.params.week}` : ""}
          </Text>
          <TouchableOpacity style={styles.mobileDarkToggle} onPress={toggleDarkMode}>
            <Text style={styles.darkModeIcon}>{isDarkMode ? "🌞" : "🌙"}</Text>
          </TouchableOpacity>
        </View>
        {renderDetailScreen(currentStack)}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.bg }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={currentColors.bgCard} />

      <View style={[styles.topHeader, { backgroundColor: currentColors.bgCard, borderBottomColor: currentColors.border }]}>
        <View>
          <Text style={[styles.appTitle, { color: currentColors.textPrimary }]}>🕉️ गर्भसंस्कार</Text>
          <Text style={[styles.appSubtitle, { color: currentColors.textSecondary }]}>मराठी गर्भावस्था मार्गदर्शक</Text>
        </View>
        <View style={styles.topHeaderActions}>
          <View style={[styles.weekBadge, { backgroundColor: currentColors.primary }]}> 
            <Text style={styles.weekBadgeNum}>{profile.currentWeek}</Text>
            <Text style={styles.weekBadgeLabel}>आठवडा</Text>
          </View>
          <TouchableOpacity style={styles.mobileDarkToggle} onPress={toggleDarkMode}>
            <Text style={styles.darkModeIcon}>{isDarkMode ? "🌞" : "🌙"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>{renderMainScreen()}</View>

      <View style={[styles.bottomNav, { backgroundColor: currentColors.bgCard, borderTopColor: currentColors.border }]}> 
        {NAV_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.navTab, isActive && { backgroundColor: currentColors.bgWarm }]}
              onPress={() => handleTabPress(tab.id)}
            >
              <Text style={styles.navEmoji}>{tab.emoji}</Text>
              <Text style={[styles.navLabel, { color: currentColors.textLight }, isActive && { color: currentColors.primary, fontWeight: "700" }]}>
                {tab.label}
              </Text>
              {isActive && <View style={[styles.navIndicator, { backgroundColor: currentColors.primary }]} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  splashScreen: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  splashEmoji: { fontSize: 72, marginBottom: SPACING.md },
  splashTitle: { fontSize: FONTS.h1, fontWeight: "800", color: COLORS.textPrimary },
  splashSubtitle: { fontSize: FONTS.body, color: COLORS.textSecondary, marginTop: SPACING.sm },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.bgCard,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  appTitle: { fontSize: FONTS.h3, fontWeight: "800", color: COLORS.textPrimary, letterSpacing: 0.2 },
  appSubtitle: { fontSize: FONTS.tiny, color: COLORS.textSecondary, marginTop: 2 },
  topHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  weekBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: "center",
    ...SHADOWS.md,
  },
  weekBadgeNum: { fontSize: FONTS.h3, fontWeight: "800", color: COLORS.textWhite },
  weekBadgeLabel: { fontSize: FONTS.tiny, color: "rgba(255,255,255,0.8)" },
  content: { flex: 1 },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === "ios" ? SPACING.xs : SPACING.sm,
    paddingTop: SPACING.xs,
    ...SHADOWS.md,
  },
  navTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.sm,
    position: "relative",
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.xxs,
  },
  navTabActive: { backgroundColor: COLORS.bgWarm },
  navEmoji: { fontSize: 22, marginBottom: 2 },
  navLabel: { fontSize: FONTS.tiny, color: COLORS.textLight, fontWeight: "600" },
  navLabelActive: { color: COLORS.primary, fontWeight: "700" },
  navIndicator: {
    position: "absolute",
    top: -SPACING.xs,
    left: "30%",
    right: "30%",
    height: 3,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: RADIUS.sm,
    borderBottomRightRadius: RADIUS.sm,
  },
  stackHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.bgCard,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    minHeight: 56,
  },
  backBtn: { 
    paddingVertical: SPACING.md, 
    paddingHorizontal: SPACING.md,
    marginLeft: -SPACING.md,
    minWidth: 50,
  },
  backBtnText: { fontSize: FONTS.body, color: COLORS.primary, fontWeight: "600" },
  stackTitle: { fontSize: FONTS.h4, fontWeight: "700", color: COLORS.textPrimary },
  stackSpacer: { width: 60 },
  mobileDarkToggle: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: "rgba(127,127,127,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  webOnboardingRoot: {
    flex: 1,
    flexDirection: "row",
    padding: SPACING.xl,
    gap: SPACING.lg,
  },
  webOnboardingHero: {
    flex: 0.95,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primaryDark,
    padding: 44,
    justifyContent: "center",
    ...SHADOWS.md,
  },
  webOnboardingIcon: { fontSize: 56, marginBottom: SPACING.md },
  webOnboardingTitle: { fontSize: 34, fontWeight: "800", color: COLORS.textWhite },
  webOnboardingSubtitle: {
    fontSize: 16,
    lineHeight: 28,
    color: "rgba(255,255,255,0.84)",
    marginTop: SPACING.md,
  },
  webOnboardingList: { marginTop: SPACING.xl },
  webOnboardingListItem: {
    fontSize: 15,
    color: COLORS.bgWarm,
    marginBottom: SPACING.md,
  },
  webOnboardingCard: {
    flex: 1.15,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.md,
  },

  webBackdrop: {
    flex: 1,
    padding: SPACING.lg,
    backgroundColor: COLORS.bgMuted,
  },
  webShell: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.bgCard,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  webSidebar: {
    width: 250,
    padding: SPACING.lg,
    backgroundColor: COLORS.primaryDark,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.12)",
  },
  webBrandCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  webBrandEmoji: { fontSize: 28, marginBottom: SPACING.xs },
  webBrandTitle: { fontSize: 22, fontWeight: "800", color: COLORS.textWhite },
  webBrandSubtitle: { fontSize: FONTS.small, color: "rgba(255,255,255,0.82)", marginTop: 4 },
  webWeekCard: {
    marginTop: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.accent,
    padding: SPACING.md,
  },
  webWeekValue: { fontSize: 34, fontWeight: "800", color: COLORS.textWhite },
  webWeekLabel: { fontSize: FONTS.small, color: "rgba(255,255,255,0.84)", marginTop: 4 },
  webNavList: { marginTop: SPACING.lg },
  webNavItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: 13,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  webNavItemActive: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderColor: "rgba(255,255,255,0.28)",
  },
  webNavEmoji: { fontSize: 22, marginRight: SPACING.md },
  webNavTextWrap: { flex: 1 },
  webNavLabel: { fontSize: FONTS.body, fontWeight: "700", color: COLORS.textWhite },
  webNavLabelActive: { color: COLORS.textWhite },
  webNavHint: { fontSize: FONTS.tiny, color: "rgba(255,255,255,0.74)", marginTop: 3 },
  webSidebarFooter: {
    marginTop: "auto",
    paddingTop: SPACING.lg,
  },
  webSidebarName: { fontSize: FONTS.h4, fontWeight: "700", color: COLORS.textWhite },
  webSidebarNote: {
    fontSize: FONTS.small,
    lineHeight: 20,
    color: "rgba(255,255,255,0.76)",
    marginTop: SPACING.xs,
  },

  webMainPane: { flex: 1, backgroundColor: COLORS.bg },
  webTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: SPACING.md,
  },
  webEyebrow: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  webPageTitle: { fontSize: 28, fontWeight: "800", color: COLORS.textPrimary },
  webBackChip: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  webBackChipText: { fontSize: FONTS.small, fontWeight: "700", color: COLORS.primary },
  webTopBadge: {
    minWidth: 92,
    alignItems: "center",
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  webTopBadgeNum: { fontSize: FONTS.h3, fontWeight: "800", color: COLORS.primary },
  webTopBadgeLabel: { fontSize: FONTS.tiny, color: COLORS.textSecondary },
  webContentStage: {
    flex: 1,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  webContentSurface: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 26,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  darkModeToggle: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    alignItems: "center",
  },
  darkModeIcon: { fontSize: 24 },
});
