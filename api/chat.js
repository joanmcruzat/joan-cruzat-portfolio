import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "./_lib/chat-prompt.js";
import { getPortfolioContent } from "./_lib/content-repository.js";
import { toConversation } from "./_lib/conversation.js";
import { allowMethods, clientIp, readJsonBody, sendJson, sendProblem } from "./_lib/http.js";
import { createRateLimiter } from "./_lib/rate-limit.js";

const MAX_BODY = 16000;

const client = new Anthropic();

const rateLimit = createRateLimiter([
  { windowMs: 60_000, max: 8 },          // 8 messages per minute
  { windowMs: 60 * 60_000, max: 40 }     // 40 messages per hour
]);

// Public endpoint (no auth): visitors chat anonymously. Abuse is limited by the
// per-IP rate limit above and the request size and message caps.
export default async function handler(req, res) {
  if (!allowMethods(req, res, ["POST"])) return;

  const retryAfter = rateLimit(clientIp(req));
  if (retryAfter) {
    return sendProblem(res, 429, "Too Many Requests",
      "You're sending messages too quickly. Please wait a moment and try again.",
      { "Retry-After": String(retryAfter) });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Missing ANTHROPIC_API_KEY");
    return sendProblem(res, 500, "Internal Server Error", "Chat is not configured.");
  }

  const parsed = readJsonBody(req, MAX_BODY);
  if (!parsed.body) return sendProblem(res, parsed.status, parsed.title, parsed.detail);

  const messages = toConversation(parsed.body.messages);
  if (!messages) return sendProblem(res, 400, "Bad Request", "Please send a message.");

  try {
    const content = await getPortfolioContent();
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 600,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [{ type: "text", text: buildSystemPrompt(content), cache_control: { type: "ephemeral" } }],
      messages
    });

    if (response.stop_reason === "refusal") {
      return sendJson(res, 200, { reply: "Sorry, I can't help with that. Feel free to ask about Joan's experience or projects." });
    }

    const reply = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    return sendJson(res, 200, { reply: reply || "Sorry, I didn't catch that. Could you rephrase?" });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return sendProblem(res, 429, "Too Many Requests", "The assistant is busy right now. Please try again in a moment.");
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`Claude API error ${error.status}:`, error.message);
      return sendProblem(res, 502, "Bad Gateway", "The assistant could not respond right now.");
    }
    console.error("Chat function error:", error);
    return sendProblem(res, 500, "Internal Server Error", "The assistant could not respond right now.");
  }
}
