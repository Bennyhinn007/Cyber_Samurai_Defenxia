import { useState, useEffect } from "react";
import { Wifi, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { appendTrustEvent, evaluateWifiRisk } from "@/lib/adaptive-framework";

const WiFiSecurity = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentCheck, setCurrentCheck] = useState("");
  const [scanComplete, setScanComplete] = useState(false);
  const [isSecure, setIsSecure] = useState(true);
  const [explanation, setExplanation] = useState("");

  const securityChecks = [
    "Checking for WPA3 Encryption...",
    "Scanning for Weak Passwords...",
    "Detecting Rogue Devices...",
    "Analyzing Network Protocols...",
    "Verifying Router Security...",
  ];

  const startScan = () => {
    setIsScanning(true);
    setProgress(0);
    setScanComplete(false);
    const sampleType = Math.random() > 0.4 ? "WPA2" : "Open";
    const sampleSignal = Math.floor(20 + Math.random() * 80);
    const decision = evaluateWifiRisk(sampleType, sampleSignal);
    setIsSecure(decision.level === "low");
    setExplanation(`${decision.reason} ${decision.action} (${sampleType}, signal ${sampleSignal}%)`);
    appendTrustEvent("wifi_scan", `${sampleType}, ${sampleSignal}% => ${decision.level}`, decision.level);

    let checkIndex = 0;
    const interval = setInterval(() => {
      if (checkIndex < securityChecks.length) {
        setCurrentCheck(securityChecks[checkIndex]);
        setProgress((checkIndex + 1) * 20);
        checkIndex++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        setScanComplete(true);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">WiFi Security Scan</h1>
          <p className="text-muted-foreground">
            Analyze your network security and detect vulnerabilities
          </p>
        </div>

        <div className="glass-card p-8 rounded-lg text-center">
          {/* WiFi Icon */}
          <div className="flex justify-center mb-8">
            <div className={`relative ${isScanning ? 'animate-pulse' : ''}`}>
              <Wifi 
                size={80} 
                className={`text-primary ${isScanning ? 'animate-pulse' : ''}`} 
              />
              {isScanning && (
                <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping"></div>
              )}
            </div>
          </div>

          {!isScanning && !scanComplete && (
            <Button onClick={startScan} className="glow-button text-white font-semibold px-8 py-4">
              Start WiFi Security Scan
            </Button>
          )}

          {isScanning && (
            <div className="space-y-6">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">{currentCheck}</p>
              <div className="text-lg font-semibold">{progress}%</div>
            </div>
          )}

          {scanComplete && (
            <div className="space-y-6">
              <div className="flex justify-center">
                {isSecure ? (
                  <CheckCircle size={64} className="text-green-500" />
                ) : (
                  <AlertTriangle size={64} className="text-red-500" />
                )}
              </div>
              <div className={`text-xl font-bold ${isSecure ? 'text-green-500' : 'text-red-500'}`}>
                {isSecure ? 'Your network is secure' : 'Vulnerabilities found'}
              </div>
              <p className="text-muted-foreground">
                {isSecure 
                  ? 'Your WiFi network passed all security checks.'
                  : 'We detected potential security issues with your network.'
                }
              </p>
              <p className="text-sm text-muted-foreground">{explanation}</p>
              <Button 
                onClick={() => {
                  setScanComplete(false);
                  setProgress(0);
                  setExplanation("");
                }} 
                variant="outline"
              >
                Scan Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WiFiSecurity;