import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const ANTHROPIC_MODELS = new Set([
  "claude-opus-4-6",
  "claude-sonnet-4-6",
  "claude-haiku-4-5-20251001",
]);

const OPENAI_MODELS = new Set(["gpt-4.1", "gpt-4.1-mini", "o3", "gpt-5.2", "gpt-5.3"]);

export async function POST(req: NextRequest) {
  const { prompt, models } = (await req.json()) as {
    prompt: string;
    models: string[];
  };

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        } catch {
          // controller closed
        }
      };

      const tasks: Promise<void>[] = [];

      const anthropicModels = models.filter((m) => ANTHROPIC_MODELS.has(m));
      const openaiModels = models.filter((m) => OPENAI_MODELS.has(m));

      if (anthropicModels.length > 0) {
        if (!process.env.ANTHROPIC_API_KEY) {
          for (const m of anthropicModels) {
            send({ model: m, error: "ANTHROPIC_API_KEY not set", done: true });
          }
        } else {
          const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
          });
          for (const modelId of anthropicModels) {
            tasks.push(
              (async () => {
                const start = Date.now();
                try {
                  const msgStream = anthropic.messages.stream({
                    model: modelId,
                    max_tokens: 2048,
                    messages: [{ role: "user", content: prompt }],
                  });
                  for await (const event of msgStream) {
                    if (
                      event.type === "content_block_delta" &&
                      event.delta.type === "text_delta"
                    ) {
                      send({ model: modelId, delta: event.delta.text, done: false });
                    }
                  }
                  send({ model: modelId, done: true, elapsed: Date.now() - start });
                } catch (err) {
                  send({ model: modelId, error: String(err), done: true });
                }
              })()
            );
          }
        }
      }

      if (openaiModels.length > 0) {
        if (!process.env.OPENAI_API_KEY) {
          for (const m of openaiModels) {
            send({ model: m, error: "OPENAI_API_KEY not set", done: true });
          }
        } else {
          const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
          for (const modelId of openaiModels) {
            tasks.push(
              (async () => {
                const start = Date.now();
                try {
                  const isReasoning = modelId === "o3";
                  const params = {
                    model: modelId,
                    messages: [
                      { role: "user" as const, content: prompt },
                    ],
                    stream: true as const,
                    ...(isReasoning
                      ? { max_completion_tokens: 2048 }
                      : { max_tokens: 2048 }),
                  };
                  const completion = await openai.chat.completions.create(params);
                  for await (const chunk of completion) {
                    const delta = chunk.choices[0]?.delta?.content;
                    if (delta) send({ model: modelId, delta, done: false });
                  }
                  send({ model: modelId, done: true, elapsed: Date.now() - start });
                } catch (err) {
                  send({ model: modelId, error: String(err), done: true });
                }
              })()
            );
          }
        }
      }

      await Promise.all(tasks);
      send({ type: "complete" });
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
