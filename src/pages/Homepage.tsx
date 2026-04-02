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
  Siren,
  MessageSquareWarning,
  PhoneCall
} from "lucide-react";

const featuredQuickActions = [
  { icon: MessageSquareWarning, label: "AI SMS Shield", path: "/ai-sms-shield" },
  { icon: ShieldAlert, label: "Anti-Scam Kill-Switch", path: "/anti-scam-kill-switch" },
  { icon: PhoneCall, label: "Cyber-Sanchaar Shield", path: "/cyber-sanchaar-shield" },
];

const quickActions = [
  { icon: QrCode, labelKey: "scanQrPayment", path: "/qr-scanner" },
  { icon: ShieldAlert, labelKey: "smsFraudShield", path: "/report-analysis" },
  { icon: Globe, labelKey: "phishingLinkCheck", path: "/website-scanner" },
  { icon: Shield, labelKey: "otpProtection", path: "/otp-security" },
  { icon: ShieldCheck, labelKey: "secureBankingMode", path: "/firewall" },
  { icon: Wifi, labelKey: "wifiSafety", path: "/wifi-security" },
  { icon: Settings, labelKey: "permissionRisk", path: "/app-permissions" },
  { icon: Brain, labelKey: "aiFraudAssistant", path: "/ai-analysis" },
  { icon: Siren, labelKey: "ruralBankingMode", path: "/rural-banking-mode" },
];

