import { useMemo, useState } from "react";
import { Mail, Search, AlertTriangle, Shield, Phone, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appendTrustEvent, loadTrustChain } from "@/lib/adaptive-framework";

const DataBreach = () => {
  const [email, setEmail] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [breachesFound, setBreachesFound] = useState(0);
  const chain = useMemo(() => loadTrustChain(), [scanComplete]);

  const checkForBreaches = async () => {
    if (!email) return;
    
    setIsScanning(true);
    setScanComplete(false);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Random result for demo
    const randomBreaches = Math.random() > 0.6 ? Math.floor(Math.random() * 3) + 1 : 0;
    setBreachesFound(randomBreaches);
    appendTrustEvent("breach_check", `${email} => ${randomBreaches}`, randomBreaches > 0 ? "high" : "low");
    setIsScanning(false);
    setScanComplete(true);
  };

  const isValidEmail = (email: string) => {
    return email.includes('@') && email.includes('.');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Emergency Help & Trust Ledger</h1>
          <p className="text-muted-foreground">
            Rapid response for rural banking fraud and blockchain-backed trust evidence
          </p>
        </div>

        <div className="glass-card p-8 rounded-lg">
          {!isScanning && !scanComplete && (
            <div className="space-y-6">
              <div className="flex justify-center mb-6">
                <Mail size={64} className="text-primary" />
              </div>
              
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-center text-lg"
                />
                <Button 
                  onClick={checkForBreaches}
                  disabled={!isValidEmail(email)}
                  className="w-full glow-button text-white font-semibold py-4 text-lg"
                >
                  <Search className="mr-2" size={20} />
                  Check for Breaches
                </Button>
              </div>
            </div>
          )}

          {isScanning && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <Search size={64} className="text-primary animate-pulse" />
              </div>
              <div className="animate-pulse">
                <h3 className="text-xl font-semibold mb-2">Scanning for breaches...</h3>
                <p className="text-muted-foreground">
                  Searching for {email} in known data breaches...
                </p>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-pulse"></div>
              </div>
            </div>
          )}

          {scanComplete && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                {breachesFound === 0 ? (
                  <Shield size={64} className="text-green-500" />
                ) : (
                  <AlertTriangle size={64} className="text-red-500" />
                )}
              </div>
              
              <div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  breachesFound === 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {breachesFound === 0 ? 'No breaches found' : `${breachesFound} Breach${breachesFound > 1 ? 'es' : ''} found`}
                </h3>
                <p className="text-muted-foreground">
                  {breachesFound === 0 
                    ? 'Your email was not found in any known data breaches.'
                    : `Your email was found in ${breachesFound} recent data breach${breachesFound > 1 ? 'es' : ''}. Consider changing your passwords.`
                  }
                </p>
              </div>

              <div className="space-y-3">
                <div className="glass-card p-3 rounded-lg text-left">
                  <p className="font-semibold flex items-center gap-2"><Phone size={16} />Emergency steps</p>
                  <p className="text-sm text-muted-foreground mt-1">1) Freeze account in bank app. 2) Call bank helpline. 3) Report cyber fraud immediately.</p>
                  <p className="text-sm text-muted-foreground">India Cyber Helpline: 1930</p>
                </div>
                <div className="glass-card p-3 rounded-lg text-left">
                  <p className="font-semibold flex items-center gap-2"><Link2 size={16} />Blockchain trust ledger</p>
                  <p className="text-sm text-muted-foreground mt-1">Tamper-evident security events recorded: {chain.length}</p>
                </div>
                <Button 
                  onClick={() => {
                    setScanComplete(false);
                    setEmail("");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Check Another Email
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataBreach;