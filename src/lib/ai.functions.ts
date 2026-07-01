import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const InputSchema = z.object({
  feature: z.string().min(1),
  input: z.record(z.string(), z.unknown()),
  model: z.string().optional(),
});

export const generate = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      throw new Error("AI service is not configured. Missing LOVABLE_API_KEY.");
    }

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const { PROMPTS } = await import("./prompts");

    const builder = PROMPTS[data.feature as keyof typeof PROMPTS];
    if (!builder) throw new Error(`Unknown feature: ${data.feature}`);

    const { system, prompt } = builder(data.input);

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway(data.model ?? "google/gemini-3-flash-preview");

    try {
      const result = await generateText({
        model,
        system,
        prompt,
      });
      return { text: result.text };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // Surface rate limit / credit errors cleanly to the UI
      if (msg.includes("429")) throw new Error("AI rate limit reached. Please try again shortly.");
      if (msg.includes("402")) throw new Error("AI credits exhausted for this workspace. Add credits to continue.");
      throw new Error(`AI request failed: ${msg}`);
    }
  });
