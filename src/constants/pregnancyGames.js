export function getPregnancyMonthFromWeek(week) {
  if (week <= 4) return 1;
  if (week <= 8) return 2;
  if (week <= 13) return 3;
  if (week <= 17) return 4;
  if (week <= 22) return 5;
  if (week <= 27) return 6;
  if (week <= 31) return 7;
  if (week <= 35) return 8;
  return 9;
}

const MONTH_GAME_PLANS = {
  1: {
    focus: "शांत मन, हलकी एकाग्रता आणि ऊर्जा जपणे",
    safetyNote: "थकवा, मळमळ किंवा चक्कर आल्यास त्वरित थांबा. हे खेळ बसून किंवा आरामातच करा.",
    games: [
      {
        name: "श्वास मोजणी खेळ",
        emoji: "🌬️",
        duration: "३-५ मिनिटे",
        benefit: "मन शांत ठेवते आणि ताण कमी करते.",
        howToPlay: "४ मोजून श्वास घ्या, ४ मोजून सोडा. प्रत्येक फेरीनंतर १ गुण द्या आणि १० पर्यंत पोहोचा.",
      },
      {
        name: "रंग शोधा",
        emoji: "🎨",
        duration: "५ मिनिटे",
        benefit: "हलकी जागरूकता वाढवते.",
        howToPlay: "खोलीत एखादा रंग निवडा आणि त्या रंगाच्या ५ वस्तू शांतपणे शोधा.",
      },
      {
        name: "तीन आनंदी विचार",
        emoji: "✨",
        duration: "४ मिनिटे",
        benefit: "मूड हलका ठेवते.",
        howToPlay: "आजच्या दिवसातील ३ छोट्या चांगल्या गोष्टी लिहा किंवा मोठ्याने बोला.",
      },
    ],
  },
  2: {
    focus: "मेमरी आणि पॉझिटिव्ह विचारांना चालना",
    safetyNote: "स्क्रीन गेमपेक्षा हलके, डोळ्यांना आराम देणारे खेळ निवडा.",
    games: [
      {
        name: "शब्दसाखळी",
        emoji: "🔤",
        duration: "५-७ मिनिटे",
        benefit: "मेंदू सक्रिय ठेवते.",
        howToPlay: "एखादे सौम्य शब्द निवडा आणि त्याच्या शेवटच्या अक्षरावरून पुढचा शब्द तयार करा.",
      },
      {
        name: "गाणे ओळखा",
        emoji: "🎵",
        duration: "५ मिनिटे",
        benefit: "मन प्रसन्न ठेवते.",
        howToPlay: "हलके संगीत लावा आणि राग, गाणे किंवा भक्तिगीताचा मूड ओळखा.",
      },
      {
        name: "पाणी गुण खेळ",
        emoji: "💧",
        duration: "दिवसभर",
        benefit: "हायड्रेशनची सवय टिकवते.",
        howToPlay: "प्रत्येक वेळी पाणी प्यायल्यानंतर एक गुण द्या. दिवसाअखेर आपला स्कोअर पाहा.",
      },
    ],
  },
  3: {
    focus: "स्मरणशक्ती आणि बाळाशी भावनिक जोड",
    safetyNote: "अतिशय स्पर्धात्मक किंवा तणाव वाढवणारे खेळ टाळा.",
    games: [
      {
        name: "मेमरी ट्रे",
        emoji: "🧠",
        duration: "५ मिनिटे",
        benefit: "मेमरी सुधारण्यास मदत करते.",
        howToPlay: "टेबलवर ५ वस्तू ठेवा, २० सेकंद पाहा, मग झाका आणि आठवण्याचा प्रयत्न करा.",
      },
      {
        name: "बाळासाठी अक्षर खेळ",
        emoji: "👶",
        duration: "६ मिनिटे",
        benefit: "बाळाशी संवाद आणि सर्जनशीलता वाढते.",
        howToPlay: "एक अक्षर निवडा आणि त्या अक्षराने सुरू होणारे ५ सकारात्मक शब्द बोला.",
      },
      {
        name: "कृतज्ञता कार्ड",
        emoji: "💌",
        duration: "५ मिनिटे",
        benefit: "भावनिक स्थैर्य वाढवते.",
        howToPlay: "आज तुम्ही कशाबद्दल कृतज्ञ आहात याची ३ छोटी कार्ड-नोंदी करा.",
      },
    ],
  },
  4: {
    focus: "हलकी योजना, निरीक्षण आणि पॉझिटिव्हिटी",
    safetyNote: "जास्त वेळ उभे राहून खेळू नका. शक्यतो बसून खेळा.",
    games: [
      {
        name: "५ इंद्रियांचा खेळ",
        emoji: "🪷",
        duration: "५ मिनिटे",
        benefit: "माइंडफुलनेस सुधारते.",
        howToPlay: "५ दिसणाऱ्या, ४ स्पर्श होणाऱ्या, ३ ऐकू येणाऱ्या, २ सुगंध आणि १ चव सांगायची.",
      },
      {
        name: "बाळाशी संभाषण कार्ड",
        emoji: "🗣️",
        duration: "५-८ मिनिटे",
        benefit: "बॉन्डिंग वाढते.",
        howToPlay: "आजचा प्रश्न निवडा: ‘आज आपण काय ऐकू?’, ‘तुला कोणता रंग आवडेल?’ आणि उत्तर कल्पना करा.",
      },
      {
        name: "मूड मीटर",
        emoji: "🌈",
        duration: "३ मिनिटे",
        benefit: "स्वतःची भावना समजण्यास मदत.",
        howToPlay: "आजचा मूड एका रंगाशी जोडून त्याला एक छोटा शब्द द्या.",
      },
    ],
  },
  5: {
    focus: "सर्जनशीलता, नाव-विचार आणि हलकी मेमरी",
    safetyNote: "दीर्घकाळ स्क्रीनकडे पाहणे टाळा. मध्ये थोडी विश्रांती घ्या.",
    games: [
      {
        name: "नाव सुचवा चॅलेंज",
        emoji: "📝",
        duration: "७ मिनिटे",
        benefit: "मजेदार आणि भावनिक जोड निर्माण करते.",
        howToPlay: "एका अक्षरावरून मुलगा, मुलगी आणि उभयलिंगी असे प्रत्येकी एक नाव सुचवा.",
      },
      {
        name: "कथा पूर्ण करा",
        emoji: "📖",
        duration: "५-७ मिनिटे",
        benefit: "कल्पनाशक्ती वाढवते.",
        howToPlay: "‘आज बाळाने मला सांगितले की...’ या वाक्यापासून ४ वाक्यांची कथा तयार करा.",
      },
      {
        name: "जोडी शोधा",
        emoji: "🔗",
        duration: "५ मिनिटे",
        benefit: "मेंदू जागा ठेवते.",
        howToPlay: "उदा. दूध-हळद, फळ-पाणी, संगीत-शांतता अशा आरोग्यदायी जोड्या तयार करा.",
      },
    ],
  },
  6: {
    focus: "रुटीन, स्मरणशक्ती आणि शांत एकाग्रता",
    safetyNote: "पाठीवर ताण येत असेल तर एकाच स्थितीत जास्त वेळ बसू नका.",
    games: [
      {
        name: "हायड्रेशन ट्रॅकर गेम",
        emoji: "🥤",
        duration: "दिवसभर",
        benefit: "पाणी पिण्याची सवय टिकते.",
        howToPlay: "प्रत्येक ग्लासनंतर एक छोटा तारा द्या. ८ तारे पूर्ण करायचे लक्ष्य ठेवा.",
      },
      {
        name: "सकारात्मक शब्दसाखळी",
        emoji: "💛",
        duration: "५ मिनिटे",
        benefit: "मनाला उभारी देते.",
        howToPlay: "प्रेम, शांतता, आनंद यांसारख्या शब्दांवरून पुढचा शब्द तयार करा.",
      },
      {
        name: "चित्र निरीक्षण",
        emoji: "🖼️",
        duration: "४ मिनिटे",
        benefit: "निरीक्षणशक्ती वाढते.",
        howToPlay: "एक चित्र पाहा, डोळे बंद करा आणि त्यातील ५ तपशील आठवा.",
      },
    ],
  },
  7: {
    focus: "शांतता, संगीत आणि मानसिक तयारी",
    safetyNote: "श्वासोच्छ्वास रोखून ठेवणारे कोणतेही खेळ करू नका.",
    games: [
      {
        name: "लोरी ओळखा",
        emoji: "🎶",
        duration: "५ मिनिटे",
        benefit: "बाळाशी नातं घट्ट करते.",
        howToPlay: "हलकी लोरी/भक्तिगीत लावा आणि कोणता भाव जागृत होतो ते नोंदवा.",
      },
      {
        name: "धीम्या श्वासाचा स्कोअर",
        emoji: "🌸",
        duration: "४ मिनिटे",
        benefit: "शांतता आणि स्थिरता.",
        howToPlay: "१० सौम्य श्वास पूर्ण झाले की स्वतःला १०/१० स्कोअर द्या.",
      },
      {
        name: "आजची छोटी तयारी",
        emoji: "👜",
        duration: "६ मिनिटे",
        benefit: "प्रॅक्टिकल तयारीला मदत.",
        howToPlay: "हॉस्पिटल बॅग, डॉक्युमेंट्स किंवा बेबी-लिस्टमधील ३ गोष्टी निवडा आणि मार्क करा.",
      },
    ],
  },
  8: {
    focus: "आराम, भावनिक आधार आणि प्रसूतीपूर्व तयारी",
    safetyNote: "दम लागल्यास किंवा शरीर जड वाटल्यास लगेच ब्रेक घ्या.",
    games: [
      {
        name: "अफर्मेशन कार्ड निवडा",
        emoji: "🌟",
        duration: "३-५ मिनिटे",
        benefit: "आत्मविश्वास वाढवते.",
        howToPlay: "आजसाठी एक वाक्य निवडा: ‘मी शांत आहे’, ‘माझे शरीर समर्थ आहे’, ‘मी तयार आहे’.",
      },
      {
        name: "फोटो मेमरी",
        emoji: "📸",
        duration: "५ मिनिटे",
        benefit: "हलकी मेंटल अ‍ॅक्टिव्हिटी.",
        howToPlay: "एका फोटोतील ५ तपशील लक्षात ठेवा आणि नंतर आठवण्याचा प्रयत्न करा.",
      },
      {
        name: "शांत कोपरा सजवा",
        emoji: "🪔",
        duration: "८ मिनिटे",
        benefit: "मन शांत ठेवते.",
        howToPlay: "आपल्या विश्रांतीच्या जागेत ३ सुखद गोष्टी जोडा: उशी, पाणी, संगीत किंवा पुस्तक.",
      },
    ],
  },
  9: {
    focus: "प्रसूतीपूर्व मानसिक तयारी आणि सौम्य शांतता",
    safetyNote: "या टप्प्यात केवळ अगदी हलके आणि स्थिर खेळच करा. अस्वस्थ वाटल्यास डॉक्टरांचा सल्ला घ्या.",
    games: [
      {
        name: "शांत काउंटडाउन",
        emoji: "⏳",
        duration: "३ मिनिटे",
        benefit: "धीर आणि स्थिरता देते.",
        howToPlay: "१० ते १ हळूवार उलटी मोजणी करत प्रत्येक आकड्यासोबत एक रिलॅक्सिंग शब्द बोला.",
      },
      {
        name: "हॉस्पिटल बॅग चेक",
        emoji: "✅",
        duration: "५ मिनिटे",
        benefit: "तयारीबद्दल आत्मविश्वास वाढवते.",
        howToPlay: "३ वस्तू निवडा आणि त्या तयार आहेत का हे ‘हो/नाही’ स्वरूपात चिन्हांकित करा.",
      },
      {
        name: "बाळासाठी संदेश",
        emoji: "🤍",
        duration: "५ मिनिटे",
        benefit: "भावनिक कनेक्शन अधिक मजबूत होते.",
        howToPlay: "बाळासाठी ३ प्रेमळ वाक्ये बोला किंवा लिहा.",
      },
    ],
  },
};

