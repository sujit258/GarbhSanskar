export const PREGNANCY_CHAT_CATEGORIES = [
  {
    id: "week",
    emoji: "🍼",
    label: "माझा आठवडा",
    questions: [
      "आठवडा {week}मध्ये बाळाची वाढ कशी होत आहे?",
      "आठवडा {week}मध्ये आईने कोणत्या गोष्टींकडे लक्ष द्यावे?",
      "आठवडा {week}मध्ये कोणती लक्षणे सामान्य असू शकतात?",
    ],
  },
  {
    id: "food",
    emoji: "🥗",
    label: "आहार",
    questions: [
      "आठवडा {week}मध्ये मला काय खावे?",
      "आठवडा {week}मध्ये कोणते अन्न टाळावे?",
      "आठवडा {week}मध्ये मळमळ होत असेल तर हलका आहार कसा ठेवू?",
    ],
  },
  {
    id: "yoga",
    emoji: "🧘",
    label: "योग",
    questions: [
      "आठवडा {week}मध्ये कोणती योगासने सुरक्षित आहेत?",
      "आठवडा {week}मध्ये श्वसनाचे कोणते सराव करू शकते?",
      "आठवडा {week}मध्ये थकवा असल्यास हलका व्यायाम कोणता?",
    ],
  },
  {
    id: "symptoms",
    emoji: "🩺",
    label: "लक्षणे",
    questions: [
      "आठवडा {week}मध्ये कोणती लक्षणे अपेक्षित आहेत?",
      "आठवडा {week}मध्ये पाठदुखी कमी करण्यासाठी काय करावे?",
      "आठवडा {week}मध्ये डॉक्टरांना तातडीने कधी भेटावे?",
    ],
  },
  {
    id: "mind",
    emoji: "🌸",
    label: "मनःशांती",
    questions: [
      "आठवडा {week}मध्ये तणाव कमी करण्यासाठी काय करावे?",
      "आठवडा {week}मध्ये झोप नीट लागत नसेल तर काय करावे?",
      "आठवडा {week}मध्ये बाळाशी प्रेमाने कसे बोलावे?",
    ],
  },
  {
    id: "delivery",
    emoji: "🤱",
    label: "प्रसूती तयारी",
    questions: [
      "आठवडा {week}मध्ये प्रसूतीसाठी मानसिक तयारी कशी करावी?",
      "आठवडा {week}मध्ये हॉस्पिटल बॅगमध्ये काय ठेवावे?",
      "आठवडा {week}मध्ये प्रसूतीसाठी कोणत्या गोष्टींसाठी सज्ज राहावे?",
    ],
  },
];

export function getQuestionsForCategory(categoryId, week = 1) {
  const category = PREGNANCY_CHAT_CATEGORIES.find((item) => item.id === categoryId);
  if (!category) return [];
  return category.questions.map((q) => q.replace(/\{week\}/g, week));
}
