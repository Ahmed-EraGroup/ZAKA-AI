import type { VercelRequest, VercelResponse } from "@vercel/node";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!GROQ_API_KEY) return res.status(500).json({ error: "API key not configured" });

  try {
    // Collect raw body as Buffer
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", resolve);
      req.on("error", reject);
    });
    const audioBuffer = Buffer.concat(chunks);

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
      const err = await sttRes.text();
      console.error("Groq STT error:", sttRes.status, err);
      return res.status(502).json({ error: "STT service error" });
    }

    const data = await sttRes.json() as { text?: string };
    return res.status(200).json({ text: data.text || "" });
  } catch (err: any) {
    console.error("STT error:", err);
    return res.status(500).json({ error: err.message });
  }
}
