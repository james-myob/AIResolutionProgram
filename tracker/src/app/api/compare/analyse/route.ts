import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { prompt, category, results } = (await req.json()) as {
    prompt: string;
    category: string | null;
    results: { label: string; text: string }[];
  };

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY not set" },
      { status: 500 }
    );
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = `You are an expert AI model evaluator helping someone build their personal understanding of different AI models. You will be given a prompt and responses from multiple models. Produce a focused, opinionated comparison.

Use exactly these headers (markdown ##):

## Where They Agree
What substance all or most models converged on. Be specific — don't just say "they all answered the question".

## Key Differences
Where models diverged meaningfully. What did each say differently and why does it matter for this task?

## Unique Contributions
One or two things each model added that no other model did. Only note genuinely unique, substantive elements — skip if nothing stands out.

## Tone & Structure
How each model approached format, length, and voice. Keep this brief.

## Verdict
For this specific task${category ? ` (${category})` : ""}, which model handled it best and why. Be direct — commit to an answer. Note any models that were surprisingly good or bad.

Keep the whole analysis under 400 words. Be concrete, not generic.`;

  const modelBlocks = results
    .map((r) => `**${r.label}:**\n${r.text}`)
    .join("\n\n---\n\n");

  const userContent = `**Prompt:** ${prompt}\n\n${modelBlocks}`;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const msgStream = anthropic.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: userContent }],
        });
        for await (const event of msgStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ delta: event.delta.text })}\n\n`
              )
            );
          }
        }
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
        );
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: String(err), done: true })}\n\n`
          )
        );
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
