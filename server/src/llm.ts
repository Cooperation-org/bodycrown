import type Anthropic from "@anthropic-ai/sdk";

type Block = { type: string; text?: string };

type Request = {
  model: string;
  max_tokens: number;
  system: string;
  messages: Anthropic.MessageParam[];
};

/** The part of the Anthropic client the chat uses, so tests can stand in for a provider. */
export type Provider = {
  label: string;
  model: string;
  messages: { create(params: Request): Promise<{ content: Block[] }> };
};

export type ProviderEnv = { baseUrl: string; model: string; apiKey: string };

const MAX_TOKENS = 600;

async function ask(provider: Provider, system: string, messages: Anthropic.MessageParam[]) {
  const response = await provider.messages.create({
    model: provider.model,
    max_tokens: MAX_TOKENS,
    system,
    messages,
  });
  const reply = response.content
    .flatMap((block) => (block.type === "text" && block.text ? [block.text] : []))
    .join("")
    .trim();
  if (!reply) throw new Error(`${provider.label} returned an empty reply`);
  return reply;
}

/** Asks each provider in order and returns the first reply; throws the last error if all fail. */
export async function complete(
  providers: Provider[],
  system: string,
  messages: Anthropic.MessageParam[],
): Promise<string> {
  let lastError: unknown = new Error("no model provider configured");
  for (const provider of providers) {
    try {
      return await ask(provider, system, messages);
    } catch (error) {
      lastError = error;
      console.error(`model call failed (${provider.label})`, error);
    }
  }
  throw lastError;
}

/**
 * The fallback model is optional, but its three settings go together: all set or none.
 * A half-configured fallback would silently never run, so it is rejected at startup.
 */
export function fallbackFromEnv(env: NodeJS.ProcessEnv): ProviderEnv | null {
  const baseUrl = env.LLM_FALLBACK_BASE_URL;
  const model = env.LLM_FALLBACK_MODEL;
  const apiKey = env.LLM_FALLBACK_API_KEY;
  if (!baseUrl && !model && !apiKey) return null;
  if (!baseUrl || !model || !apiKey) {
    throw new Error("LLM_FALLBACK_BASE_URL, LLM_FALLBACK_MODEL and LLM_FALLBACK_API_KEY must be set together");
  }
  return { baseUrl, model, apiKey };
}
