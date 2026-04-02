import { useMemo, useState } from "react";
import { AlertCircle, Bot, MessageSquareWarning, Send, User } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { logSecurityThreatEvent, type ThreatSeverity } from "@/lib/security-threat-store";
import { cn } from "@/lib/utils";

type Severity = ThreatSeverity;

interface ScanResult {
  id: string;
  text: string;
  severity: Severity;
  matchedKeywords: string[];
  analysis: string;
  isFraud: boolean;
  scannedAt: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

const SCAM_KEYWORDS = [
  "kyc",
  "otp",
  "verify your account",
  "account blocked",
  "share otp",
  "click here",
  "cvv",
  "card number",
  "urgent action",
  "verify now",
  "suspend",
  "upi collect",
  "pin",
  "reward",
];

const AI_SMS_SHIELD_GUIDANCE =
  "Banks never ask for OTP, PIN, CVV, or card number over SMS, call, or chat. Treat urgency as a scam signal.";

const findMatchedKeywords = (text: string): string[] => {
  const source = text.toLowerCase();
  return SCAM_KEYWORDS.filter((keyword) => source.includes(keyword));
};

const analyzeSmsText = (text: string): ScanResult => {
  const matchedKeywords = findMatchedKeywords(text);
  const hitCount = matchedKeywords.length;

  let severity: Severity = "safe";
  let analysis = "No strong scam indicators were detected in this message.";

  if (hitCount >= 3 || matchedKeywords.includes("share otp") || matchedKeywords.includes("cvv")) {
    severity = "critical";
    analysis =
      "This message strongly resembles a banking scam. Do not click links or share any codes. Contact your bank from the official app or helpline.";
  } else if (hitCount >= 1) {
    severity = "warning";
    analysis =
      "This message contains suspicious language. Verify the request from your official banking app before taking action.";
  }

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    text,
    severity,
    matchedKeywords,
    analysis,
    isFraud: severity !== "safe",
    scannedAt: new Date().toLocaleTimeString(),
  };
};

const severityBadgeClass: Record<Severity, string> = {
  safe: "bg-emerald-500/20 text-emerald-200 border-emerald-400/40",
  warning: "bg-amber-500/20 text-amber-200 border-amber-400/40",
  critical: "bg-red-500/20 text-red-200 border-red-400/40",
};

