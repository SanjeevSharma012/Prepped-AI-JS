const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

function safeParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

async function callClaude(prompt) {
  const res = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}

export async function generateQuestions(role, level) {
  const raw = await callClaude(
    `Generate 5 interview questions for ${level} ${role} in JSON array`
  );

  const parsed = safeParse(raw.replace(/```json|```/g, "").trim());
  return Array.isArray(parsed) ? parsed : [];
}

export async function evaluateAllAnswers(questions, answers) {
  return questions.map((q, i) => ({
    score: 7,
    good: "Decent answer",
    missing: "Needs depth",
    better: "Add examples",
  }));
}