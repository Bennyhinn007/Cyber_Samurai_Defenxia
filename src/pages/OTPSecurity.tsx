import { useState } from "react";
import { Key, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLanguage, appendTrustEvent, detectSmsFraud, getAdaptiveGuidance } from "@/lib/adaptive-framework";

const OTPSecurity = () => {
  const [sampleMessage, setSampleMessage] = useState("");
  const [result, setResult] = useState<null | { level: "low" | "medium" | "high"; reason: string; action: string }>(null);
  const [language, setLanguage] = useState<AppLanguage>("en");
  const guidance = getAdaptiveGuidance(language);

  const analyzeMessage = () => {
    if (!sampleMessage.trim()) return;
    const verdict = detectSmsFraud(sampleMessage);
    setResult(verdict);
    appendTrustEvent("otp_sms_analysis", sampleMessage.slice(0, 60), verdict.level);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Banking OTP Protection</h1>
          <p className="text-muted-foreground">
            Detect OTP scam messages and prevent account takeover attempts
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Button size="sm" variant={language === "en" ? "default" : "outline"} onClick={() => setLanguage("en")}>English</Button>
            <Button size="sm" variant={language === "hi" ? "default" : "outline"} onClick={() => setLanguage("hi")}>हिंदी</Button>
            <Button size="sm" variant={language === "kn" ? "default" : "outline"} onClick={() => setLanguage("kn")}>ಕನ್ನಡ</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="text-primary" size={24} />
                SMS Fraud Check
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                type="text"
                placeholder="Paste suspicious SMS message"
                value={sampleMessage}
                onChange={(e) => setSampleMessage(e.target.value)}
              />
              <Button onClick={analyzeMessage} className="w-full glow-button text-white font-semibold">
                Analyze Message
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="text-primary" size={24} />
                Safety Advisory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-secondary/40 border border-border">
                <p className="font-semibold mb-2">{guidance.doNotShareOtp}</p>
                <p className="text-sm text-muted-foreground">
                  Bank never asks OTP or UPI PIN through calls, SMS, WhatsApp, or screen-sharing apps.
                </p>
              </div>
              {result && (
                <div className={`p-4 rounded-lg border ${
                  result.level === "high"
                    ? "bg-red-500/20 text-red-300 border-red-500/40"
                    : result.level === "medium"
                    ? "bg-yellow-500/20 text-yellow-200 border-yellow-500/40"
                    : "bg-green-500/20 text-green-200 border-green-500/40"
                }`}>
                  <div className="flex items-center gap-2 font-semibold mb-2">
                    <AlertTriangle size={16} />
                    Risk: {result.level.toUpperCase()}
                  </div>
                  <p className="text-sm mb-1"><strong>Why flagged:</strong> {result.reason}</p>
                  <p className="text-sm"><strong>What to do:</strong> {result.action}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OTPSecurity;