import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { appendTrustEvent } from "@/lib/adaptive-framework";

const steps = [
  "Step 1 (15s): Open dashboard and show adaptive trust score + secure mode toggle.",
  "Step 2 (20s): Run Phishing Link Check with a suspicious banking URL.",
  "Step 3 (20s): Open OTP Protection and paste scam SMS (KYC/urgent/OTP).",
  "Step 4 (15s): Run WiFi Safety to show unsafe network advisory.",
  "Step 5 (20s): Open Report & Analysis to show adaptive score + trust-chain event count.",
];

const DemoMode = () => {
  const navigate = useNavigate();

  const startDemo = () => {
    appendTrustEvent("judge_demo_started", "90-second guided demo started", "low");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Judge Demo Mode (90 seconds)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Use this guided flow to demonstrate Trust, Security, Accessibility, and Blockchain-backed evidence.
            </p>
            <div className="space-y-2">
              {steps.map((step) => (
                <div key={step} className="rounded-lg border border-border p-3 text-sm">
                  {step}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button onClick={startDemo} className="glow-button text-white">
                Start Guided Demo
              </Button>
              <Button variant="outline" onClick={() => navigate("/report-analysis")}>
                Open Impact Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DemoMode;
