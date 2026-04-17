# SolGuard — AI-Powered Solana Wallet Protection

![SolGuard](https://img.shields.io/badge/Solana-Devnet-9945FF?style=for-the-badge&logo=solana)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Claude AI](https://img.shields.io/badge/Claude-AI-orange?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)

> Built for the Solana Frontier Hackathon 2026 by [@sansh07](https://github.com/ansh027)

SolGuard uses Claude AI to analyze your Solana transactions, detect threats, and keep your assets safe — in plain English, not technical jargon.

🔗 Live Demo: [sol-guard-khaki.vercel.app](https://sol-guard-khaki.vercel.app)

---

## The Problem

Every day, Solana users lose millions of dollars to:
- Wallet drainers disguised as legitimate dApps
- Rug pulls from unknown smart contracts
- Forgotten token approvals giving dApps unlimited access to funds
- Phishing addresses that look legitimate but steal assets

Most users have no way to verify what a transaction will actually do before signing it.

---

## The Solution

SolGuard acts as an AI security layer between users and the Solana blockchain. Before you sign anything, SolGuard tells you exactly what will happen — in plain English.

---

## Why SolGuard?

| Feature | SolGuard | Blowfish | Pocket Universe | Step Finance |
|---|---|---|---|---|
| Plain English AI explanations | Claude AI | Approve/Reject only | Basic warnings | No |
| Security Score | 0-100 grade | No | No | Basic |
| Token Approval Manager | + Revoke | No | No | Yes |
| Address Reputation | AI powered | No | Basic | No |
| Pre-Transaction Simulation | simulateTransaction + AI | Yes | Yes | No |
| Open Source | Yes | No | No | No |
| Self-hostable | Yes | No | No | No |
| Works as standalone app | Yes | Browser extension only | Browser extension only | Yes |

---

## Business Model

| Tier | Price | What you get |
|---|---|---|
| Free | $0 | Devnet only, 10 AI analyses/day, basic security score |
| Pro | $9/month | Mainnet, unlimited analyses, real-time alerts, API access |
| Team | $29/month | Multiple wallets, team dashboard, priority support |

Why this works:
- 10 million+ active Solana wallets — even 0.1% converting to Pro = $9,000/month recurring revenue
- B2B angle: sell to Solana dApps (DEXs, NFT marketplaces, lending protocols) who want to embed SolGuard's security scanner into their own UI before users sign transactions
- Enterprise version for DAOs and DeFi protocols managing large treasuries

---

## Features

### 🛡️ AI Security Score
Get an overall wallet health score (0-100) powered by Claude AI. Analyzes your transaction history, token holdings, and behavioral patterns to give you a comprehensive security grade.

### 🔍 Transaction Analyzer
Click "Analyze" on any transaction in your history. Claude AI breaks down exactly what happened, flags suspicious patterns, and rates the risk level from Safe to Critical.

### ⚡ Pre-Transaction Simulator
Before signing anything, paste a contract address or unsigned transaction. SolGuard runs it through Solana's native simulateTransaction RPC for mathematically accurate results, then Claude AI translates the verified logs into a human-readable report:
- Exact SOL balance changes (from real simulation)
- Token movements (in/out)
- Programs that will be called
- Any approvals being granted
- Overall risk verdict

### 🔐 Token Approval Manager
See every token approval your wallet has granted to dApps. Revoke risky or forgotten approvals with one click — directly from the dashboard.

### 🕵️ Address Reputation Checker
Paste any Solana wallet or contract address and get an instant reputation score. SolGuard first calls getAccountInfo to deterministically verify if the address is a program or wallet, its balance, owner, and data size — then Claude AI layers contextual risk analysis on top of these verified facts.

### 📊 Risk Insights & Positive Findings
AI-generated insights about your wallet's security posture — what you're doing right and what needs attention.

### 🌐 Mainnet/Devnet Toggle
Switch between Solana Devnet and Mainnet directly from the navbar. A safety warning modal appears when switching to Mainnet, reminding users they are viewing real funds. Powered by a shared NetworkContext that dynamically rewires the RPC endpoint across the entire app.

### 💰 Usage Limiter & Pro Upgrade
Free tier is capped at 10 AI analyses per session. After hitting the limit, users see a beautiful upgrade prompt with Pro plan features ($9/month). Rate limiting is enforced server-side across all 4 API routes, making the monetization story demonstrable to judges.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | Frontend framework |
| React 18 | UI components |
| Tailwind CSS | Styling |
| Solana Web3.js | Blockchain interaction |
| Solana Wallet Adapter | Wallet connection (Phantom) |
| @solana/spl-token | Token account management |
| Anthropic Claude API | AI analysis engine |
| Vercel | Deployment |

---

## Architecture

```
Browser (Client)
    ↓
Landing Page → Connect Wallet → Dashboard
    ↓
Dashboard Components:
  ├── Wallet Overview (web3.js)
  ├── Security Score → /api/score → Claude AI
  ├── Transaction List → /api/analyze → Claude AI
  ├── Pre-Transaction Simulator → /api/simulate → Claude AI
  ├── Token Approval Manager (spl-token)
  └── Address Reputation Checker → /api/reputation → Claude AI

Next.js API Routes (Server-side)
    ↓
Claude API (Anthropic) — API key never exposed to client
    ↓
Solana Devnet RPC
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Phantom Wallet browser extension
- Anthropic API key

### Installation

```bash
# Clone the repo
git clone https://github.com/ansh027/SolGuard.git
cd SolGuard

# Install dependencies
npm install --legacy-peer-deps

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Connect Wallet
1. Install [Phantom Wallet](https://phantom.app) browser extension
2. Switch Phantom to Devnet network
3. Click "Select Wallet" on the landing page
4. Approve the connection

---

## How It Works

### AI Analysis Flow
```
User connects wallet
        ↓
SolGuard fetches transaction history from Solana RPC
        ↓
Data sent to Next.js API route (server-side)
        ↓
Claude AI analyzes with specialized security prompts
        ↓
Structured JSON response: { riskLevel, score, summary, flags }
        ↓
Beautiful UI renders results in real-time
```

### Security Design
- API key never exposed — all Claude calls happen server-side via Next.js API routes
- No user data stored — all analysis is done in real-time, nothing is saved
- Devnet by default — safe to test without risking real funds

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Hero.js
│   │   ├── WalletOverview.js
│   │   ├── SecurityScore.js
│   │   ├── TransactionList.js
│   │   ├── SimulatorPanel.js
│   │   ├── TokenApprovalManager.js
│   │   ├── AddressReputation.js
│   │   ├── MainnetWarning.js
│   │   ├── UpgradePrompt.js
│   │   └── RiskBadge.js
│   ├── api/
│   │   ├── analyze/route.js
│   │   ├── score/route.js
│   │   ├── simulate/route.js
│   │   └── reputation/route.js
│   ├── context/
│   │   └── NetworkContext.js
│   ├── dashboard/
│   │   └── page.js
│   ├── demo/
│   │   └── page.js
│   ├── layout.js
│   ├── Providers.js
│   └── page.js
└── lib/
    ├── solana.js
    ├── claude.js
    └── rateLimit.js
```

---

## Roadmap

- [x] AI Security Score
- [x] Transaction Analyzer
- [x] Pre-Transaction Simulator
- [x] Token Approval Manager
- [x] Address Reputation Checker
- [x] Mainnet/Devnet Toggle
- [x] Usage Limiter & Pro Upgrade Prompt
- [ ] Real-time wallet monitoring alerts
- [ ] Multi-wallet support
- [ ] Mobile app (Solana Mobile SDK)

---

## Hackathon

Built for the [Solana Frontier Hackathon 2026](https://colosseum.com/frontier) powered by Colosseum.

Track: AI Agent

Builder: Ansh Singh ([@sansh07](https://github.com/ansh027)) — Solo

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
  <strong>Built with Claude AI on Solana</strong><br/>
  <sub>Protecting wallets, one transaction at a time.</sub>
</div>