const homepageTranslations: Record<AppLanguage, {
  title: string;
  subtitle: string;
  dashboardTitle: string;
  secureEnvironment: string;
  secureOn: string;
  secureOff: string;
  secureHint: string;
  trustPosture: string;
  scanning: string;
  startScan: string;
  disableSecureMode: string;
  enableSecureMode: string;
  quickActionsTitle: string;
  offlineLine: string;
  trustEvents: string;
  demoMode: string;
  scanFailed: string;
  scanCompleted: string;
  scanError: string;
  quickActions: Record<string, string>;
}> = {
  en: {
    title: "Adaptive Cybersecurity Framework for Rural Digital Banking",
    subtitle: "Trust + Security + Accessibility",
    dashboardTitle: "Banking Protection Dashboard",
    secureEnvironment: "Secure Environment:",
    secureOn: "ON",
    secureOff: "OFF",
    secureHint: "Turn ON before UPI, net banking, or payment app usage.",
    trustPosture: "Trusted banking device posture",
    scanning: "Scanning...",
    startScan: "Start Secure Banking Scan",
    disableSecureMode: "Disable Secure Mode",
    enableSecureMode: "Enable Secure Mode",
    quickActionsTitle: "Quick Actions",
    offlineLine: "Offline-ready threat checks, fraud awareness guidance, and simple large-button design for rural accessibility.",
    trustEvents: "Blockchain trust events recorded:",
    demoMode: "Open Judge Demo Mode (90 sec)",
    scanFailed: "Failed to perform comprehensive scan",
    scanCompleted: "Comprehensive scan completed successfully",
    scanError: "Error performing comprehensive scan",
    quickActions: {
      scanQrPayment: "Scan QR Payment",
      smsFraudShield: "SMS Fraud Shield",
      phishingLinkCheck: "Phishing Link Check",
      otpProtection: "OTP Protection",
      secureBankingMode: "Secure Banking Mode",
      wifiSafety: "WiFi Safety",
      permissionRisk: "Permission Risk",
      aiFraudAssistant: "AI Fraud Assistant",
      ruralBankingMode: "Rural Banking Mode",
    },
  },
  hi: {
    title: "ग्रामीण डिजिटल बैंकिंग के लिए अनुकूली साइबर सुरक्षा ढांचा",
    subtitle: "विश्वास + सुरक्षा + पहुंच",
    dashboardTitle: "बैंकिंग सुरक्षा डैशबोर्ड",
    secureEnvironment: "सुरक्षित वातावरण:",
    secureOn: "चालू",
    secureOff: "बंद",
    secureHint: "UPI, नेट बैंकिंग या भुगतान ऐप उपयोग से पहले इसे चालू करें।",
    trustPosture: "विश्वसनीय बैंकिंग डिवाइस स्थिति",
    scanning: "स्कैन हो रहा है...",
    startScan: "सुरक्षित बैंकिंग स्कैन शुरू करें",
    disableSecureMode: "सुरक्षित मोड बंद करें",
    enableSecureMode: "सुरक्षित मोड चालू करें",
    quickActionsTitle: "त्वरित क्रियाएं",
    offlineLine: "ऑफलाइन तैयार खतरा जांच, धोखाधड़ी जागरूकता मार्गदर्शन, और ग्रामीण पहुंच के लिए सरल बड़े-बटन डिजाइन।",
    trustEvents: "रिकॉर्ड किए गए ब्लॉकचेन ट्रस्ट इवेंट:",
    demoMode: "जज डेमो मोड खोलें (90 सेकंड)",
    scanFailed: "समग्र स्कैन करने में विफल",
    scanCompleted: "समग्र स्कैन सफलतापूर्वक पूरा हुआ",
    scanError: "स्कैन करने में त्रुटि",
    quickActions: {
      scanQrPayment: "QR भुगतान स्कैन",
      smsFraudShield: "SMS धोखाधड़ी शील्ड",
      phishingLinkCheck: "फिशिंग लिंक जांच",
      otpProtection: "OTP सुरक्षा",
      secureBankingMode: "सुरक्षित बैंकिंग मोड",
      wifiSafety: "WiFi सुरक्षा",
      permissionRisk: "अनुमति जोखिम",
      aiFraudAssistant: "AI धोखाधड़ी सहायक",
      ruralBankingMode: "ग्रामीण बैंकिंग मोड",
    },
  },
  kn: {
    title: "ಗ್ರಾಮೀಣ ಡಿಜಿಟಲ್ ಬ್ಯಾಂಕಿಂಗ್‌ಗಾಗಿ ಹೊಂದಿಕೊಳ್ಳುವ ಸೈಬರ್ ಭದ್ರತಾ ಚೌಕಟ್ಟು",
    subtitle: "ವಿಶ್ವಾಸ + ಭದ್ರತೆ + ಪ್ರವೇಶಾರ್ಹತೆ",
    dashboardTitle: "ಬ್ಯಾಂಕಿಂಗ್ ರಕ್ಷಣೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    secureEnvironment: "ಸುರಕ್ಷಿತ ಪರಿಸರ:",
    secureOn: "ಆನ್",
    secureOff: "ಆಫ್",
    secureHint: "UPI, ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್ ಅಥವಾ ಪಾವತಿ ಆಪ್ ಬಳಕೆಗೆ ಮುನ್ನ ಆನ್ ಮಾಡಿ.",
    trustPosture: "ವಿಶ್ವಾಸಾರ್ಹ ಬ್ಯಾಂಕಿಂಗ್ ಸಾಧನ ಸ್ಥಿತಿ",
    scanning: "ಸ್ಕ್ಯಾನ್ ನಡೆಯುತ್ತಿದೆ...",
    startScan: "ಸುರಕ್ಷಿತ ಬ್ಯಾಂಕಿಂಗ್ ಸ್ಕ್ಯಾನ್ ಪ್ರಾರಂಭಿಸಿ",
    disableSecureMode: "ಸುರಕ್ಷಿತ ಮೋಡ್ ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಿ",
    enableSecureMode: "ಸುರಕ್ಷಿತ ಮೋಡ್ ಸಕ್ರಿಯಗೊಳಿಸಿ",
    quickActionsTitle: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
    offlineLine: "ಆಫ್ಲೈನ್ ಸಿದ್ಧ ಬೆದರಿಕೆ ಪರಿಶೀಲನೆ, ವಂಚನೆ ಜಾಗೃತಿ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಗ್ರಾಮೀಣ ಪ್ರವೇಶಾರ್ಹತೆಗೆ ಸರಳ ದೊಡ್ಡ-ಬಟನ್ ವಿನ್ಯಾಸ.",
    trustEvents: "ದಾಖಲಾದ ಬ್ಲಾಕ್‌ಚೈನ್ ಟ್ರಸ್ಟ್ ಈವೆಂಟ್‌ಗಳು:",
    demoMode: "ಜಡ್ಜ್ ಡೆಮೋ ಮೋಡ್ ತೆರೆಯಿರಿ (90 ಸೆಕೆಂಡು)",
    scanFailed: "ಸಮಗ್ರ ಸ್ಕ್ಯಾನ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ",
    scanCompleted: "ಸಮಗ್ರ ಸ್ಕ್ಯಾನ್ ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ",
    scanError: "ಸ್ಕ್ಯಾನ್ ಮಾಡುವಲ್ಲಿ ದೋಷ",
    quickActions: {
      scanQrPayment: "QR ಪಾವತಿ ಸ್ಕ್ಯಾನ್",
      smsFraudShield: "SMS ವಂಚನೆ ಶೀಲ್ಡ್",
      phishingLinkCheck: "ಫಿಷಿಂಗ್ ಲಿಂಕ್ ಪರಿಶೀಲನೆ",
      otpProtection: "OTP ರಕ್ಷಣೆ",
      secureBankingMode: "ಸುರಕ್ಷಿತ ಬ್ಯಾಂಕಿಂಗ್ ಮೋಡ್",
      wifiSafety: "WiFi ಭದ್ರತೆ",
      permissionRisk: "ಅನುಮತಿ ಅಪಾಯ",
      aiFraudAssistant: "AI ವಂಚನೆ ಸಹಾಯಕ",
      ruralBankingMode: "ಗ್ರಾಮೀಣ ಬ್ಯಾಂಕಿಂಗ್ ಮೋಡ್",
    },
  },
  mr: {
    title: "ग्रामीण डिजिटल बँकिंगसाठी अनुकूली सायबर सुरक्षा फ्रेमवर्क",
    subtitle: "विश्वास + सुरक्षा + सुलभता",
    dashboardTitle: "बँकिंग संरक्षण डॅशबोर्ड",
    secureEnvironment: "सुरक्षित वातावरण:",
    secureOn: "चालू",
    secureOff: "बंद",
    secureHint: "UPI, नेट बँकिंग किंवा पेमेंट अॅप वापरण्यापूर्वी चालू करा.",
    trustPosture: "विश्वासार्ह बँकिंग डिव्हाइस स्थिती",
    scanning: "स्कॅन सुरू आहे...",
    startScan: "सुरक्षित बँकिंग स्कॅन सुरू करा",
    disableSecureMode: "सुरक्षित मोड बंद करा",
    enableSecureMode: "सुरक्षित मोड चालू करा",
    quickActionsTitle: "जलद क्रिया",
    offlineLine: "ऑफलाइन-तयार धोका तपासणी, फसवणूक जागरूकता मार्गदर्शन आणि ग्रामीण सुलभतेसाठी सोपा मोठा-बटण डिझाइन.",
    trustEvents: "नोंदवलेले ब्लॉकचेन ट्रस्ट इव्हेंट:",
    demoMode: "जज डेमो मोड उघडा (90 सेकंद)",
    scanFailed: "सर्वसमावेशक स्कॅन करण्यात अयशस्वी",
    scanCompleted: "सर्वसमावेशक स्कॅन यशस्वीरीत्या पूर्ण झाला",
    scanError: "स्कॅन करताना त्रुटी",
    quickActions: {
      scanQrPayment: "QR पेमेंट स्कॅन",
      smsFraudShield: "SMS फसवणूक शिल्ड",
      phishingLinkCheck: "फिशिंग लिंक तपासणी",
      otpProtection: "OTP संरक्षण",
      secureBankingMode: "सुरक्षित बँकिंग मोड",
      wifiSafety: "WiFi सुरक्षा",
      permissionRisk: "परवानगी धोका",
      aiFraudAssistant: "AI फसवणूक सहाय्यक",
      ruralBankingMode: "ग्रामीण बँकिंग मोड",
    },
  },
  te: {
    title: "గ్రామీణ డిజిటల్ బ్యాంకింగ్ కోసం అనుకూల సైబర్ భద్రతా ఫ్రేమ్‌వర్క్",
    subtitle: "నమ్మకం + భద్రత + ప్రాప్తి",
    dashboardTitle: "బ్యాంకింగ్ రక్షణ డ్యాష్‌బోర్డ్",
    secureEnvironment: "సురక్షిత వాతావరణం:",
    secureOn: "ఆన్",
    secureOff: "ఆఫ్",
    secureHint: "UPI, నెట్ బ్యాంకింగ్ లేదా చెల్లింపు యాప్ వినియోగానికి ముందు ఆన్ చేయండి.",
    trustPosture: "నమ్మకమైన బ్యాంకింగ్ పరికర స్థితి",
    scanning: "స్కాన్ జరుగుతోంది...",
    startScan: "సురక్షిత బ్యాంకింగ్ స్కాన్ ప్రారంభించండి",
    disableSecureMode: "సురక్షిత మోడ్ నిలిపివేయండి",
    enableSecureMode: "సురక్షిత మోడ్ ప్రారంభించండి",
    quickActionsTitle: "త్వరిత చర్యలు",
    offlineLine: "ఆఫ్‌లైన్-రెడీ బెదిరింపు తనిఖీలు, మోసాలపై అవగాహన మార్గదర్శకం, మరియు గ్రామీణ ప్రాప్తి కోసం సరళమైన పెద్ద-బటన్ రూపకల్పన.",
    trustEvents: "రికార్డ్ చేసిన బ్లాక్‌చైన్ నమ్మక ఈవెంట్లు:",
    demoMode: "జడ్జ్ డెమో మోడ్ తెరవండి (90 సెకన్లు)",
    scanFailed: "సమగ్ర స్కాన్ చేయడంలో విఫలమైంది",
    scanCompleted: "సమగ్ర స్కాన్ విజయవంతంగా పూర్తైంది",
    scanError: "స్కాన్ చేయడంలో లోపం",
    quickActions: {
      scanQrPayment: "QR చెల్లింపు స్కాన్",
      smsFraudShield: "SMS మోసం షీల్డ్",
      phishingLinkCheck: "ఫిషింగ్ లింక్ తనిఖీ",
      otpProtection: "OTP రక్షణ",
      secureBankingMode: "సురక్షిత బ్యాంకింగ్ మోడ్",
      wifiSafety: "WiFi భద్రత",
      permissionRisk: "అనుమతి ప్రమాదం",
      aiFraudAssistant: "AI మోసం సహాయకుడు",
      ruralBankingMode: "గ్రామీణ బ్యాంకింగ్ మోడ్",
    },
  },
  ta: {
    title: "கிராமப்புற டிஜிட்டல் வங்கி சேவைக்கான தழுவக்கூடிய சைபர் பாதுகாப்பு வடிவமைப்பு",
    subtitle: "நம்பிக்கை + பாதுகாப்பு + அணுகல்",
    dashboardTitle: "வங்கி பாதுகாப்பு டாஷ்போர்டு",
    secureEnvironment: "பாதுகாப்பான சூழல்:",
    secureOn: "இயக்கம்",
    secureOff: "நிறுத்தம்",
    secureHint: "UPI, நெட் வங்கி அல்லது கட்டண பயன்பாட்டை பயன்படுத்துவதற்கு முன் இயக்கவும்.",
    trustPosture: "நம்பகமான வங்கி சாதன நிலை",
    scanning: "ஸ்கேன் நடைபெறுகிறது...",
    startScan: "பாதுகாப்பான வங்கி ஸ்கேன் தொடங்கு",
    disableSecureMode: "பாதுகாப்பு முறையை அணை",
    enableSecureMode: "பாதுகாப்பு முறையை இயக்கு",
    quickActionsTitle: "விரைவு செயல்கள்",
    offlineLine: "ஆஃப்லைன்-தயார் அச்சுறுத்தல் சோதனைகள், மோசடி விழிப்புணர்வு வழிகாட்டல், மற்றும் கிராமப்புற அணுகலுக்கு எளிய பெரிய-பொத்தான் வடிவமைப்பு.",
    trustEvents: "பதிவுசெய்யப்பட்ட பிளாக்செயின் நம்பிக்கை நிகழ்வுகள்:",
    demoMode: "ஜட்ஜ் டெமோ முறையை திற (90 வினாடி)",
    scanFailed: "முழுமையான ஸ்கேன் செய்ய முடியவில்லை",
    scanCompleted: "முழுமையான ஸ்கேன் வெற்றிகரமாக முடிந்தது",
    scanError: "ஸ்கேன் செய்யும்போது பிழை",
    quickActions: {
      scanQrPayment: "QR கட்டணம் ஸ்கேன்",
      smsFraudShield: "SMS மோசடி கவசம்",
      phishingLinkCheck: "பிஷிங் இணைப்பு சோதனை",
      otpProtection: "OTP பாதுகாப்பு",
      secureBankingMode: "பாதுகாப்பான வங்கி முறை",
      wifiSafety: "WiFi பாதுகாப்பு",
      permissionRisk: "அனுமதி ஆபத்து",
      aiFraudAssistant: "AI மோசடி உதவியாளர்",
      ruralBankingMode: "கிராமப்புற வங்கி முறை",
    },
  },
  ml: {
    title: "ഗ്രാമീണ ഡിജിറ്റൽ ബാങ്കിംഗിനായുള്ള അനുകൂല സൈബർ സുരക്ഷാ ഫ്രെയിംവർക്ക്",
    subtitle: "വിശ്വാസം + സുരക്ഷ + പ്രവേശന സൗകര്യം",
    dashboardTitle: "ബാങ്കിംഗ് സംരക്ഷണ ഡാഷ്ബോർഡ്",
    secureEnvironment: "സുരക്ഷിത പരിസ്ഥിതി:",
    secureOn: "ഓൺ",
    secureOff: "ഓഫ്",
    secureHint: "UPI, നെറ്റ് ബാങ്കിംഗ്, അല്ലെങ്കിൽ പേയ്മെന്റ് ആപ്പ് ഉപയോഗിക്കുന്നതിന് മുമ്പ് ഓൺ ചെയ്യുക.",
    trustPosture: "വിശ്വാസയോഗ്യമായ ബാങ്കിംഗ് ഉപകരണ നില",
    scanning: "സ്കാൻ നടക്കുന്നു...",
    startScan: "സുരക്ഷിത ബാങ്കിംഗ് സ്കാൻ ആരംഭിക്കുക",
    disableSecureMode: "സുരക്ഷിത മോഡ് ഓഫ് ചെയ്യുക",
    enableSecureMode: "സുരക്ഷിത മോഡ് ഓൺ ചെയ്യുക",
    quickActionsTitle: "വേഗ പ്രവർത്തനങ്ങൾ",
    offlineLine: "ഓഫ്‌ലൈൻ-റെഡി ഭീഷണി പരിശോധനകൾ, തട്ടിപ്പ് ബോധവൽക്കരണ മാർഗനിർദ്ദേശം, ഗ്രാമീണ പ്രവേശനത്തിന് ലളിതമായ വലിയ-ബട്ടൺ രൂപകൽപ്പന.",
    trustEvents: "രേഖപ്പെടുത്തിയ ബ്ലോക്ക്ചെയിൻ വിശ്വാസ സംഭവങ്ങൾ:",
    demoMode: "ജഡ്ജ് ഡെമോ മോഡ് തുറക്കുക (90 സെക്കൻഡ്)",
    scanFailed: "സമഗ്ര സ്കാൻ നടത്താൻ പരാജയപ്പെട്ടു",
    scanCompleted: "സമഗ്ര സ്കാൻ വിജയകരമായി പൂർത്തിയായി",
    scanError: "സ്കാൻ ചെയ്യുന്നതിൽ പിശക്",
    quickActions: {
      scanQrPayment: "QR പേയ്മെന്റ് സ്കാൻ",
      smsFraudShield: "SMS തട്ടിപ്പ് ഷീൽഡ്",
      phishingLinkCheck: "ഫിഷിംഗ് ലിങ്ക് പരിശോധന",
      otpProtection: "OTP സംരക്ഷണം",
      secureBankingMode: "സുരക്ഷിത ബാങ്കിംഗ് മോഡ്",
      wifiSafety: "WiFi സുരക്ഷ",
      permissionRisk: "അനുമതി അപകടസാധ്യത",
      aiFraudAssistant: "AI തട്ടിപ്പ് സഹായി",
      ruralBankingMode: "ഗ്രാമീണ ബാങ്കിംഗ് മോഡ്",
    },
  },
};

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
  const t = homepageTranslations[language];
  const allQuickActions = [
    ...featuredQuickActions,
    ...quickActions,
  ];

  const handleComprehensiveScan = async () => {
    setIsScanning(true);
    try {
      const { data, error } = await invokeEdgeFunction('comprehensive-scan', {
        target: window.location.hostname || 'current-device',
        scanType: 'device'
      });

      if (error) {
        console.error('Comprehensive scan error:', error);
        toast.error(t.scanFailed);
      } else {
        console.log('Comprehensive scan results:', data);
        appendTrustEvent("scan_completed", "Secure banking scan completed", "low");
        toast.success(t.scanCompleted);
        // Navigate to results page or show results modal
        navigate('/scanning', { state: { scanResults: data } });
      }
    } catch (err) {
      console.error('Scan error:', err);
      toast.error(t.scanError);
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
            {t.title}
          </p>
          <p className="text-muted-foreground text-sm">
            {t.subtitle}
          </p>
          <div className="flex justify-center gap-2 mt-3 flex-wrap">
            <Button size="sm" variant={language === "en" ? "default" : "outline"} onClick={() => setLanguage("en")}>
              English
            </Button>
            <Button size="sm" variant={language === "hi" ? "default" : "outline"} onClick={() => setLanguage("hi")}>
              हिंदी
            </Button>
            <Button size="sm" variant={language === "kn" ? "default" : "outline"} onClick={() => setLanguage("kn")}>
              ಕನ್ನಡ
            </Button>
            <Button size="sm" variant={language === "mr" ? "default" : "outline"} onClick={() => setLanguage("mr")}>
              मराठी
            </Button>
            <Button size="sm" variant={language === "te" ? "default" : "outline"} onClick={() => setLanguage("te")}>
              తెలుగు
            </Button>
            <Button size="sm" variant={language === "ta" ? "default" : "outline"} onClick={() => setLanguage("ta")}>
              தமிழ்
            </Button>
            <Button size="sm" variant={language === "ml" ? "default" : "outline"} onClick={() => setLanguage("ml")}>
              മലയാളം
            </Button>
          </div>
        </div>

        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">{t.dashboardTitle}</h2>
          <div className="mx-auto mb-6 max-w-xl glass-card rounded-xl px-4 py-3 border border-primary/25">
            <p className="text-base font-semibold">
              {t.secureEnvironment}
              <span className={secureMode ? "text-green-400 ml-2" : "text-red-400 ml-2"}>
                {secureMode ? t.secureOn : t.secureOff}
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {t.secureHint}
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <ProgressCircle percentage={trustScore} subtitle={t.trustPosture} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleComprehensiveScan}
              disabled={isScanning}
              className="glow-button text-white font-semibold px-8 py-4 text-lg rounded-full min-w-[280px]"
            >
              {isScanning ? t.scanning : t.startScan}
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
              {secureMode ? t.disableSecureMode : t.enableSecureMode}
            </Button>
          </div>
        </div>

        <div className="animate-fade-in">
          <h3 className="text-2xl font-semibold mb-6 text-center">{t.quickActionsTitle}</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 max-w-4xl mx-auto">
            {allQuickActions.map((action, index) => (
              <div
                key={action.path}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <QuickActionButton
                  icon={action.icon}
                  label={"label" in action ? action.label : t.quickActions[action.labelKey]}
                  onClick={() => navigate(action.path)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8 glass-card rounded-xl p-4 border border-primary/20">
          <div className="text-sm text-muted-foreground text-center space-y-1">
            <p>{t.offlineLine}</p>
            <p>{guide.doNotShareOtp}</p>
            <p>{t.trustEvents} <span className="text-foreground font-semibold">{trustChain.length}</span></p>
            <div className="pt-2">
              <Button onClick={() => navigate("/demo-mode")} className="glow-button text-white">
                {t.demoMode}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;