export function getPregnancyGamesForWeek(week) {
  const month = getPregnancyMonthFromWeek(week);
  const plan = MONTH_GAME_PLANS[month];

  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  const daySeed = Array.from(todayKey).reduce((acc, char) => acc + char.charCodeAt(0), 0) + (week * 17);

  const monthGamePool = [
    ...plan.games,
    ...(MONTH_GAME_PLANS[Math.max(1, month - 1)]?.games || []),
    ...(MONTH_GAME_PLANS[Math.min(9, month + 1)]?.games || []),
  ];

  const uniqueGames = [];
  const seen = new Set();
  let offset = 0;
  while (uniqueGames.length < 3 && seen.size < monthGamePool.length) {
    const index = Math.abs(daySeed + offset) % monthGamePool.length;
    if (!seen.has(index)) {
      seen.add(index);
      uniqueGames.push(monthGamePool[index]);
    }
    offset += 1;
  }

  const dailyGames = uniqueGames.length ? uniqueGames : plan.games;

  return {
    title: `महिना ${month} साठी आईसाठी खेळ (आजचा प्लॅन)`,
    month,
    dayLabel: today.toLocaleDateString("mr-IN", { weekday: "long", day: "numeric", month: "long" }),
    focus: plan.focus,
    safetyNote: plan.safetyNote,
    games: dailyGames,
    benefits: [
      "हलकी मानसिक चपळता टिकवण्यास मदत",
      "मन शांत ठेवण्यास उपयोगी",
      "बाळाशी भावनिक नातं घट्ट करण्यासाठी उपयुक्त",
    ],
  };
}
