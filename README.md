<p align="center">
  <img src="https://img.shields.io/badge/Solana-Devnet-blueviolet?style=flat-square&logo=solana" alt="Solana Devnet" />
  <img src="https://img.shields.io/badge/AI-Claude%20(Anthropic)-orange?style=flat-square" alt="Claude AI" />
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />
</p>

# 🛡️ SolGuard

**AI-powered Solana wallet protection — detect threats before they drain your wallet.**

SolGuard connects to your Solana wallet, scans your transaction history, and uses **Claude AI** to analyze every transaction for security risks — from unverified program interactions to potential token drainers. You get a real-time security score, detailed risk breakdowns, and actionable recommendations.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Transaction Scanner** | Fetches and displays your recent transactions with status, timestamps, and Solana Explorer links |
| 🤖 **AI Risk Analysis** | One-click per-transaction analysis powered by Claude — returns risk level, safety score, flags, and recommendations |
| 📊 **Security Score** | Overall wallet health score (0-100) with grade, risk insights, and positive findings |
| 🎯 **Risk Badges** | Color-coded risk indicators (Safe / Low / Medium / High / Critical) on every analyzed transaction |
| 📋 **Slide-in Analysis Panel** | Detailed AI analysis view with summary, risk flags, and actionable recommendations |
| 🎮 **Demo Mode** | Full dashboard experience with simulated data — no wallet or API key needed |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) 18+
- [Phantom Wallet](https://phantom.app/) browser extension (or any Solana wallet)
- [Anthropic API Key](https://console.anthropic.com/) for AI analysis

### Setup

```bash
# Clone the repository
git clone https://github.com/ansh027/SolGuard.git
cd SolGuard

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local and add your Anthropic API key:
# ANTHROPIC_API_KEY=sk-ant-your-key-here

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — connect your wallet or click **Try Demo** to explore.

---

## 🎮 Demo Mode

Judges and reviewers can see the full dashboard without any setup:

1. Visit `http://localhost:3000`
2. Click **"Try Demo"** in the navbar or hero section
3. Browse the dashboard with simulated wallet data
4. Click **"Analyze"** on any transaction to see the AI analysis panel

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.js     # POST — Claude transaction analysis
│   │   └── score/route.js       # POST — Claude wallet security scoring
│   ├── components/
│   │   ├── Navbar.js            # Navigation + wallet button
│   │   ├── Hero.js              # Landing page hero section
│   │   ├── FeatureCard.js       # Feature showcase cards
│   │   ├── WalletOverview.js    # Balance, address, token count
│   │   ├── SecurityScore.js     # Animated SVG score gauge
│   │   ├── TransactionList.js   # TX history + per-TX analysis
│   │   ├── RiskBadge.js         # Color-coded risk pills
│   │   └── AnalysisPanel.js     # Slide-in AI analysis view
│   ├── dashboard/page.js        # Main dashboard (wallet-gated)
│   ├── demo/page.js             # Demo dashboard (mock data)
│   ├── Providers.js             # Solana wallet providers
│   ├── layout.js                # Root layout + SEO
│   ├── page.js                  # Landing page
│   └── globals.css              # Design system
└── lib/
    ├── solana.js                # Blockchain data fetchers
    ├── claude.js                # AI prompts + API wrappers
    └── mockData.js              # Demo mode mock data
```

### Data Flow

```
User connects wallet ──→ Fetch balance, transactions, tokens (Solana RPC)
                    ──→ Send wallet summary to /api/score ──→ Claude AI ──→ Security Score
                    ──→ Click "Analyze" on a TX ──→ Fetch parsed TX details ──→ /api/analyze ──→ Claude AI ──→ Risk Analysis
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Lucide Icons |
| Styling | Tailwind CSS v4 |
| Blockchain | Solana web3.js + Wallet Adapter |
| AI | Claude (Anthropic API) |
| Network | Solana Devnet |

---

## 🔒 Security Notes

- **API key never exposed to client** — Claude calls happen server-side via Next.js API routes
- `.env.local` is in `.gitignore` — secrets are never committed
- Wallet connection is **read-only** — SolGuard never requests transaction signing permissions
- All data stays in-browser — no user data is stored or logged

---

## 📄 License

MIT — build on it, fork it, make it yours.
