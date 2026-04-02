import { EyeOff, MonitorOff, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { logSecurityThreatEvent } from "@/lib/security-threat-store";
import { cn } from "@/lib/utils";

import { useState } from "react";

const AntiScamKillSwitch = () => {
  const [isProtectionActive, setIsProtectionActive] = useState(false);

  const onProtectionToggle = (checked: boolean) => {
    setIsProtectionActive(checked);

    if (checked) {
      logSecurityThreatEvent({
        feature: "anti-scam-kill-switch",
        eventType: "screen-privacy-shield-activated",
        severity: "warning",
        message: "Screen Privacy Shield activated for secure banking.",
        details: ["screen-sharing-block", "recording-block", "otp-visibility-protected"],
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-5xl space-y-6">
        <Card className="glass-card border border-primary/25">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-3xl">
              <ShieldAlert className="h-7 w-7 text-primary drop-shadow-[0_0_12px_hsl(var(--primary))]" />
              Anti-Scam Kill-Switch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Activate Screen Privacy Shield to reduce scam exposure during sensitive banking actions.
            </p>

            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-secondary/30 p-4">
              <div>
                <p className="text-lg font-semibold">Screen Privacy Shield</p>
                <p className="text-sm text-muted-foreground">Simulates screen-share and recording protection lock.</p>
              </div>
              <Switch checked={isProtectionActive} onCheckedChange={onProtectionToggle} />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border border-border/70">
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "rounded-xl border p-4 text-lg font-semibold",
                isProtectionActive
                  ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                  : "border-amber-400/40 bg-amber-500/10 text-amber-100",
              )}
            >
              {isProtectionActive ? "Protection Active" : "Protection Inactive"}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border border-border/70">
          <CardHeader>
            <CardTitle>How it Protects You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/70 bg-secondary/25 p-4">
                <p className="font-semibold">Blocks AnyDesk / TeamViewer</p>
                <p className="mt-1 text-sm text-muted-foreground">Reduces remote-control scam attack surface during transactions.</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-secondary/25 p-4">
                <p className="font-semibold">Prevents Screen Recording</p>
                <p className="mt-1 text-sm text-muted-foreground">Helps mask high-sensitivity screens in active banking sessions.</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-secondary/25 p-4">
                <p className="font-semibold">Protects OTP Visibility</p>
                <p className="mt-1 text-sm text-muted-foreground">Limits visual leakage when one-time passwords appear on screen.</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-secondary/25 p-4">
                <p className="font-semibold">Secures Banking App Usage</p>
                <p className="mt-1 text-sm text-muted-foreground">Maintains a focused and controlled environment for payments and transfers.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isProtectionActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="mx-4 max-w-2xl rounded-3xl border border-primary/35 bg-background/90 p-8 text-center shadow-[0_0_80px_rgba(88,101,242,0.35)]">
            <div className="mx-auto mb-4 w-fit rounded-full border border-primary/35 bg-primary/15 p-4">
              <MonitorOff className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Screen Privacy Shield Active</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Screen sharing and recording are now blocked in this protected simulation.
            </p>
            <p className="mt-2 text-sm text-foreground/80">
              Keep OTP and account details private while performing banking operations.
            </p>
            <button
              type="button"
              onClick={() => setIsProtectionActive(false)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/20 px-5 py-2.5 font-semibold text-primary transition hover:bg-primary/30"
            >
              <EyeOff className="h-4 w-4" /> Dismiss Shield Overlay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AntiScamKillSwitch;
