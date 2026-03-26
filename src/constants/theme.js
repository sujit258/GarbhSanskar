export const COLORS = {
  primary: "#5B4BDB",
  primaryLight: "#8E84F5",
  primaryDark: "#3D2FB3",

  accent: "#0E9F8D",
  accentLight: "#43C7B7",

  gold: "#C68A1E",
  goldLight: "#F0C971",

  bg: "#F4F6FF",
  bgCard: "#FFFFFF",
  bgWarm: "#F2EEFF",
  bgTeal: "#E6FAF7",
  bgMuted: "#EDEFFF",

  // Trimester colors
  t1: "#FFE3D2",
  t1Dark: "#BA5E33",
  t2: "#D6F3DE",
  t2Dark: "#217A50",
  t3: "#DDD9FF",
  t3Dark: "#4A43A8",

  // Text
  textPrimary: "#1F2440",
  textSecondary: "#4D5478",
  textLight: "#7C84A8",
  textWhite: "#FFFFFF",

  // Status
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",

  // Borders
  border: "#D7DDF0",
  borderLight: "#E8ECF7",

  // Shadow
  shadow: "rgba(66, 73, 122, 0.18)",
};

// Dark mode color variants
export const COLORS_DARK = {
  primary: "#8E84F5",
  primaryLight: "#A89FFF",
  primaryDark: "#5B4BDB",

  accent: "#43C7B7",
  accentLight: "#5FD9C7",

  gold: "#F0C971",
  goldLight: "#FFE699",

  bg: "#1A1F3A",
  bgCard: "#252D4D",
  bgWarm: "#2F2A45",
  bgTeal: "#1F3936",
  bgMuted: "#1E1D35",

  // Trimester colors (adjusted for dark)
  t1: "#4D2E1F",
  t1Dark: "#FFE3D2",
  t2: "#1F4D2A",
  t2Dark: "#D6F3DE",
  t3: "#2A261F",
  t3Dark: "#DDD9FF",

  // Text
  textPrimary: "#F2F5FF",
  textSecondary: "#D3DAEB",
  textLight: "#AFB8CF",
  textWhite: "#FFFFFF",

  // Status
  success: "#66BB6A",
  warning: "#FFB74D",
  error: "#EF5350",

  // Borders
  border: "#3F4A6F",
  borderLight: "#2F3A55",

  // Shadow
  shadow: "rgba(0, 0, 0, 0.4)",
};

export const FONTS = {
  marathi: "System",
  h1: 30,
  h2: 24,
  h3: 20,
  h4: 17,
  body: 15,
  small: 13,
  tiny: 10,
};

export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 14,
  lg: 24,
  xl: 30,
  xxl: 48,
};

export const RADIUS = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 28,
  full: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.55,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 22,
    elevation: 6,
  },
};

export const TRIMESTER_INFO = {
  1: { label: "पहिली तिमाही", weeks: "१-१३", color: COLORS.t1, dark: COLORS.t1Dark, emoji: "🌱" },
  2: { label: "दुसरी तिमाही", weeks: "१४-२७", color: COLORS.t2, dark: COLORS.t2Dark, emoji: "🌸" },
  3: { label: "तिसरी तिमाही", weeks: "२८-४०", color: COLORS.t3, dark: COLORS.t3Dark, emoji: "🌟" },
};

export const RASHIS = [
  "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
  "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"
];

export const NAKSHATRAS = [
  "अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशीर्ष",
  "आर्द्रा", "पुनर्वसू", "पुष्य", "आश्लेषा", "मघा",
  "पूर्वा फाल्गुनी", "उत्तरा फाल्गुनी", "हस्त", "चित्रा",
  "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूळ",
  "पूर्वाषाढा", "उत्तराषाढा", "श्रवण", "धनिष्ठा",
  "शतभिषा", "पूर्वाभाद्रपदा", "उत्तराभाद्रपदा", "रेवती"
];

export const MARATHI_ALPHABET = [
  "अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ",
  "क", "ख", "ग", "घ", "च", "छ", "ज", "झ",
  "ट", "ठ", "ड", "ढ", "त", "थ", "द", "ध", "न",
  "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व",
  "श", "स", "ह"
];

// Helper function to get color palette based on theme mode
export function getColors(isDarkMode = false) {
  return isDarkMode ? COLORS_DARK : COLORS;
}
