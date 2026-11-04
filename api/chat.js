import Anthropic from "@anthropic-ai/sdk";

const MAX_BODY = 16000;
const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 1500;

// Stable system prompt (kept byte-identical between requests so it can be cached).
const SYSTEM_PROMPT = `You are the AI assistant on Joan Cruzat's portfolio website. You answer visitors' questions (usually recruiters, hiring managers and engineers) about Joan's experience, skills, projects and availability.

About Joan:
- Senior Full Stack Engineer with 8+ years of experience, specializing in .NET, Angular, REST APIs, databases, integrations and modern web applications.
- Looking for a fully remote setup, on a day shift or mid shift schedule.
- Salary expectation: Php 140k–150k per month.
- Experience:
  - 2022–2026: Senior / .NET Full Stack Engineer at Xentra Solutions. Built enterprise-grade .NET applications and REST APIs, optimized SQL queries and stored procedures, designed database structures, delivered financial integrations and microservices, and worked across AWS, Linux, CI/CD, logging and deployment.
  - 2020–2026: Angular Frontend Developer. Built complex Angular applications and operator dashboards with reporting, graphs, reusable components, forms, settings and REST API integration using TypeScript, RxJS, Angular Material and Tailwind CSS.
  - 2016–2020: PHP Full Stack Developer. Developed database-driven academic information management systems and full-stack applications using PHP, JavaScript, HTML, CSS and relational databases.
- Skills: .NET, C#, Angular, TypeScript, REST APIs, SQL Server, MySQL, PostgreSQL, EF Core, Microservices, AWS, Redis, CI/CD, Playwright.
- Selected projects:
  - Moolah Play / MarkerTrax: Angular operator dashboard with reporting, graphs, user management, settings and REST API integration.
  - Uniteller Remittance Integration: fintech integration involving signup, KYC, MFA, Plaid and backend service workflows.
  - NMI Payment Gateway: card management, vault concepts, transaction processing and database design.
  - Usio GPR / Akimbo: card integration with SSO, token handling and coordinated frontend/backend architecture.
  - Bloxcross Crypto Integration: secure service integration using HMAC authentication, JWT, API logging, validation and error handling (.NET 8, microservices).
  - Academic Information Management: database-driven academic systems built with PHP.
- Engineering values: performance, maintainability, security, reliability, scalability and developer experience.
- Contact: email joanmcruzat@gmail.com, LinkedIn linkedin.com/in/joan-cruzat, or the "Hire Me" button on the site.

Guidelines:
- Keep answers short and conversational (2–4 sentences unless more detail is asked for). Plain text only, no markdown headings or tables.
- Only state facts listed above. If you don't know something (exact dates, personal details), say so and suggest contacting Joan directly.
- Refer to Joan by name, or as "they", rather than guessing pronouns.
- Politely steer unrelated requests back to Joan and their work.`;

const client = new Anthropic();

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Missing ANTHROPIC_API_KEY");
    return json(res, 500, { error: "Chat is not configured." });
  }

  const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {});
  if (raw.length > MAX_BODY) return json(res, 413, { error: "Request is too large." });

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return json(res, 400, { error: "Invalid request body." });
  }

  // Only accept alternating plain-text user/assistant turns from the browser.
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .slice(-MAX_MESSAGES)
    .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_MESSAGE_CHARS) }))
    .filter((m) => m.content);

  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return json(res, 400, { error: "Please send a message." });
  }

  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 2048,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages
    });

    if (response.stop_reason === "refusal") {
      return json(res, 200, { reply: "Sorry, I can't help with that. Feel free to ask about Joan's experience or projects." });
    }

    const reply = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    return json(res, 200, { reply: reply || "Sorry, I didn't catch that. Could you rephrase?" });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return json(res, 429, { error: "The assistant is busy right now. Please try again in a moment." });
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`Claude API error ${error.status}:`, error.message);
      return json(res, 502, { error: "The assistant could not respond right now." });
    }
    console.error("Chat function error:", error);
    return json(res, 500, { error: "The assistant could not respond right now." });
  }
}
