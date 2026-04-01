import { useState } from "react";
import { Send, Bot, User, Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { invokeEdgeFunction } from "@/lib/supabase-client";
import { appendTrustEvent } from "@/lib/adaptive-framework";
import { toast } from "sonner";

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [key: number]: {
      [key: number]: { transcript: string };
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIAnalysis = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI security analyst. I can help you with cybersecurity questions, threat analysis, and security best practices. How can I assist you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [retryingMic, setRetryingMic] = useState(false);
  const [micUnavailable, setMicUnavailable] = useState(false);

  const getOfflineFraudResponse = (input: string): string => {
    const q = input.toLowerCase();
    if (q.includes("otp")) return "Never share OTP, UPI PIN, CVV, or ATM PIN. Banks never ask these details on calls/messages.";
    if (q.includes("link") || q.includes("url")) return "If URL has unknown domain, extra subdomain, or urgent claim, treat it as phishing and avoid opening.";
    if (q.includes("call")) return "If caller asks for remote app install, screen share, or account verify, disconnect and call official bank helpline.";
    if (q.includes("wifi")) return "Avoid banking on open WiFi. Use mobile data or trusted WPA2/WPA3 network before transactions.";
    return "Use Secure Banking Mode, verify messages via official bank app, and report suspicious activity immediately.";
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await invokeEdgeFunction('ai-analysis', {
        message: inputMessage
      });

      if (error) {
        throw new Error(error.message || 'Failed to get AI response');
      }

      const aiResponse = data?.response || 'I apologize, but I encountered an error processing your request.';
      appendTrustEvent("ai_assistant_query", inputMessage.slice(0, 80), "low");

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const offline = getOfflineFraudResponse(inputMessage);
      appendTrustEvent("ai_assistant_offline", inputMessage.slice(0, 80), "medium");
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Offline Fraud Assistant: ${offline}`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    }

    setIsLoading(false);
  };

  const handleMicInput = () => {
    if (micUnavailable) {
      toast.message("Mic voice service unavailable in this session. Please type your question.");
      return;
    }

    if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      toast.error("Mic speech is not supported in this browser.");
      setMicUnavailable(true);
      return;
    }

    if (!navigator.onLine) {
      toast.error("Internet is offline. Voice-to-text needs connection in this browser.");
      setMicUnavailable(true);
      return;
    }

    const startRecognition = (lang: string, isRetry = false) => {
      const instance = new SpeechRecognitionCtor();
      instance.continuous = false;
      instance.interimResults = true;
      instance.lang = lang;

      instance.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputMessage(transcript.trim());
      };

      instance.onerror = (event: SpeechRecognitionErrorEvent) => {
        const err = event.error;
        if (err === "network" && !isRetry) {
          setRetryingMic(true);
          setIsListening(false);
          toast.message("Mic network issue. Retrying once with fallback language...");
          setTimeout(() => {
            setRetryingMic(false);
            startRecognition("en-US", true);
          }, 250);
          return;
        }

        if (err === "network") {
          setMicUnavailable(true);
          toast.error("Voice service unreachable. Mic is disabled for this session. Please type your question.");
        } else if (err === "not-allowed") {
          setMicUnavailable(true);
          toast.error("Mic permission denied. Allow microphone access in browser settings.");
        } else {
          toast.error(`Mic error: ${err}`);
        }
        setIsListening(false);
      };

      instance.onend = () => {
        setIsListening(false);
      };

      setRecognition(instance);
      instance.start();
      setIsListening(true);
      toast.success("Listening... speak your security question.");
    };

    startRecognition("en-IN");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-3xl font-bold">AI Security Analysis</h1>
          <p className="text-muted-foreground">Get intelligent insights on cybersecurity threats and best practices</p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="flex-shrink-0">
                    {message.sender === 'ai' ? (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Bot size={16} className="text-primary" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <User size={16} className="text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === 'ai'
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot size={16} className="text-primary" />
                </div>
                <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about security threats, best practices, or get a vulnerability analysis..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleMicInput}
              disabled={isLoading || retryingMic || micUnavailable}
              variant={isListening ? "destructive" : "outline"}
              className="px-4"
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? <Square size={16} /> : <Mic size={16} />}
            </Button>
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-6"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;