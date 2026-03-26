export const runtime = "nodejs";

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

function safeJSONParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

async function callClaude(prompt, maxTokens = 1000) {
  const res = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}

export async function generateQuestions(role, level, company, jobDesc) {
  const prompt = `
Generate 8 interview questions for ${level} ${role} ${company || ""}

Return ONLY JSON array.
`;

  const raw = await callClaude(prompt, 1000);
  const clean = raw.replace(/```json|```/g, "").trim();

  const parsed = safeJSONParse(clean);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed;
}

export async function evaluateAnswer(question, type, answer, role, level) {
  if (!answer || answer.trim().length < 10) {
    return {
      score: 0,
      good: "No answer",
      missing: "Skipped",
      better: "Try answering",
    };
  }

  const prompt = `
Evaluate this answer:

Role: ${role} (${level})
Question: ${question}
Answer: ${answer}

Return JSON only:
{
 "score": 1-10,
 "good": "",
 "missing": "",
 "better": ""
}
`;

  const raw = await callClaude(prompt, 500);
  const clean = raw.replace(/```json|```/g, "").trim();

  const parsed = safeJSONParse(clean);

  if (!parsed) {
    return {
      score: 0,
      good: "",
      missing: "Parse error",
      better: "",
    };
  }

  return {
    score: Math.min(10, Math.max(0, Number(parsed.score) || 0)),
    good: parsed.good ?? "",
    missing: parsed.missing ?? "",
    better: parsed.better ?? "",
  };
}

export async function evaluateAllAnswers(questions, answers, role, level) {
  return Promise.all(
    questions.map((q, i) =>
      evaluateAnswer(q.text, q.type, answers[i] ?? "", role, level)
    )
  );
}