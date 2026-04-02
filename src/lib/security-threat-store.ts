import { appendTrustEvent, type RiskLevel } from "@/lib/adaptive-framework";

export type ThreatSeverity = "safe" | "warning" | "critical";

export interface SecurityThreatEvent {
  id: string;
  timestamp: string;
  feature: string;
  eventType: string;
  severity: ThreatSeverity;
  message: string;
  details?: string[];
}

const THREAT_STORE_KEY = "defenxia-security-threat-store";

const severityToRiskLevel = (severity: ThreatSeverity): RiskLevel => {
  if (severity === "critical") {
    return "high";
  }

  if (severity === "warning") {
    return "medium";
  }

  return "low";
};

export const loadSecurityThreatEvents = (): SecurityThreatEvent[] => {
  const raw = localStorage.getItem(THREAT_STORE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as SecurityThreatEvent[];
  } catch {
    return [];
  }
};

export const logSecurityThreatEvent = (
  input: Omit<SecurityThreatEvent, "id" | "timestamp">,
): SecurityThreatEvent => {
  const event: SecurityThreatEvent = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    ...input,
  };

  const current = loadSecurityThreatEvents();
  localStorage.setItem(THREAT_STORE_KEY, JSON.stringify([event, ...current]));

  const detailsText = event.details?.length ? ` [${event.details.join(", ")}]` : "";
  appendTrustEvent(
    `${event.feature}:${event.eventType}`,
    `${event.message}${detailsText}`,
    severityToRiskLevel(event.severity),
  );

  return event;
};
