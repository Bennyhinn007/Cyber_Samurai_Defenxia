import { useState } from "react";
import { AlertTriangle, PhoneCall, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { logSecurityThreatEvent } from "@/lib/security-threat-store";

const CyberSanchaarShield = () => {
  const [monitoringEnabled, setMonitoringEnabled] = useState(true);
  const [isCallDetected, setIsCallDetected] = useState(false);

  const triggerCallDetected = () => {
    setIsCallDetected(true);
    logSecurityThreatEvent({
      feature: "cyber-sanchaar-shield",
      eventType: "call-detected-during-banking",
      severity: "critical",
      message: "Incoming call detected during active banking session.",
      details: ["otp-social-engineering-risk", "voice-phishing-risk"],
    });
  };

  const dismissWarning = () => {
    setIsCallDetected(false);
  };

  return (
    <div className="relative min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-5xl space-y-6">
        <Card className="glass-card border border-primary/25">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-3xl">
              <PhoneCall className="h-7 w-7 text-primary drop-shadow-[0_0_12px_hsl(var(--primary))]" />
              Cyber-Sanchaar Shield
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-muted-foreground">
              Monitor calls during banking sessions and trigger emergency warnings against social engineering scams.
            </p>

            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-secondary/30 p-4">
              <div>
                <p className="font-semibold">Call Monitoring During Banking</p>
                <p className="text-sm text-muted-foreground">Detect suspicious incoming calls in active transaction windows.</p>
              </div>
              <Switch checked={monitoringEnabled} onCheckedChange={setMonitoringEnabled} />
            </div>

            <Button
              onClick={triggerCallDetected}
              disabled={!monitoringEnabled}
              className="glow-button text-white"
            >
              Simulate Call Detection
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card border border-border/70">
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-secondary/25 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Phone State</p>
              <p className="mt-2 text-lg font-semibold">
                {isCallDetected ? "Suspicious Call Detected" : monitoringEnabled ? "Monitoring Active" : "Monitoring Disabled"}
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-secondary/25 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Banking App State</p>
              <p className="mt-2 text-lg font-semibold">{isCallDetected ? "High Risk - User Attention Required" : "Protected Session"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border border-red-400/30 bg-red-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-200">
              <ShieldAlert className="h-5 w-5" /> Critical Advisory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-100">
              No bank employee should ever ask for PIN, OTP, or CVV on a phone call. End the call immediately and contact your bank using official channels.
            </p>
          </CardContent>
        </Card>
      </div>

      {isCallDetected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/90 p-4 animate-[pulse_1s_ease-in-out_infinite]">
          <div className="w-full max-w-2xl rounded-3xl border border-red-300/60 bg-red-900/80 p-8 text-center shadow-[0_0_80px_rgba(239,68,68,0.45)]">
            <div className="mx-auto mb-4 w-fit rounded-full border border-red-300/60 bg-red-500/25 p-4">
              <AlertTriangle className="h-10 w-10 text-red-100" />
            </div>
            <h2 className="text-3xl font-bold text-red-100">Emergency Scam Warning</h2>
            <p className="mt-3 text-lg text-red-50">
              Call detected while banking. Never share PIN, OTP, or CVV with anyone.
            </p>
            <p className="mt-2 text-sm text-red-100/90">
              A legitimate bank representative will never request confidential transaction credentials by phone.
            </p>
            <Button
              onClick={dismissWarning}
              className="mt-6 border border-red-200/50 bg-red-100/20 text-red-50 hover:bg-red-100/30"
            >
              Dismiss Warning
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CyberSanchaarShield;
