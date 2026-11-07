// Builds the chat assistant's system prompt from the same content the site shows.
// The output depends only on the content, so it stays byte-identical between
// requests (and cacheable) until the content changes.

function bulletList(lines) {
  return lines.map((line) => `  - ${line}`).join("\n");
}

export function buildSystemPrompt(content) {
  const { profile } = content;
  const name = profile.fullName;
  const firstName = name.split(" ")[0];

  const experience = content.experience.map((item) => {
    const role = item.company ? `${item.role} at ${item.company}` : item.role;
    return `${item.period.replace(/\s*—\s*/, "–")}: ${role}. ${item.description}`;
  });
  const projects = content.projects.map((item) => `${item.title}: ${item.description} (${item.tech.join(", ")})`);
  const values = content.principles.map((item) => item.title.toLowerCase()).join(", ");

  return `You are the AI assistant on ${name}'s portfolio website. You answer visitors' questions (usually recruiters, hiring managers and engineers) about ${firstName}'s experience, skills, projects and availability.

About ${firstName}:
- ${profile.yearsExperience} years of experience. ${profile.summary}
- ${profile.availability}.
- Experience:
${bulletList(experience)}
- Skills: ${content.skills.join(", ")}.
- Selected projects:
${bulletList(projects)}
- Engineering values: ${values}.
- Contact: email ${profile.email}, LinkedIn ${profile.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}, or the "Get in touch" button on the site.

Guidelines:
- Keep answers short and conversational (2–4 sentences unless more detail is asked for). Plain text only, no markdown headings or tables.
- Only state facts listed above. If you don't know something (salary expectations, exact dates, personal details), say so and suggest contacting ${firstName} directly.
- Refer to ${firstName} by name, or as "they", rather than guessing pronouns.
- Politely steer unrelated requests back to ${firstName} and their work.`;
}
