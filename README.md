
<br/>

![Version](https://img.shields.io/badge/version-1.0.0-00D4FF?style=for-the-badge&logo=v&logoColor=white)
![Status](https://img.shields.io/badge/status-Live-00FF88?style=for-the-badge&logo=statuspage&logoColor=white)
![Hackathon](https://img.shields.io/badge/Hackathon-Advaya_2.0-FF6B35?style=for-the-badge&logo=devpost&logoColor=white)
![Team](https://img.shields.io/badge/Team-Cyber_Samurai-9B59FF?style=for-the-badge&logo=shield&logoColor=white)

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-cyber--samurai--defenxia.vercel.app-00D4FF?style=for-the-badge)](https://cyber-samurai-defenxia.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-AdvayaBGSCET-181717?style=for-the-badge&logo=github)](https://github.com/AdvayaBGSCET/team-cyber-samurai)

</div>

---

<div align="center">

## 🎯 The Problem

</div>

> **Rural India is rapidly digitizing — but first-time banking users are extremely vulnerable to cyber fraud.**

OTP scams, phishing links, fake UPI requests, and social-engineering phone calls are wiping out savings of people who just got their first smartphone. Existing security tools are:

- 🚫 Too technical for low-literacy users
- 🚫 English-only
- 🚫 Not built for low-connectivity environments
- 🚫 One-size-fits-all, ignoring vulnerable demographics (elderly, women, farmers)

---

<div align="center">

## 💡 Our Solution

### **Defenxia** — Adaptive Cybersecurity for Rural Digital Banking

</div>

Defenxia is an intelligent security framework that protects India's most vulnerable digital banking users through:

| Feature | Description |
|---|---|
| 🧠 **AI Fraud Detection** | Detects suspicious OTPs, phishing URLs, and fake UPI patterns in real-time |
| 🌐 **Multilingual Guidance** | Safety instructions in regional languages — not just English |
| 📵 **Offline-Ready Safety** | Core protection features work without consistent internet |
| 👤 **Persona-Based Protection** | Adaptive UI for elderly users, farmers, women, first-time bankers |
| ⚡ **Explainable Risk Checks** | Users understand *why* something is flagged — builds real trust |
| 🆘 **Emergency Response Tools** | One-tap access to report fraud, freeze accounts, contact support |
| 📊 **Trust Scoring Engine** | Dynamic risk scores for transactions and contacts |

---

<div align="center">

## 🛠️ Tech Stack

</div>

```
┌─────────────────────────────────────────────────────────────┐
│                        DEFENXIA STACK                       │
├──────────────────┬──────────────────┬───────────────────────┤
│    FRONTEND      │     BACKEND      │      DATABASE         │
├──────────────────┼──────────────────┼───────────────────────┤
│  ⚡ Vite         │  🟢 Supabase     │  🐘 Supabase Postgres │
│  ⚛️  React        │  Edge Functions  │                       │
│   🔷 TypeScript   │  Auth / API      │                       │
│  🎨 Tailwind CSS │                  │                       │
│  🧩 shadcn/ui    │                  │                       │
└──────────────────┴──────────────────┴───────────────────────┘
```

![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=flat-square&logo=shadcnui&logoColor=white)

---

<div align="center">

## 🚀 Quick Start

</div>

### Prerequisites

- Node.js & npm — [Install via nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- A Supabase project (free tier works)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/AdvayaBGSCET/team-cyber-samurai.git
cd team-cyber-samurai
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4️⃣ Run the App

```bash
# Development server (with hot-reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

> 🟢 App will be running at `http://localhost:5173`

---

<div align="center">

## 📁 Project Structure

</div>

```
team-cyber-samurai/
├── 📂 src/
│   ├── 📂 components/     # Reusable UI components (shadcn/ui + custom)
│   ├── 📂 pages/          # Route-level page components
│   ├── 📂 lib/            # Supabase client, utilities, helpers
│   ├── 📂 hooks/          # Custom React hooks
│   └── 📂 types/          # TypeScript type definitions
├── 📂 supabase/
│   └── 📂 functions/      # Edge Functions (fraud detection logic)
├── 📄 .env                # Environment variables (not committed)
├── 📄 vite.config.ts      # Vite configuration
└── 📄 tailwind.config.ts  # Tailwind configuration
```

---

<div align="center">

## ✏️ Edit the Code

</div>

**Option A — Edit Locally**
```bash
# Make changes, then commit
git add .
git commit -m "feat: your feature description"
git push origin main
```

**Option B — Edit on GitHub**

Navigate to any file → click the ✏️ pencil icon → make changes → commit directly.

**Option C — GitHub Codespaces**

Click `Code` → `Codespaces` → `New codespace` → edit and push from the browser.

---

<div align="center">

## 🎯 Key Features Deep Dive

</div>

<details>
<summary><b>🧠 AI-Assisted Fraud Detection</b></summary>

- Real-time analysis of OTP patterns for anomalies
- URL scanner that detects phishing domains
- UPI ID validation against known fraud patterns
- Social engineering call pattern recognition

</details>

<details>
<summary><b>👤 Persona-Based Protection</b></summary>

- Elderly mode: larger UI, slower interactions, extra confirmation steps
- Farmer mode: crop-season fraud alerts, mandi payment scam detection
- First-timer mode: step-by-step transaction guidance
- All modes: regional language support

</details>

<details>
<summary><b>📊 Trust Scoring Engine</b></summary>

- Dynamic trust scores for payees and transactions
- Historical behaviour analysis
- Community-sourced fraud signals
- Explainable scoring — users see *why* a score is low

</details>

<details>
<summary><b>📵 Offline-Ready Safety</b></summary>

- Core fraud pattern database cached locally
- Offline emergency contacts and SOS procedures
- Syncs data when connectivity is restored

</details>

---

<div align="center">

## 🏆 Built at Advaya 2.0 Hackathon

**Theme:** Cybersecurity / Blockchain  
**Venue:** BGSCET, Bengaluru  
**Duration:** 24 Hours  

</div>

---

<div align="center">

## 🤝 Contributing

PRs and issues are welcome! If you find a bug or have a feature idea:

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

</div>

---

<div align="center">

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

<br/>

```
██████╗██╗   ██╗██████╗ ███████╗██████╗      ██████╗ █████╗ ███╗   ███╗██╗   ██╗██████╗  █████╗ ██╗
██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗    ██╔════╝██╔══██╗████╗ ████║██║   ██║██╔══██╗██╔══██╗██║
██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝    ╚█████╗ ███████║██╔████╔██║██║   ██║██████╔╝███████║██║
██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗     ╚═══██╗██╔══██║██║╚██╔╝██║██║   ██║██╔══██╗██╔══██║██║
╚██████╗   ██║   ██████╔╝███████╗██║  ██║    ██████╔╝██║  ██║██║ ╚═╝ ██║╚██████╔╝██║  ██║██║  ██║██║
 ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝██║
                                                                                                  ╚═╝
```

### 🛡️ Made with ❤️ by **Team Cyber Samurai**

*Protecting India's Digital Future — One Transaction at a Time*

<br/>

![Made with Love](https://img.shields.io/badge/Made_with-❤️-FF6B6B?style=for-the-badge)
![Team Cyber Samurai](https://img.shields.io/badge/Team-Cyber_Samurai-00D4FF?style=for-the-badge&logo=shield)
![Advaya 2.0](https://img.shields.io/badge/Advaya-2.0_Hackathon-FF6B35?style=for-the-badge)

</div>
