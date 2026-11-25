import { NextResponse } from 'next/server';
import { z } from 'zod';

const GenerateHooksSchema = z.object({
  topic: z.string().trim().min(2, { message: 'Please enter a video topic or product' }).max(300),
  platform: z.string().trim().optional().default('Instagram Reels & TikTok'),
  tone: z.string().trim().optional().default('High Retention / Pattern Interrupt'),
});

interface GeneratedHook {
  id: string;
  hook: string;
  score: number;
  retentionEstimate: string;
  pacingNote: string;
  visualCue: string;
}

function buildFallbackHooks(topic: string, platform: string): GeneratedHook[] {
  const cleanTopic = topic.trim();
  return [
    {
      id: `h-${Date.now()}-1`,
      hook: `Stop scrolling if you are still doing ${cleanTopic} the slow way in 2026.`,
      score: 94,
      retentionEstimate: '81% at 0:03',
      pacingNote: `Fast pattern interrupt tailored for ${platform}. Cut to action within 1.2s.`,
      visualCue: 'Tight zoom-in on subject + glitch whoosh SFX + bold kinetic captions.',
    },
    {
      id: `h-${Date.now()}-2`,
      hook: `I tested 3 setups for ${cleanTopic} so you do not waste a single rupee.`,
      score: 91,
      retentionEstimate: '77% at 0:03',
      pacingNote: 'Curiosity gap + financial stake keeps viewers watching until the reveal.',
      visualCue: 'Split-screen comparison with green/red checkmarks in safe zone.',
    },
    {
      id: `h-${Date.now()}-3`,
      hook: `Nobody talks about this 10-second trick for ${cleanTopic} — watch till the end.`,
      score: 89,
      retentionEstimate: '74% at 0:03',
      pacingNote: 'Insider secret framing; pair with subtle riser SFX before beat drop.',
      visualCue: 'Over-the-shoulder POV shot transitioning into clean screen recording.',
    },
  ];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = GenerateHooksSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid input';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { topic, platform, tone } = validation.data;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        mode: 'fallback',
        hooks: buildFallbackHooks(topic, platform),
      });
    }

    const prompt = `You are an expert short-form video strategist for ${platform}.
Generate 3 viral 0-3 second video hooks for the topic: "${topic}" with tone "${tone}".
Return ONLY a valid JSON array of 3 objects, each with exact keys:
"hook" (string), "score" (number 80-99), "retentionEstimate" (string like "82% at 0:03"), "pacingNote" (string), "visualCue" (string).
Do not wrap in markdown code fences.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8 },
        }),
      }
    );

    if (!geminiRes.ok) {
      return NextResponse.json({
        mode: 'fallback',
        hooks: buildFallbackHooks(topic, platform),
      });
    }

    const geminiData = await geminiRes.json();
    const rawText: string =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('Unexpected Gemini format');
    }

    const hooks: GeneratedHook[] = parsed.slice(0, 3).map((item: any, idx: number) => ({
      id: `gem-${Date.now()}-${idx}`,
      hook: String(item.hook || ''),
      score: Number(item.score || 90),
      retentionEstimate: String(item.retentionEstimate || '78% at 0:03'),
      pacingNote: String(item.pacingNote || ''),
      visualCue: String(item.visualCue || ''),
    }));

    return NextResponse.json({ mode: 'gemini', hooks });
  } catch (err: any) {
    console.error('AI hooks generation error:', err);
    return NextResponse.json(
      { error: 'Failed to generate hooks' },
      { status: 500 }
    );
  }
}
