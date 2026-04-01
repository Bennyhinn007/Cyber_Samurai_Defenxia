import { useNavigate } from "react-router-dom";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { QuickActionButton } from "@/components/quick-action-button";
import { Button } from "@/components/ui/button";
import { invokeEdgeFunction } from "@/lib/supabase-client";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AppLanguage,
  appendTrustEvent,
  calculateTrustScore,
  getAdaptiveGuidance,
  loadTrustChain,
} from "@/lib/adaptive-framework";
import { 
  QrCode, 
  Wifi,
  Globe, 
  Shield, 
  ShieldAlert,
  Settings,
  Brain, 
  ShieldCheck,
  Search,
  Siren
} from "lucide-react";

const quickActions = [
  { icon: QrCode, label: "Scan QR Payment", path: "/qr-scanner" },
  { icon: ShieldAlert, label: "SMS Fraud Shield", path: "/report-analysis" },
  { icon: Globe, label: "Phishing Link Check", path: "/website-scanner" },
  { icon: Shield, label: "OTP Protection", path: "/otp-security" },
  { icon: ShieldCheck, label: "Secure Banking Mode", path: "/firewall" },
  { icon: Wifi, label: "WiFi Safety", path: "/wifi-security" },
  { icon: Settings, label: "Permission Risk", path: "/app-permissions" },
  { icon: Brain, label: "AI Fraud Assistant", path: "/ai-analysis" },
  { icon: Siren, label: "Rural Banking Mode", path: "/rural-banking-mode" },
];

const Homepage = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [secureMode, setSecureMode] = useState(true);
  const [language, setLanguage] = useState<AppLanguage>("en");
  const trustChain = useMemo(() => loadTrustChain(), []);
  const trustScore = calculateTrustScore({
    hasWeakNetwork: false,
    suspiciousSmsCount: 1,
    suspiciousLinkCount: 1,
    riskyPermissionsCount: 1,
    secureModeEnabled: secureMode,
    selectedLanguage: language,
  });
  const guide = getAdaptiveGuidance(language);

  const handleComprehensiveScan = async () => {
    setIsScanning(true);
    try {
      const { data, error } = await invokeEdgeFunction('comprehensive-scan', {
        target: window.location.hostname || 'current-device',
        scanType: 'device'
      });

      if (error) {
        console.error('Comprehensive scan error:', error);
        toast.error('Failed to perform comprehensive scan');
      } else {
        console.log('Comprehensive scan results:', data);
        appendTrustEvent("scan_completed", "Secure banking scan completed", "low");
        toast.success('Comprehensive scan completed successfully');
        // Navigate to results page or show results modal
        navigate('/scanning', { state: { scanResults: data } });
      }
    } catch (err) {
      console.error('Scan error:', err);
      toast.error('Error performing comprehensive scan');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-indigo-500/25 to-purple-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="gradient-wave"></div>
        <div className="floating-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
        </div>
        <div className="absolute top-1/2 left-10 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/4 right-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-70" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-1/3 right-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce opacity-50" style={{ animationDelay: '2.5s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <p className="text-muted-foreground text-lg mb-2">
            Adaptive Cybersecurity Framework for Rural Digital Banking
          </p>
          <p className="text-muted-foreground text-sm">
            Trust + Security + Accessibility
          </p>
          <div className="flex justify-center gap-2 mt-3">
            <Button size="sm" variant={language === "en" ? "default" : "outline"} onClick={() => setLanguage("en")}>
              English
            </Button>
            <Button size="sm" variant={language === "hi" ? "default" : "outline"} onClick={() => setLanguage("hi")}>
              हिंदी
            </Button>
            <Button size="sm" variant={language === "kn" ? "default" : "outline"} onClick={() => setLanguage("kn")}>
              ಕನ್ನಡ
            </Button>
          </div>
        </div>

        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Banking Protection Dashboard</h2>
          <div className="mx-auto mb-6 max-w-xl glass-card rounded-xl px-4 py-3 border border-primary/25">
            <p className="text-base font-semibold">
              Secure Environment:
              <span className={secureMode ? "text-green-400 ml-2" : "text-red-400 ml-2"}>
                {secureMode ? "ON" : "OFF"}
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Turn ON before UPI, net banking, or payment app usage.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <ProgressCircle percentage={trustScore} subtitle="Trusted banking device posture" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleComprehensiveScan}
              disabled={isScanning}
              className="glow-button text-white font-semibold px-8 py-4 text-lg rounded-full min-w-[280px]"
            >
              {isScanning ? "Scanning..." : "Start Secure Banking Scan"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSecureMode((prev) => {
                  const next = !prev;
                  appendTrustEvent("secure_mode_toggle", `Secure mode ${next ? "enabled" : "disabled"}`, next ? "low" : "medium");
                  return next;
                });
              }}
              className="font-semibold px-8 py-4 text-lg rounded-full min-w-[220px]"
            >
              {secureMode ? "Disable Secure Mode" : "Enable Secure Mode"}
            </Button>
          </div>
        </div>

        <div className="animate-fade-in">
          <h3 className="text-2xl font-semibold mb-6 text-center">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
            {quickActions.map((action, index) => (
              <div
                key={action.label}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <QuickActionButton
                  icon={action.icon}
                  label={action.label}
                  onClick={() => navigate(action.path)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8 glass-card rounded-xl p-4 border border-primary/20">
          <div className="text-sm text-muted-foreground text-center space-y-1">
            <p>Offline-ready threat checks, fraud awareness guidance, and simple large-button design for rural accessibility.</p>
            <p>{guide.doNotShareOtp}</p>
            <p>Blockchain trust events recorded: <span className="text-foreground font-semibold">{trustChain.length}</span></p>
            <div className="pt-2">
              <Button onClick={() => navigate("/demo-mode")} className="glow-button text-white">
                Open Judge Demo Mode (90 sec)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;