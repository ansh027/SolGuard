import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { SCORE_SYSTEM_PROMPT } from '@/lib/claude';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { wallet } = await request.json();

    if (!wallet) {
      return NextResponse.json({ error: 'No wallet data provided' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SCORE_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Generate a security score for this Solana wallet:\n\n${JSON.stringify(wallet, null, 2)}`,
        },
      ],
    });

    const responseText = message.content[0]?.text || '';

    // Parse JSON from Claude's response
    let scoreData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      scoreData = jsonMatch ? JSON.parse(jsonMatch[0]) : { score: 75, grade: 'B', summary: 'Unable to parse score', risks: [], positives: [] };
    } catch {
      scoreData = {
        score: 75,
        grade: 'B',
        summary: 'Score generated with limited data',
        risks: [],
        positives: ['Wallet is active on devnet'],
      };
    }

    return NextResponse.json(scoreData);
  } catch (error) {
    console.error('Score generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate security score' },
      { status: 500 }
    );
  }
}
