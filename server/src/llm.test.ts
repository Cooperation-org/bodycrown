import assert from "node:assert/strict";
import { test } from "node:test";
import { complete, fallbackFromEnv, type Provider } from "./llm.js";

type Reply = { content: { type: string; text?: string }[] };

/** A provider that answers from a script and records how many times it was asked. */
function provider(label: string, outcome: Reply | Error) {
  const calls: { model: string; system: string }[] = [];
  const p: Provider = {
    label,
    model: `${label}-model`,
    messages: {
      async create(params) {
        calls.push({ model: params.model, system: params.system });
        if (outcome instanceof Error) throw outcome;
        return outcome;
      },
    },
  };
  return { p, calls };
}

const text = (t: string): Reply => ({ content: [{ type: "text", text: t }] });
const ask = (providers: Provider[]) =>
  complete(providers, "system prompt", [{ role: "user", content: "hello" }]);

// Silence the expected error logs from failing providers.
const quiet = () => {
  const original = console.error;
  console.error = () => {};
  return () => {
    console.error = original;
  };
};

test("primary answers and the fallback is never called", async () => {
  const primary = provider("primary", text("from primary"));
  const fallback = provider("fallback", text("from fallback"));
  assert.equal(await ask([primary.p, fallback.p]), "from primary");
  assert.equal(primary.calls.length, 1);
  assert.equal(fallback.calls.length, 0);
});

test("each provider is called with its own model and the same system prompt", async () => {
  const restore = quiet();
  const primary = provider("primary", new Error("boom"));
  const fallback = provider("fallback", text("ok"));
  await ask([primary.p, fallback.p]);
  restore();
  assert.deepEqual(primary.calls, [{ model: "primary-model", system: "system prompt" }]);
  assert.deepEqual(fallback.calls, [{ model: "fallback-model", system: "system prompt" }]);
});

test("fallback answers when the primary throws", async () => {
  const restore = quiet();
  const primary = provider("primary", new Error("timeout"));
  const fallback = provider("fallback", text("from fallback"));
  const reply = await ask([primary.p, fallback.p]);
  restore();
  assert.equal(reply, "from fallback");
});

test("fallback answers when the primary returns an empty reply", async () => {
  const restore = quiet();
  const primary = provider("primary", text("   "));
  const fallback = provider("fallback", text("from fallback"));
  const reply = await ask([primary.p, fallback.p]);
  restore();
  assert.equal(reply, "from fallback");
});

test("fallback answers when the primary returns no text block", async () => {
  const restore = quiet();
  const primary = provider("primary", { content: [{ type: "tool_use" }] });
  const fallback = provider("fallback", text("from fallback"));
  const reply = await ask([primary.p, fallback.p]);
  restore();
  assert.equal(reply, "from fallback");
});

test("text blocks are joined and other blocks ignored", async () => {
  const primary = provider("primary", {
    content: [
      { type: "thinking" },
      { type: "text", text: "Hello " },
      { type: "text", text: "there." },
    ],
  });
  assert.equal(await ask([primary.p]), "Hello there.");
});

test("with both providers failing, the last error is thrown", async () => {
  const restore = quiet();
  const primary = provider("primary", new Error("primary down"));
  const fallback = provider("fallback", new Error("fallback down"));
  await assert.rejects(ask([primary.p, fallback.p]), /fallback down/);
  restore();
});

test("with no fallback, the primary error is thrown", async () => {
  const restore = quiet();
  const primary = provider("primary", new Error("primary down"));
  await assert.rejects(ask([primary.p]), /primary down/);
  restore();
});

test("with no providers, a clear error is thrown", async () => {
  await assert.rejects(ask([]), /no model provider configured/);
});

test("fallback settings: none set means no fallback", () => {
  assert.equal(fallbackFromEnv({}), null);
});

test("fallback settings: all three set returns them", () => {
  assert.deepEqual(
    fallbackFromEnv({
      LLM_FALLBACK_BASE_URL: "https://api.example.com/anthropic",
      LLM_FALLBACK_MODEL: "m3",
      LLM_FALLBACK_API_KEY: "key",
    }),
    { baseUrl: "https://api.example.com/anthropic", model: "m3", apiKey: "key" },
  );
});

test("fallback settings: a partial set is rejected", () => {
  assert.throws(() => fallbackFromEnv({ LLM_FALLBACK_MODEL: "m3" }), /must be set together/);
  assert.throws(
    () => fallbackFromEnv({ LLM_FALLBACK_BASE_URL: "https://x", LLM_FALLBACK_API_KEY: "k" }),
    /must be set together/,
  );
});
