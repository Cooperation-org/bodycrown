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

/**
 * Client options per role. Without a fallback, no options are set, so the SDK's own defaults
 * apply (10 minute timeout, 2 retries) exactly as before the fallback existed. With a fallback,
 * each model gets a bounded wait so a slow primary hands over in seconds, and the primary does
 * not retry because the fallback is its retry.
 */
export function clientOptions(
  role: "primary" | "fallback",
  hasFallback: boolean,
  timeoutMs: number,
): { timeout?: number; maxRetries?: number } {
  if (!hasFallback) return {};
  return role === "primary"
    ? { timeout: timeoutMs, maxRetries: 0 }
    : { timeout: timeoutMs, maxRetries: 1 };
}

/**
 * Asks each provider in order and returns the first reply, with the label of the
 * provider that wrote it (so the log can say which model answered). Throws the
 * last error if all fail.
 */
export async function complete(
  providers: Provider[],
  system: string,
  messages: Anthropic.MessageParam[],
): Promise<{ reply: string; provider: string }> {
  let lastError: unknown = new Error("no model provider configured");
  for (const provider of providers) {
    try {
      return { reply: await ask(provider, system, messages), provider: provider.label };
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
