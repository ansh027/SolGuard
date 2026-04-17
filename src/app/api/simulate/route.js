import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { target, type } = await request.json();

    if (!target) {
      return NextResponse.json({ error: 'No target provided' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    const SIMULATOR_PROMPT = `
You are SolGuard AI, an expert Solana smart contract auditor and Web3 security assistant. 
The user is considering interacting with the following ${type === 'address' ? 'smart contract address / token' : 'unsigned base64 transaction'}:
TARGET: ${target}

Since this is a pre-transaction simulation scanner, your job is to identify potential risks before the user signs anything. 
If it's an address, identify if it resembles known patterns (e.g., standard program, random user address, known DEX).
If it's a base64 string, identify the likely danger of blindly signing raw payloads.

Analyze the input and return a JSON object exactly exactly like this (no other text or formatting):
{
  "riskLevel": "safe" | "low" | "medium" | "high" | "critical",
  "score": number between 0 and 100 (100 being safest),
  "summary": "1-2 sentence overview of the risk",
  "details": "Detailed explanation of what this interact does or what this address likely is",
  "flags": ["Flag 1", "Flag 2"],
  "recommendation": "Clear instruction on whether to proceed or abort"
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: "You output only clean, raw JSON.",
      messages: [
        {
          role: 'user',
          content: SIMULATOR_PROMPT,
        },
      ],
    });

    const responseText = message.content[0]?.text || '';
    
    // Parse JSON from Claude's response safely
    let simulationData;
    try {
      const cleanText = responseText.replace(/```json/gi, '').replace(/```/g, '');
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      simulationData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      if (!simulationData) throw new Error('Parsing failed');
    } catch {
      simulationData = {
        riskLevel: 'high',
        score: 30,
        summary: 'Unable to reliably parse the simulation data.',
        details: 'The AI returned an invalid response, which often happens with obscure or potentially malicious unrecognizable payloads. Proceed with extreme caution.',
        flags: ['Unrecognized format', 'Parsing failure'],
        recommendation: 'Abort the transaction unless you fully trust the source.',
      };
    }

    return NextResponse.json(simulationData);
  } catch (error) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { error: 'Failed to simulate transaction' },
      { status: 500 }
    );
  }
}
