// src/config/indiaRegionalContext.js

export const indiaRegionalContext = {
  tamil_nadu: {
    languageCode: 'ta',
    uiLabels: {
      currentStage: "தற்போதைய வளர்ச்சி நிலை",
      strategyTitle: "உள்ளூர் பயிர் ஆலோசனைகள்",
      strategySub: "வகைப்படுத்தப்பட்ட கள உத்தி",
      channelLabel: "விருப்பமான தொடர்பு வழிமுறை",
      personnelLabel: "ஒதுக்கப்பட்ட கள அதிகாரி"
    },
    seasons: ["Nursery", "Vegetative", "Panicle Initiation", "Harvesting"]
  },
  maharashtra: {
    languageCode: 'mr',
    uiLabels: {
      currentStage: "सध्याची पिकाची स्थिती",
      strategyTitle: "स्थानिक पीक सल्ला",
      strategySub: "शिफारस केलेली क्षेत्र रणनीती",
      channelLabel: "पसंतीचे संवादाचे माध्यम",
      personnelLabel: "नियुक्त क्षेत्र प्रतिनिधी"
    },
    seasons: ["बियाणे / रोपवाटिका", "शाकीय वाढ (Vegetative)", "फुलोरा / कणीस धारणा", "काढणी (Harvest)"]
  },
  punjab: {
    languageCode: 'pa',
    uiLabels: {
      currentStage: "ਫ਼ਸਲ ਦੀ ਮੌਜੂਦਾ ਸਥਿਤੀ",
      strategyTitle: "ਸਥਾਨਕ ਫ਼ਸਲ ਸਲਾਹ",
      strategySub: "ਸਿਫ਼ਾਰਸ਼ ਕੀਤੀ ਫੀਲਡ ਰਣਨੀਤੀ",
      channelLabel: "ਸੰਚਾਰ ਦਾ ਤਰਜੀਹੀ ਮਾਧਿਅਮ",
      personnelLabel: "ਨਿਯੁਕਤ ਫੀਲਡ ਪ੍ਰਤੀਨਿਧ"
    },
    seasons: ["ਬਿਜਾਈ / ਪਨੀਰੀ", "ਵਨਸਪਤੀ ਵਾਧਾ", "ਸਿੱਟਾ ਨਿਕਲਣਾ", "ਵਾਢੀ (Harvest)"]
  },
  uttar_pradesh: {
    languageCode: 'hi',
    uiLabels: {
      currentStage: "वर्तमान फसल चरण",
      strategyTitle: "स्थानीय फसल परामर्श",
      strategySub: "अनुशंसित क्षेत्र रणनीति",
      channelLabel: "पसंदीदा संचार माध्यम",
      personnelLabel: "नामित क्षेत्र प्रतिनिधि"
    },
    seasons: ["नर्सरी / बुवाई", "वानस्पतिक वृद्धि", "बाली आना (Heading)", "कटाई (Harvesting)"]
  },
  andhra_pradesh: {
    languageCode: 'te',
    uiLabels: {
      currentStage: "ప్రస్తుత పంట దశ",
      strategyTitle: "స్థానిక పంట సలహాలు",
      strategySub: "సిఫార్సు చేయబడిన క్షేత్ర వ్యూహం",
      channelLabel: "ప్రాధాన్యత కమ్యూనికేషన్ ఛానల్",
      personnelLabel: "కేటాయించిన ఫీల్ਡ ప్రతినిధి"
    },
    seasons: ["నారుమడి", "కాయక దశ (Vegetative)", "వెన్ను పాలుపోసుకునే దశ", "కోత కోయడం"]
  }
};

export const getRegionalContext = (stateKey) => {
  const normalizedKey = stateKey ? stateKey.toLowerCase().replace(/ /g, '_') : 'tamil_nadu';
  return indiaRegionalContext[normalizedKey] || indiaRegionalContext['maharashtra']; // Default safe fallback
};