import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function toEnglishDigits(value) {
  const map = {
    "०": "0", "१": "1", "२": "2", "३": "3", "४": "4",
    "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
  };
  return String(value || "").replace(/[०-९]/g, (digit) => map[digit] || digit);
}

function parseDailyTrigger(timeText) {
  const raw = toEnglishDigits(timeText).trim();

  if (raw.includes("दर 2 तासांनी")) {
    return { type: "interval", trigger: { seconds: 2 * 60 * 60, repeats: true } };
  }

  const match = raw.match(/(\d{1,2})\s*[:.]\s*(\d{1,2})/);
  if (!match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2]);

  if (raw.includes("दुपारी") || raw.includes("सायंकाळी") || raw.includes("संध्याकाळी") || raw.includes("रात्री")) {
    if (hour < 12) hour += 12;
  } else if (raw.includes("पहाटे") && hour === 12) {
    hour = 0;
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { type: "daily", trigger: { hour, minute, repeats: true } };
}

export async function requestReminderPermissionIfNeeded() {
  if (Platform.OS === "web") return true;

  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted || existing.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });

  return !!requested.granted;
}

export async function scheduleReminderNotification(reminder) {
  if (Platform.OS === "web" || !reminder?.enabled) return null;

  const hasPermission = await requestReminderPermissionIfNeeded();
  if (!hasPermission) {
    throw new Error("नोटिफिकेशन परवानगी दिलेली नाही. iPhone Settings मध्ये Notifications सुरू करा.");
  }

  const parsed = parseDailyTrigger(reminder.time);
  if (!parsed) {
    throw new Error("या स्मरणपत्रासाठी वेळ फॉरमॅट समजला नाही. उदा. 'सकाळी ८:००' वापरा.");
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "🔔 गर्भसंस्कार स्मरणपत्र",
      body: `${reminder.title} (${reminder.time})`,
      sound: true,
      data: { reminderId: reminder.id },
    },
    trigger: parsed.trigger,
  });

  return notificationId;
}

export async function cancelReminderNotification(notificationId) {
  if (Platform.OS === "web" || !notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
