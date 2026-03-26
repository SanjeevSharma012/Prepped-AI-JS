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
  const prompt = `You are an expert technical interviewer.
Generate exactly 8 interview questions for a ${level} ${role}${company ? " at " + company : ""}.

Job Description:
${jobDesc.substring(0, 2000)}

Rules:
- Question 1 MUST be: "Tell me about yourself and your journey into this field." with type "HR"
- Remaining 7: 3 Technical, 2 Behavioural, 1 Situational, 1 HR
- Make questions specific to the role and JD
- Use only straight apostrophes
- Return ONLY a valid JSON array, no markdown, no explanation

Format:
[{"type":"HR","text":"Tell me about yourself and your journey into this field."},...]`;

  const raw = await callClaude(prompt, 1000);
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

export async function evaluateAnswer(question, questionType, answer, role, level) {
  if (!answer || answer.trim().length < 10) {
    return {
      score: 0,
      good: "No answer was provided.",
      missing: "You skipped this question entirely.",
      better: "Attempt every question — even a partial answer scores better than silence.",
    };
  }

  const prompt = `You are a strict but fair interviewer evaluating a ${level} ${role} candidate.

Question (${questionType}): ${question}

Candidate answer: ${answer}

Evaluate honestly. Return ONLY a JSON object, no markdown:
{
  "score": integer 1-10,
  "good": "what worked well, 1-2 sentences",
  "missing": "what was missing or weak, 1-2 sentences",
  "better": "a stronger model answer in 1-2 sentences"
}`;

  const raw = await callClaude(prompt, 500);
  const clean = raw.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);
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
