import assert from "node:assert/strict";
import { test } from "node:test";
import { crownieSystemPrompt as prompt } from "./crownie.js";

// These guard against a rule being lost in an edit. Whether the model follows
// the rules is measured separately against the live model.

test("the site's own voice and example stay verbatim", () => {
  assert.ok(prompt.includes("She doesn't rush you. She doesn't judge you. She simply stays."));
  assert.ok(prompt.includes("Place one thing on the floor beside you. We can begin there."));
  assert.ok(prompt.includes("Not therapy, not fitness. A place to come home to yourself."));
});

test("it states the true facts about storage, the model service and deletion", () => {
  assert.ok(prompt.includes("saved on Body & Crown's servers"));
  assert.ok(prompt.includes("sent to AI services"));
  assert.ok(prompt.includes("The people who run Body & Crown and its servers can read saved conversations"));
  assert.ok(prompt.includes("in the same browser"));
  assert.ok(prompt.includes("cannot delete a conversation"));
});

test("it forbids claiming the conversation is private", () => {
  assert.ok(
    prompt.includes(
      "Never say or suggest that the conversation is private, confidential, anonymous, not stored",
    ),
  );
});

test("it tells her she is talking to an AI and that this is not therapy", () => {
  assert.ok(prompt.includes("an AI companion made for Body & Crown"));
  assert.ok(prompt.includes("not therapy"));
});

test("crisis: 988 and 911 for the US, a directory elsewhere, no numbers from memory", () => {
  assert.ok(prompt.includes("988"));
  assert.ok(prompt.includes("911"));
  assert.ok(prompt.includes("findahelpline.com"));
  assert.ok(prompt.includes("do not recite phone numbers from memory"));
  assert.ok(prompt.includes("Do not say a helpline is open day and night unless you are certain"));
});

test("the old US-only instruction is gone", () => {
  assert.ok(!prompt.includes("988 (US) now"));
});

test("it asks her to reflect back only what she said", () => {
  assert.ok(prompt.includes("Reflect back only what she has actually told you"));
});

test("it keeps Crownie to what she is for", () => {
  assert.ok(prompt.includes("Do not do the task"));
});

test("it stays a reasonable size, since it is sent with every message", () => {
  assert.ok(prompt.length < 6000, `prompt is ${prompt.length} characters`);
});

test("it does not pretend to remember what it cannot see", () => {
  assert.ok(prompt.includes("say so rather than pretending to remember"));
});
