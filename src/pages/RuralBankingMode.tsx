import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appendTrustEvent, getAdaptiveGuidance, loadTrustChain, AppLanguage } from "@/lib/adaptive-framework";
import {
  RuralPersona,
  checkUpiTransactionSafety,
  getPersonaGuidance,
  getPersonaLabel,
  speakAlert,
} from "@/lib/rural-banking";
import { Badge } from "@/components/ui/badge";

const RuralBankingMode = () => {
  const [persona, setPersona] = useState<RuralPersona>("new_user");
  const [language, setLanguage] = useState<AppLanguage>("en");
  const [voiceAlert, setVoiceAlert] = useState(true);
  const [transactionInput, setTransactionInput] = useState("");
  const [lastResult, setLastResult] = useState<ReturnType<typeof checkUpiTransactionSafety> | null>(null);
  const trustEvents = useMemo(() => loadTrustChain(), [lastResult]);
  const guide = getAdaptiveGuidance(language);

  const runCheck = () => {
    if (!transactionInput.trim()) return;
    const verdict = checkUpiTransactionSafety(transactionInput);
    setLastResult(verdict);
    appendTrustEvent("upi_transaction_check", `${transactionInput.slice(0, 80)} => ${verdict.level}`, verdict.level);
    speakAlert(`${verdict.title}. ${verdict.action}`, voiceAlert);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Rural Banking Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Persona-based safety mode for low-connectivity and first-time digital banking users.
            </p>
            <div className="flex flex-wrap gap-2">
              {(["new_user", "senior_citizen", "small_merchant"] as RuralPersona[]).map((mode) => (
                <Button
                  key={mode}
                  size="sm"
                  variant={persona === mode ? "default" : "outline"}
                  onClick={() => setPersona(mode)}
                >
                  {getPersonaLabel(mode)}
                </Button>
              ))}
            </div>
            <p className="text-sm">{getPersonaGuidance(persona)}</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant={language === "en" ? "default" : "outline"} onClick={() => setLanguage("en")}>English</Button>
              <Button size="sm" variant={language === "hi" ? "default" : "outline"} onClick={() => setLanguage("hi")}>हिंदी</Button>
              <Button size="sm" variant={language === "kn" ? "default" : "outline"} onClick={() => setLanguage("kn")}>ಕನ್ನಡ</Button>
              <Button size="sm" variant={voiceAlert ? "default" : "outline"} onClick={() => setVoiceAlert((v) => !v)}>
                Voice Alerts: {voiceAlert ? "ON" : "OFF"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>UPI Pre-Transaction Shield</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={transactionInput}
              onChange={(e) => setTransactionInput(e.target.value)}
              placeholder="Paste UPI request text or payee ID"
            />
            <Button onClick={runCheck} className="glow-button text-white">Run Transaction Safety Check</Button>
            {lastResult && (
              <div className="rounded-lg border border-border p-3 space-y-1">
                <Badge>{lastResult.level.toUpperCase()}</Badge>
                <p className="font-semibold">{lastResult.title}</p>
                <p className="text-sm text-muted-foreground"><strong>Why:</strong> {lastResult.reason}</p>
                <p className="text-sm text-muted-foreground"><strong>Next:</strong> {lastResult.action}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Emergency Rural Fraud Playbook</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <p>1) Freeze account from bank app or call branch helpline.</p>
            <p>2) Report cyber fraud immediately on 1930.</p>
            <p>3) Do not delete scam SMS/call logs; keep evidence.</p>
            <p>4) Change UPI PIN and banking passwords.</p>
            <p className="pt-2 font-semibold text-foreground">{guide.doNotShareOtp}</p>
            <p>Trust log entries recorded (offline-ready): {trustEvents.length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RuralBankingMode;
