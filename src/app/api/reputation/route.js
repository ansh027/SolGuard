import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const REPUTATION_PROMPT = `You are SolGuard AI, a Solana blockchain security expert specializing in address reputation analysis.

You will receive deterministic on-chain facts about a Solana address (account type, balance, owner program, executable status, age). These facts are verified directly from the Solana RPC — trust them completely. Do NOT guess or contradict these facts.

Your job is to layer contextual risk analysis ON TOP of the verified facts:
1. Assess the risk based on the verified account type and owner program
2. Flag known patterns of malicious addresses (drainers, scammers, rug pullers)
3. Evaluate the address age and balance for suspicious characteristics
4. Provide actionable recommendations

Respond ONLY with valid JSON in this exact format:
{
  "riskLevel": "safe|suspicious|dangerous",
  "score": <number 0-100 where 100 is safest>,
  "summary": "<2-3 sentence assessment>",
  "flags": ["<specific concern if any>"],
  "recommendation": "<what user should do>"
}`;

export async function POST(request) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json({ error: 'No address provided' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Basic Solana address validation
    if (address.length < 32 || address.length > 44) {
      return NextResponse.json({
        riskLevel: 'suspicious',
        score: 20,
        summary: 'This does not appear to be a valid Solana address. Valid Solana addresses are 32-44 characters long.',
        flags: ['Invalid address format'],
        recommendation: 'Double-check the address and try again.',
      });
    }

    // ── Deterministic on-chain lookup via getAccountInfo ──
    let onChainFacts = {
      exists: false,
      isProgram: false,
      balanceSOL: 0,
      ownerProgram: null,
      dataSize: 0,
    };

    try {
      const connection = new Connection(
        process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'
      );
      const pubkey = new PublicKey(address);
      const accountInfo = await connection.getAccountInfo(pubkey);

      if (accountInfo) {
        onChainFacts = {
          exists: true,
          isProgram: accountInfo.executable,       // deterministic: true = program, false = wallet/PDA
          balanceSOL: accountInfo.lamports / 1e9,
          ownerProgram: accountInfo.owner.toString(),
          dataSize: accountInfo.data.length,
        };
      }
    } catch {
      // Invalid pubkey format or RPC error — facts remain as defaults
    }

    // ── Optional: Solana FM enrichment for known labels ──
    let solanaFmData = {};
    try {
      const sfmRes = await fetch(`https://api.solana.fm/v0/accounts/${address}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (sfmRes.ok) {
        solanaFmData = await sfmRes.json();
      }
    } catch {
      // Silently fail — Claude still has deterministic facts
    }

    // ── AI contextual analysis layered on top of verified facts ──
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: REPUTATION_PROMPT,
      messages: [{
        role: 'user',
        content: `Analyze this Solana address for reputation and security risks.

Address: ${address}

VERIFIED ON-CHAIN FACTS (from getAccountInfo — these are ground truth):
- Account exists on-chain: ${onChainFacts.exists}
- Account type: ${onChainFacts.isProgram ? 'EXECUTABLE PROGRAM' : 'WALLET / PDA (non-executable)'}
- SOL balance: ${onChainFacts.balanceSOL} SOL
- Owner program: ${onChainFacts.ownerProgram || 'N/A (account not found)'}
- On-chain data size: ${onChainFacts.dataSize} bytes

Solana FM data: ${JSON.stringify(solanaFmData)}

Use the verified facts above as ground truth. Layer your security analysis on top — do NOT contradict them.`,
      }],
    });

    const responseText = message.content[0]?.text || '';
    let analysis;

    try {
      const clean = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const match = clean.match(/\{[\s\S]*\}/);
      analysis = match ? JSON.parse(match[0]) : null;
    } catch {
      analysis = null;
    }

    if (!analysis) {
      analysis = {
        riskLevel: 'suspicious',
        score: 50,
        summary: 'Unable to fully analyze this address. Proceed with caution.',
        flags: [],
        recommendation: 'Manually verify this address before interacting with it.',
      };
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Reputation check error:', error);
    return NextResponse.json({ error: 'Failed to check reputation' }, { status: 500 });
  }
}
