import { RiskLevel } from "./adaptive-framework";

export type RuralPersona = "new_user" | "senior_citizen" | "small_merchant";

export interface TransactionCheckResult {
  level: RiskLevel;
  title: string;
  reason: string;
  action: string;
}

const scamPatterns = [
  /upi.*collect/i,
  /kyc.*update/i,
  /account.*freeze/i,
  /loan.*instant/i,
  /cashback.*claim/i,
  /share.*otp/i,
  /remote.*app/i,
];

const trustedUpiHandles = ["@oksbi", "@okhdfcbank", "@okaxis", "@ybl", "@ibl"];

export const getPersonaLabel = (persona: RuralPersona): string => {
  if (persona === "new_user") return "New Digital Banking User";
  if (persona === "senior_citizen") return "Senior Citizen";
  return "Small Merchant";
};

export const getPersonaGuidance = (persona: RuralPersona): string => {
  if (persona === "new_user") return "Only trust official banking apps and verified UPI IDs.";
  if (persona === "senior_citizen") return "Never trust urgent calls asking for OTP or PIN.";
  return "Verify payment request sender before approving UPI collect requests.";
};

export const checkUpiTransactionSafety = (input: string): TransactionCheckResult => {
  const value = input.trim().toLowerCase();
  const suspicious = scamPatterns.filter((pattern) => pattern.test(value)).length;
  const trustedHandle = trustedUpiHandles.some((handle) => value.includes(handle));

  if (suspicious >= 2 || (!trustedHandle && value.includes("@"))) {
    return {
      level: "high",
      title: "Unsafe Transaction Pattern",
      reason: "UPI request resembles known scam formats or untrusted payment handle.",
      action: "Do not pay. Verify receiver from official bank contact.",
    };
  }
  if (suspicious >= 1) {
    return {
      level: "medium",
      title: "Suspicious Transaction",
      reason: "Message contains scam indicators used in rural banking fraud.",
      action: "Pause transaction and confirm with known contact.",
    };
  }
  return {
    level: "low",
    title: "Likely Safe",
    reason: "No high-risk UPI scam patterns detected.",
    action: "Proceed carefully and re-check payee details.",
  };
};

export const speakAlert = (text: string, enabled: boolean) => {
  if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};
