import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  USER_PROFILE: "garbh_user_profile",
  CURRENT_WEEK: "garbh_current_week",
  FAVORITES: "garbh_favorites",
  SAVED_NAMES: "garbh_saved_names",
};

export function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (data) setProfile(JSON.parse(data));
    } catch (e) {
      console.error("Profile load error", e);
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile(newProfile) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (e) {
      console.error("Profile save error", e);
    }
  }

  function getCurrentWeek(lmpDate) {
    if (!lmpDate) return 1;
    const lmp = new Date(lmpDate);
    const today = new Date();
    const diffMs = today - lmp;
    const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
    return Math.max(1, Math.min(40, diffWeeks + 1));
  }

  function getTrimester(week) {
    if (week <= 13) return 1;
    if (week <= 27) return 2;
    return 3;
  }

  function getDaysUntilDueDate(dueDate) {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const today = new Date();
    const diffMs = due - today;
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }

  return { profile, loading, saveProfile, getCurrentWeek, getTrimester, getDaysUntilDueDate };
}

export function useSavedNames() {
  const [savedNames, setSavedNames] = useState([]);

  useEffect(() => {
    loadSavedNames();
  }, []);

  async function loadSavedNames() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_NAMES);
      if (data) setSavedNames(JSON.parse(data));
    } catch (e) {}
  }

  async function toggleSaveName(nameObj) {
    try {
      const exists = savedNames.find((n) => n.name === nameObj.name);
      let updated;
      if (exists) {
        updated = savedNames.filter((n) => n.name !== nameObj.name);
      } else {
        updated = [...savedNames, nameObj];
      }
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_NAMES, JSON.stringify(updated));
      setSavedNames(updated);
    } catch (e) {}
  }

  function isNameSaved(name) {
    return savedNames.some((n) => n.name === name);
  }

  return { savedNames, toggleSaveName, isNameSaved };
}
