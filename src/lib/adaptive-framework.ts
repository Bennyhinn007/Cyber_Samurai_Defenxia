import CryptoJS from "crypto-js";

export type RiskLevel = "low" | "medium" | "high";
export type AppLanguage = "en" | "hi" | "kn" | "mr" | "te" | "ta" | "ml";

export interface AdaptiveContext {
  hasWeakNetwork: boolean;
  suspiciousSmsCount: number;
  suspiciousLinkCount: number;
  riskyPermissionsCount: number;
  secureModeEnabled: boolean;
  selectedLanguage: AppLanguage;
}

export interface ExplainableResult {
  level: RiskLevel;
  reason: string;
  action: string;
}

export interface BlockchainTrustEvent {
  id: string;
  timestamp: string;
  eventType: string;
  detail: string;
  riskLevel: RiskLevel;
  previousHash: string;
  hash: string;
}

const TRUSTED_BANKING_DOMAINS = [
  "sbi.co.in",
  "onlinesbi.sbi",
  "icicibank.com",
  "hdfcbank.com",
  "axisbank.com",
  "kotak.com",
  "pnbindia.in",
  "bankofbaroda.in",
  "upi",
  "npci.org.in",
];

const suspiciousSmsPatterns = [
  /kyc/i,
  /account.*block/i,
  /urgent/i,
  /verify.*now/i,
  /click.*link/i,
  /share.*otp/i,
  /reward/i,
  /install.*app/i,
  /upi.*collect/i,
  /refund/i,
];

const suspiciousUrlPatterns = [
  /\d{1,3}(\.\d{1,3}){3}/,
  /@/,
  /secure-login|verify-account|update-kyc|bank-alert/i,
  /\.(xyz|top|click|work|loan)$/i,
];

const translations = {
  en: {
    safe: "Safe",
    suspicious: "Suspicious",
    dangerous: "Dangerous",
    doNotShareOtp: "Do not share OTP, PIN, or CVV with anyone.",
  },
  hi: {
    safe: "सुरक्षित",
    suspicious: "संदिग्ध",
    dangerous: "खतरनाक",
    doNotShareOtp: "किसी के साथ OTP, PIN या CVV साझा न करें।",
  },
  kn: {
    safe: "ಸುರಕ್ಷಿತ",
    suspicious: "ಸಂದಿಗ್ಧ",
    dangerous: "ಅಪಾಯಕಾರಿ",
    doNotShareOtp: "OTP, PIN ಅಥವಾ CVV ಅನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.",
  },
  mr: {
    safe: "सुरक्षित",
    suspicious: "संशयास्पद",
    dangerous: "धोकादायक",
    doNotShareOtp: "OTP, PIN किंवा CVV कोणाशीही शेअर करू नका.",
  },
  te: {
    safe: "సురక్షితం",
    suspicious: "అనుమానాస్పదం",
    dangerous: "ప్రమాదకరం",
    doNotShareOtp: "OTP, PIN లేదా CVV ను ఎవరితోనూ పంచుకోకండి.",
  },
  ta: {
    safe: "பாதுகாப்பானது",
    suspicious: "சந்தேகத்துக்கிடமானது",
    dangerous: "ஆபத்தானது",
    doNotShareOtp: "OTP, PIN அல்லது CVV-ஐ யாருடனும் பகிர வேண்டாம்.",
  },
  ml: {
    safe: "സുരക്ഷിതം",
    suspicious: "സംശയാസ്പദം",
    dangerous: "അപകടകരം",
    doNotShareOtp: "OTP, PIN അല്ലെങ്കിൽ CVV ആരുമായും പങ്കിടരുത്.",
  },
};

export const detectSmsFraud = (smsText: string): ExplainableResult => {
  const hitCount = suspiciousSmsPatterns.filter((pattern) => pattern.test(smsText)).length;
  if (hitCount >= 3) {
    return {
      level: "high",
      reason: "Message has multiple scam indicators.",
      action: "Do not click links. Call bank using official number.",
    };
  }
  if (hitCount >= 1) {
    return {
      level: "medium",
      reason: "Message contains suspicious fraud keywords.",
      action: "Verify with bank app before taking action.",
    };
  }
  return {
    level: "low",
    reason: "No major phishing patterns detected.",
    action: "Stay alert and never share OTP.",
  };
};

export const detectPhishingUrl = (rawInput: string): ExplainableResult => {
  const input = rawInput.trim().toLowerCase();
  const suspiciousHits = suspiciousUrlPatterns.filter((pattern) => pattern.test(input)).length;
  const trustedHit = TRUSTED_BANKING_DOMAINS.some((domain) => input.includes(domain));

  if (!trustedHit && suspiciousHits >= 2) {
    return {
      level: "high",
      reason: "Domain format and URL structure appear malicious.",
      action: "Block access and report as phishing.",
    };
  }
  if (!trustedHit || suspiciousHits >= 1) {
    return {
      level: "medium",
      reason: "URL does not fully match trusted banking domain rules.",
      action: "Open only after manual bank verification.",
    };
  }
  return {
    level: "low",
    reason: "URL matches trusted banking pattern checks.",
    action: "Proceed with caution and verify lock icon.",
  };
};

export const evaluateWifiRisk = (securityType: string, signalStrength: number): ExplainableResult => {
  const security = securityType.toLowerCase();
  if (security.includes("open") || security.includes("wep")) {
    return {
      level: "high",
      reason: "Open or weakly encrypted WiFi detected.",
      action: "Avoid banking transactions on this network.",
    };
  }
  if (signalStrength < 35) {
    return {
      level: "medium",
      reason: "Weak signal can increase session instability risk.",
      action: "Switch to mobile data for payment actions.",
    };
  }
  return {
    level: "low",
    reason: "Network appears reasonably secure for regular browsing.",
    action: "Enable secure mode before banking tasks.",
  };
};

export const calculateTrustScore = (context: AdaptiveContext): number => {
  let score = 100;
  score -= context.hasWeakNetwork ? 12 : 0;
  score -= context.suspiciousSmsCount * 8;
  score -= context.suspiciousLinkCount * 10;
  score -= context.riskyPermissionsCount * 7;
  score += context.secureModeEnabled ? 8 : -8;
  return Math.max(10, Math.min(99, score));
};

export const getAdaptiveGuidance = (language: AppLanguage) => {
  return translations[language];
};

const LOG_KEY = "defenxia-trust-chain";

export const loadTrustChain = (): BlockchainTrustEvent[] => {
  const raw = localStorage.getItem(LOG_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as BlockchainTrustEvent[];
  } catch {
    return [];
  }
};

export const appendTrustEvent = (
  eventType: string,
  detail: string,
  riskLevel: RiskLevel,
): BlockchainTrustEvent => {
  const chain = loadTrustChain();
  const previousHash = chain.length ? chain[chain.length - 1].hash : "GENESIS";
  const timestamp = new Date().toISOString();
  const id = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  const payload = `${id}|${timestamp}|${eventType}|${detail}|${riskLevel}|${previousHash}`;
  const hash = CryptoJS.SHA256(payload).toString();

  const newEvent: BlockchainTrustEvent = {
    id,
    timestamp,
    eventType,
    detail,
    riskLevel,
    previousHash,
    hash,
  };

  localStorage.setItem(LOG_KEY, JSON.stringify([...chain, newEvent]));
  return newEvent;
};
