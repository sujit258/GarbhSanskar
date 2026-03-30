const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const GROK_API_KEY = process.env.GROK_API_KEY || "";

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-flash-latest"];
const OPENAI_MODEL = "gpt-4o-mini";
const GROK_MODEL = "grok-2";

function withCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function getGeminiUrl(model) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
}

function isQuotaOrRateLimitError(message) {
  const lowerError = String(message || "").toLowerCase();
  return (
    lowerError.includes("quota")
    || lowerError.includes("rate limit")
    || lowerError.includes("resource has been exhausted")
    || lowerError.includes("insufficient_quota")
    || lowerError.includes("429")
  );
}

async function callGemini(systemPrompt, userPrompt) {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key missing");
  }

  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      const response = await fetch(getGeminiUrl(model), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: userPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            responseMimeType: "application/json",
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Empty response from Gemini");
        return { payload: text, source: `gemini:${model}` };
      }

      lastError = data?.error?.message || "Gemini API Error";
      const lowerError = String(lastError).toLowerCase();
      const shouldTryNextModel =
        lowerError.includes("not found")
        || lowerError.includes("not supported")
        || lowerError.includes("quota")
        || lowerError.includes("rate limit")
        || lowerError.includes("resource has been exhausted")
        || lowerError.includes("429");

      if (!shouldTryNextModel) {
        throw new Error(lastError);
      }
    } catch (e) {
      lastError = e?.message || "Gemini API Error";
      if (model === GEMINI_MODELS[GEMINI_MODELS.length - 1]) {
        throw new Error(lastError);
      }
    }
  }

  throw new Error(lastError || "Gemini API Error");
}

async function callOpenAI(systemPrompt, userPrompt) {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key missing");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const openAiError = data?.error?.message || "OpenAI API Error";
    throw new Error(openAiError);
  }

  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from OpenAI");
  return { payload: text, source: `openai:${OPENAI_MODEL}` };
}

async function callGrok(systemPrompt, userPrompt) {
  if (!GROK_API_KEY) {
    throw new Error("Grok API key missing");
  }

  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROK_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const grokError = data?.error?.message || "Grok API Error";
    throw new Error(grokError);
  }

  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from Grok");
  return { payload: text, source: `grok:${GROK_MODEL}` };
}

async function resolveContent(context, input) {
  try {
    return await callGemini(context, input);
  } catch (geminiError) {
    if (!isQuotaOrRateLimitError(geminiError?.message)) {
      throw geminiError;
    }

    try {
      return await callOpenAI(context, input);
    } catch {
      return callGrok(context, input);
    }
  }
}

module.exports = async function handler(req, res) {
  withCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const context = String(body.context || "").trim();
    const input = String(body.input || "").trim();

    if (!context || !input) {
      return res.status(400).json({ error: "context and input are required" });
    }

    const result = await resolveContent(context, input);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Content proxy error" });
  }
};