const AISMSShield = () => {
  const [smsInput, setSmsInput] = useState("");
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "AI SMS Shield is online. Paste suspicious messages, ask for scam guidance, or get instant banking safety recommendations.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const latestResult = scanResults[0] ?? null;

  const sendChatMessage = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || isReplying) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}`,
      sender: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsReplying(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    const response = getAssistantResponse(trimmed);
    const aiMessage: ChatMessage = {
      id: `${Date.now()}-ai`,
      sender: "ai",
      text: response,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, aiMessage]);
    setIsReplying(false);
  };

  const scanSms = () => {
    const trimmed = smsInput.trim();
    if (!trimmed) {
      return;
    }

    const result = analyzeSmsText(trimmed);
    setScanResults((prev) => [result, ...prev].slice(0, 6));

    if (result.isFraud) {
      logSecurityThreatEvent({
        feature: "ai-sms-shield",
        eventType: "sms-fraud-detected",
        severity: result.severity,
        message: `Suspicious SMS detected with severity ${result.severity}.`,
        details: result.matchedKeywords,
      });
    }
  };

  const threatSummary = useMemo(() => {
    const warningCount = scanResults.filter((result) => result.severity === "warning").length;
    const criticalCount = scanResults.filter((result) => result.severity === "critical").length;
    return { warningCount, criticalCount };
  }, [scanResults]);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-5xl space-y-6">
        <div className="glass-card rounded-2xl border border-primary/25 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3">
              <MessageSquareWarning className="h-7 w-7 text-primary drop-shadow-[0_0_10px_hsl(var(--primary))]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI SMS Shield</h1>
              <p className="mt-2 text-muted-foreground">
                Real-time SMS fraud triage with AI-assisted banking guidance.
              </p>
              <p className="mt-2 text-sm text-foreground/80">{AI_SMS_SHIELD_GUIDANCE}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="sms-scan" className="space-y-4">
          <TabsList className="grid h-auto w-full grid-cols-2 bg-secondary/50 p-1.5">
            <TabsTrigger value="sms-scan" className="py-2 text-base">SMS Scan</TabsTrigger>
            <TabsTrigger value="ai-chatbot" className="py-2 text-base">AI Chatbot</TabsTrigger>
          </TabsList>

          <TabsContent value="sms-scan" className="space-y-4">
            <Card className="glass-card border border-primary/20">
              <CardHeader>
                <CardTitle>Scan Suspicious SMS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={smsInput}
                  onChange={(event) => setSmsInput(event.target.value)}
                  placeholder="Paste suspicious SMS text here..."
                  className="min-h-32 bg-background/70"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Button onClick={scanSms} className="glow-button text-white">
                    Scan for Fraud
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Warnings: {threatSummary.warningCount} | Critical: {threatSummary.criticalCount}
                  </div>
                </div>
              </CardContent>
            </Card>

            {latestResult?.isFraud && (
              <Alert variant="destructive" className="border-red-400/40 bg-red-500/10">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Fraud warning raised</AlertTitle>
                <AlertDescription>
                  High-risk scam language detected. Avoid sharing OTP/PIN/CVV and verify this message only from official banking channels.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4">
              {scanResults.map((result) => (
                <Card key={result.id} className="glass-card border border-border/70">
                  <CardContent className="space-y-4 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize", severityBadgeClass[result.severity])}>
                        {result.severity}
                      </span>
                      <span className="text-xs text-muted-foreground">Scanned at {result.scannedAt}</span>
                    </div>

                    <p className="text-sm text-foreground/90">{result.analysis}</p>

                    <div className="rounded-lg border border-border/70 bg-secondary/25 p-3">
                      <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Matched Keywords</p>
                      {result.matchedKeywords.length ? (
                        <div className="flex flex-wrap gap-2">
                          {result.matchedKeywords.map((keyword) => (
                            <span
                              key={`${result.id}-${keyword}`}
                              className="inline-flex rounded-full border border-primary/35 bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No scam keywords matched.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-chatbot" className="space-y-4">
            <Card className="glass-card border border-primary/20">
              <CardHeader>
                <CardTitle>AI Chatbot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[420px] rounded-xl border border-border/70 bg-background/70 p-4">
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl border px-4 py-3",
                            message.sender === "user"
                              ? "border-primary/40 bg-primary/20"
                              : "border-border/70 bg-secondary/35",
                          )}
                        >
                          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                            {message.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                            <span>{message.sender === "user" ? "You" : "AI Assistant"}</span>
                            <span>{message.timestamp}</span>
                          </div>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
                        </div>
                      </div>
                    ))}

                    {isReplying && (
                      <div className="flex justify-start">
                        <div className="rounded-2xl border border-border/70 bg-secondary/35 px-4 py-3 text-sm text-muted-foreground">
                          AI assistant is reviewing your query...
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/80 p-2">
                  <Textarea
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void sendChatMessage();
                      }
                    }}
                    placeholder="Ask about suspicious calls, fake KYC alerts, OTP safety, or payment scams..."
                    className="min-h-10 resize-none border-0 bg-transparent focus-visible:ring-0"
                  />
                  <Button onClick={() => void sendChatMessage()} disabled={isReplying} className="glow-button text-white">
                    <Send className="mr-1 h-4 w-4" /> Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const getAssistantResponse = (input: string): string => {
  const query = input.toLowerCase();

  if (query.includes("otp") || query.includes("pin") || query.includes("cvv")) {
    return "No genuine bank employee will ever ask for OTP, PIN, or CVV. If someone asks, stop immediately and report the interaction.";
  }

  if (query.includes("kyc") || query.includes("account blocked") || query.includes("verify")) {
    return "KYC scam alerts usually force urgency and push fake links. Open your official banking app and verify notifications there, not from SMS links.";
  }

  if (query.includes("link") || query.includes("click")) {
    return "Before opening a link, verify domain spelling, HTTPS certificate, and message context. Unknown short links in SMS should be treated as phishing.";
  }

  if (query.includes("call") || query.includes("screen share") || query.includes("anydesk") || query.includes("teamviewer")) {
    return "Remote-access scams use calls to pressure victims into installing screen-share apps. Never install AnyDesk/TeamViewer for banking support.";
  }

  return "Best next step: do not act under pressure, verify via official bank channels, and keep OTP/PIN/CVV private. If uncertain, report immediately to your bank and cyber helpline.";
};

export default AISMSShield;
