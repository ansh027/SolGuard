import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SIMULATOR_PROMPT = `You are SolGuard AI, a Solana transaction security expert. Simulate and analyze a transaction before it is signed.

Given a contract address or unsigned transaction, provide a detailed simulation showing:
1. What SOL will be spent or received
2. What tokens will move and in which direction
3. Which programs will be called
4. Any permissions or approvals being granted
5. Overall risk assessment

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

    // Try to fetch on-chain data if it's a contract address
    let onChainData = {};
    if (type === 'address') {
      try {
        const connection = new Connection(
          process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'
        );
        const pubkey = new PublicKey(input);
        const accountInfo = await connection.getAccountInfo(pubkey);
        if (accountInfo) {
          onChainData = {
            lamports: accountInfo.lamports,
            owner: accountInfo.owner.toString(),
            executable: accountInfo.executable,
            dataSize: accountInfo.data.length,
          };
        }
      } catch {
        // Not a valid pubkey or not found — Claude will still analyze
      }
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SIMULATOR_PROMPT,
      messages: [{
        role: 'user',
        content: `Simulate this Solana ${type === 'address' ? 'contract address' : 'unsigned transaction'}:

Input: ${input}
Type: ${type}
On-chain data: ${JSON.stringify(onChainData)}

Provide a detailed simulation of what will happen if the user interacts with this.`,
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
