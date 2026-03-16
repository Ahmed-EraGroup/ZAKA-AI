import type { Handler, HandlerEvent } from "@netlify/functions";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: "Method not allowed" };
  if (!GROQ_API_KEY) return { statusCode: 500, headers, body: JSON.stringify({ error: "API key not configured" }) };

  try {
    const audioBuffer = Buffer.from(event.body || "", event.isBase64Encoded ? "base64" : "utf8");

    // Use native Node.js 18 FormData + Blob (no npm package needed)
    const blob = new Blob([audioBuffer], { type: "audio/webm" });
    const form = new FormData();
    form.append("file", blob, "audio.webm");
    form.append("model", "whisper-large-v3-turbo");
    form.append("language", "ar");
    form.append("response_format", "json");

    const sttRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${GROQ_API_KEY}` },
      body: form,
    });

    if (!sttRes.ok) {
      const errText = await sttRes.text();
      console.error("Groq STT error:", sttRes.status, errText);
      return { statusCode: 502, headers, body: JSON.stringify({ error: "STT service error" }) };
    }

    const data = (await sttRes.json()) as { text?: string };
    return { statusCode: 200, headers, body: JSON.stringify({ text: data.text || "" }) };
  } catch (err: any) {
    console.error("STT function error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
