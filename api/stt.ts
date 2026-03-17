import type { VercelRequest, VercelResponse } from "@vercel/node";
import FormData from "form-data";

export const config = { api: { bodyParser: false } };

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!GROQ_API_KEY) return res.status(500).json({ error: "GROQ_API_KEY not configured" });

  try {
    // Read raw binary body
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      req.on("data", (chunk: Buffer) => chunks.push(chunk));
      req.on("end", resolve);
      req.on("error", reject);
    });
    const audioBuffer = Buffer.concat(chunks);

    if (audioBuffer.length === 0) {
      return res.status(400).json({ error: "Empty audio" });
    }

    // Use form-data package — getBuffer() + getHeaders() works with native fetch
    const form = new FormData();
    form.append("file", audioBuffer, { filename: "audio.webm", contentType: "audio/webm" });
    form.append("model", "whisper-large-v3-turbo");
    form.append("language", "ar");
    form.append("response_format", "json");

    const formBuffer = form.getBuffer();
    const formHeaders = form.getHeaders();

    const sttRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        ...formHeaders,
      },
      body: new Uint8Array(formBuffer),
    });

    if (!sttRes.ok) {
      const err = await sttRes.text();
      console.error("Groq STT error:", sttRes.status, err);
      return res.status(502).json({ error: "STT service error", details: err });
    }

    const data = await sttRes.json() as { text?: string };
    return res.status(200).json({ text: data.text || "" });
  } catch (err: any) {
    console.error("STT function error:", err.message, err.stack);
    return res.status(500).json({ error: err.message });
  }
}
