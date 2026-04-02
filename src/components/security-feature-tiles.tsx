import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MessageSquareWarning, PhoneCall, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface BankingSecurityFeature {
  title: "AI SMS Shield" | "Anti-Scam Kill-Switch" | "Cyber-Sanchaar Shield";
  path: "/ai-sms-shield" | "/anti-scam-kill-switch" | "/cyber-sanchaar-shield";
  icon: LucideIcon;
}

export const bankingSecurityFeatures: BankingSecurityFeature[] = [
  {
    title: "AI SMS Shield",
    path: "/ai-sms-shield",
    icon: MessageSquareWarning,
  },
  {
    title: "Anti-Scam Kill-Switch",
    path: "/anti-scam-kill-switch",
    icon: ShieldAlert,
  },
  {
    title: "Cyber-Sanchaar Shield",
    path: "/cyber-sanchaar-shield",
    icon: PhoneCall,
  },
];

interface SecurityFeatureTilesProps {
  onNavigate: (path: BankingSecurityFeature["path"]) => void;
  className?: string;
}

export const SecurityFeatureTiles = ({ onNavigate, className }: SecurityFeatureTilesProps) => {
  return (
    <section className={cn("w-full", className)}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {bankingSecurityFeatures.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <button
              key={feature.path}
              type="button"
              onClick={() => onNavigate(feature.path)}
              className="group w-full text-left"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <Card
                className={cn(
                  "glass-card h-52 w-full rounded-3xl border border-primary/15",
                  "transition-all duration-300 ease-out",
                  "hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_35px_hsl(var(--primary)_/_0.25)]",
                  "animate-fade-in",
                )}
              >
                <CardContent className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
                  <div
                    className={cn(
                      "rounded-2xl border border-primary/30 bg-primary/10 p-4",
                      "transition-transform duration-300 group-hover:scale-110",
                    )}
                  >
                    <Icon className="h-8 w-8 text-primary drop-shadow-[0_0_14px_hsl(var(--primary))]" />
                  </div>
                  <h3 className="text-3xl font-semibold leading-tight tracking-tight text-foreground">
                    {feature.title}
                  </h3>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
    </section>
  );
};
