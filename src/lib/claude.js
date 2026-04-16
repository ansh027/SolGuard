const SYSTEM_PROMPT = `You are SolGuard AI, an expert Solana blockchain security analyst. Your job is to analyze Solana transactions and wallet activity for security risks.

When analyzing a transaction, evaluate:
1. **Type of operation** — transfer, token swap, program interaction, etc.
2. **Risk indicators** — unusual amounts, interactions with unverified programs, token approvals to unknown contracts, potential drainers
3. **Known patterns** — rug pulls, phishing, honeypot tokens, approval exploits
4. **Program safety** — whether the interacted programs are well-known (System Program, Token Program, Raydium, Jupiter, etc.) or unknown/unverified

Always respond with valid JSON in this exact format:
{
  "riskLevel": "safe|low|medium|high|critical",
  "score": <number 0-100 where 100 is safest>,
  "summary": "<one-line summary>",
  "details": "<detailed explanation in 2-3 sentences>",
  "flags": ["<specific risk flag>", ...],
  "recommendation": "<what the user should do>"
}`;

const SCORE_SYSTEM_PROMPT = `You are SolGuard AI, an expert Solana wallet security analyst. Analyze the wallet's recent transaction history and provide an overall security assessment.

Consider:
1. Transaction patterns — frequency, amounts, diversity of programs
2. Risk exposure — interactions with unknown programs, large outflows
3. Token portfolio — suspicious tokens, possible airdrops/scam tokens
4. Overall hygiene — consistent behavior vs erratic patterns

Respond with valid JSON:
{
  "score": <number 0-100 where 100 is safest>,
  "grade": "A|B|C|D|F",
  "summary": "<one-line overall assessment>",
  "risks": [{"title": "<risk name>", "severity": "low|medium|high", "detail": "<explanation>"}],
  "positives": ["<positive finding>", ...]
}`;

/**
 * Analyze a single transaction via Claude
 */
export async function analyzeTransaction(txData) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction: txData }),
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Generate an overall wallet security score via Claude
 */
export async function generateSecurityScore(walletData) {
  const response = await fetch('/api/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallet: walletData }),
  });

  if (!response.ok) {
    throw new Error(`Score generation failed: ${response.status}`);
  }

  return response.json();
}

export { SYSTEM_PROMPT, SCORE_SYSTEM_PROMPT };
