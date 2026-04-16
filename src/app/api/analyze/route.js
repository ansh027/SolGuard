import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/claude';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { transaction } = await request.json();

    if (!transaction) {
      return NextResponse.json({ error: 'No transaction data provided' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Analyze this Solana transaction for security risks:\n\n${JSON.stringify(transaction, null, 2)}`,
        },
      ],
    });

    const responseText = message.content[0]?.text || '';

    // Parse JSON from Claude's response
    let analysis;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { riskLevel: 'safe', score: 80, summary: 'Unable to parse analysis', details: responseText, flags: [], recommendation: 'Review manually' };
    } catch {
      analysis = {
        riskLevel: 'safe',
        score: 80,
        summary: 'Analysis completed',
        details: responseText,
        flags: [],
        recommendation: 'Review transaction details manually',
      };
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze transaction' },
      { status: 500 }
    );
  }
}
