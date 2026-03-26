const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

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
    throw new Error(`Anthropic API error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}

export async function generateQuestions(role, level, company, jobDesc) {
  try {
    const prompt = `You are an expert technical interviewer.
Generate exactly 8 interview questions for a ${level} ${role}${company ? " at " + company : ""}.

Job Description:
${jobDesc.substring(0, 2000)}

Rules:
- Question 1 MUST be HR intro question
- Return ONLY JSON array`;

    const raw = await callClaude(prompt, 1000);
    const clean = raw.replace(/```json|```/g, "").trim();

    return JSON.parse(clean);
  } catch (err) {
    console.error("generateQuestions error:", err);
    return [];
  }
}

export async function evaluateAnswer(question, questionType, answer, role, level) {
  try {
    if (!answer || answer.trim().length < 10) {
      return {
        score: 0,
        good: "No answer provided",
        missing: "Skipped",
        better: "Try answering next time",
      };
    }

    const prompt = `Evaluate answer for ${role} (${level}):

Question: ${question}
Answer: ${answer}

Return JSON only.`;

    const raw = await callClaude(prompt, 500);
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return {
      score: Math.min(10, Math.max(0, Number(parsed.score) || 0)),
      good: parsed.good ?? "",
      missing: parsed.missing ?? "",
      better: parsed.better ?? "",
    };
  } catch (err) {
    console.error("evaluateAnswer error:", err);

    return {
      score: 0,
      good: "",
      missing: "Evaluation failed",
      better: "",
    };
  }
}

export async function evaluateAllAnswers(questions, answers, role, level) {
  return Promise.all(
    questions.map((q, i) =>
      evaluateAnswer(q.text, q.type, answers[i] ?? "", role, level)
    )
  );
}