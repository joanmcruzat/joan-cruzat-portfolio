const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 1500;

// Only accept alternating plain-text user/assistant turns from the browser.
export function toConversation(input) {
  const messages = (Array.isArray(input) ? input : [])
    .slice(-MAX_MESSAGES)
    .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_MESSAGE_CHARS) }))
    .filter((m) => m.content);

  while (messages.length && messages[0].role !== "user") messages.shift();
  return messages.length && messages[messages.length - 1].role === "user" ? messages : null;
}
