import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const hasConfig = !!(
  firebaseConfig.apiKey
  && firebaseConfig.authDomain
  && firebaseConfig.projectId
  && firebaseConfig.appId
);

let app;
let auth;
let db;

if (hasConfig) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export function isFirebaseConfigured() {
  return hasConfig;
}

export function observeAuth(handler) {
  if (!auth) {
    handler(null);
    return () => {};
  }
  return onAuthStateChanged(auth, handler);
}

export async function tryCompleteRedirectSignIn() {
  if (!auth || Platform.OS !== "web") return null;
  try {
    return await getRedirectResult(auth);
  } catch (error) {
    console.error("Redirect sign-in error", error);
    return null;
  }
}

export async function signInWithGoogle() {
  if (!auth) throw new Error("Firebase config missing");
  if (Platform.OS !== "web") {
    throw new Error("Google sign-in is currently enabled for web in this release.");
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  await setPersistence(auth, browserLocalPersistence);

  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (popupError) {
    const fallbackCodes = [
      "auth/popup-blocked",
      "auth/popup-closed-by-user",
      "auth/cancelled-popup-request",
      "auth/operation-not-supported-in-this-environment",
    ];
    if (fallbackCodes.includes(popupError?.code)) {
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw popupError;
  }
}

export async function signOutUser() {
  if (!auth) return;
  await signOut(auth);
}

function getUserDocRef(uid) {
  return doc(db, "users", uid);
}

export async function loadUserCloud(uid) {
  if (!db || !uid) return null;
  const snapshot = await getDoc(getUserDocRef(uid));
  if (!snapshot.exists()) return null;
  return snapshot.data();
}

export async function saveUserCloud(uid, payload) {
  if (!db || !uid) return;
  await setDoc(
    getUserDocRef(uid),
    {
      ...payload,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
