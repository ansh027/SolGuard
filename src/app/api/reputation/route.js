import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const REPUTATION_PROMPT = `You are SolGuard AI, a Solana blockchain security expert specializing in address reputation analysis.

Given a Solana wallet or contract address, analyze it and assess its reputation based on:
1. Address format validity
2. Known patterns of malicious addresses (drainers, scammers, rug pullers)
3. Whether it looks like a program/contract vs regular wallet
4. Any suspicious characteristics in the address pattern

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

    // Check against Solana FM API for known labels
    let onChainData = {};
    try {
      const sfmRes = await fetch(`https://api.solana.fm/v0/accounts/${address}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (sfmRes.ok) {
        onChainData = await sfmRes.json();
      }
    } catch {
      // Silently fail — Claude will still analyze
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: REPUTATION_PROMPT,
      messages: [{
        role: 'user',
        content: `Analyze this Solana address for reputation and security risks:
Address: ${address}
On-chain data: ${JSON.stringify(onChainData)}
Length: ${address.length} characters`,
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
