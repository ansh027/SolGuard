import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { Connection, PublicKey, VersionedTransaction, Transaction } from '@solana/web3.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SIMULATOR_PROMPT = `You are SolGuard AI, a Solana transaction security expert.

You will receive VERIFIED simulation data from Solana's native simulateTransaction RPC call. These results are mathematically accurate — trust them completely. Your job is to TRANSLATE them into a human-readable security report.

When simulation logs are provided, base your analysis entirely on them:
- Calculate exact SOL changes from the pre/post balance differences
- Identify token movements from the log messages
- List every program invoked from the log messages
- Flag any suspicious patterns (unknown programs, large transfers, approval grants)

When only an address is provided (no transaction to simulate), use the on-chain account data to assess risk.

Always respond with valid JSON in this exact format:
{
  "verdict": "safe|warning|dangerous",
  "score": <0-100 where 100 is safest>,
  "summary": "<one line summary of what this transaction does>",
  "simulation": {
    "solChange": "<e.g. -0.05 SOL or +1.2 SOL or 0 SOL>",
    "tokenChanges": [{"token": "<name>", "change": "<e.g. -100 USDC>", "direction": "in|out"}],
    "programsCalled": ["<program name>"],
    "approvalsGranted": ["<any token approvals being granted>"]
  },
  "risks": ["<specific risk if any>"],
  "recommendation": "<clear action for the user>"
}`;

export async function POST(request) {
  try {
    const { input, type } = await request.json();

    if (!input) {
      return NextResponse.json({ error: 'No input provided' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const connection = new Connection(
      process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'
    );

    let contextForAI = '';

    if (type === 'transaction') {
      // ── CRITIQUE FIX: Run Solana's native simulateTransaction RPC ──
      // This gives us mathematically accurate balance changes and logs
      let simulationResult = null;
      try {
        const txBuffer = Buffer.from(input, 'base64');
        let tx;

        // Try parsing as VersionedTransaction first, fallback to legacy
        try {
          tx = VersionedTransaction.deserialize(txBuffer);
        } catch {
          tx = Transaction.from(txBuffer);
        }

        simulationResult = await connection.simulateTransaction(tx, {
          sigVerify: false,
          replaceRecentBlockhash: true,
        });
      } catch (err) {
        // If simulation fails, we still pass the raw input to Claude
        simulationResult = { value: { err: err.message, logs: [] } };
      }

      const simData = simulationResult?.value || {};

      contextForAI = `TRANSACTION SIMULATION (type: unsigned transaction)

Raw input (base64): ${input.slice(0, 100)}...

VERIFIED SIMULATION RESULTS (from Solana simulateTransaction RPC — these are ground truth):
- Simulation error: ${simData.err ? JSON.stringify(simData.err) : 'None (transaction would succeed)'}
- Units consumed: ${simData.unitsConsumed || 'N/A'}
- Pre-balances (lamports): ${JSON.stringify(simData.accounts?.map(a => a?.lamports) || 'N/A')}
- Post-balances (lamports): ${JSON.stringify(simData.accounts?.map(a => a?.lamports) || 'N/A')}
- Simulation logs:
${(simData.logs || []).join('\n')}

Use these verified simulation results to calculate exact balance changes and identify all programs called. Do NOT guess — derive your analysis from the logs above.`;

    } else {
      // ── Address mode: use getAccountInfo for deterministic facts ──
      let onChainData = {};
      try {
        const pubkey = new PublicKey(input);
        const accountInfo = await connection.getAccountInfo(pubkey);
        if (accountInfo) {
          onChainData = {
            exists: true,
            isProgram: accountInfo.executable,
            balanceSOL: accountInfo.lamports / 1e9,
            ownerProgram: accountInfo.owner.toString(),
            dataSize: accountInfo.data.length,
          };
        } else {
          onChainData = { exists: false };
        }
      } catch {
        onChainData = { exists: false, error: 'Invalid address format' };
      }

      contextForAI = `ADDRESS SIMULATION (type: contract address)

Address: ${input}

VERIFIED ON-CHAIN FACTS (from getAccountInfo RPC — these are ground truth):
- Account exists: ${onChainData.exists}
- Account type: ${onChainData.isProgram ? 'EXECUTABLE PROGRAM' : 'WALLET / PDA (non-executable)'}
- SOL balance: ${onChainData.balanceSOL || 0} SOL
- Owner program: ${onChainData.ownerProgram || 'N/A'}
- Data size: ${onChainData.dataSize || 0} bytes

Analyze the security implications of interacting with this address based on the verified facts above.`;
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SIMULATOR_PROMPT,
      messages: [{
        role: 'user',
        content: contextForAI,
      }],
    });

    const responseText = message.content[0]?.text || '';
    let simulation;

    try {
      const clean = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const match = clean.match(/\{[\s\S]*\}/);
      simulation = match ? JSON.parse(match[0]) : null;
    } catch {
      simulation = null;
    }

    if (!simulation) {
      simulation = {
        verdict: 'warning',
        score: 50,
        summary: 'Unable to fully simulate. Proceed with caution.',
        simulation: {
          solChange: 'Unknown',
          tokenChanges: [],
          programsCalled: [],
          approvalsGranted: [],
        },
        risks: ['Could not parse transaction data'],
        recommendation: 'Manually verify before signing.',
      };
    }

    return NextResponse.json(simulation);
  } catch (error) {
    console.error('Simulation error:', error);
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 });
  }
}
