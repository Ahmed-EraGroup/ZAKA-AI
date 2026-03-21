import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq, { toFile } from "groq-sdk";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed", received: req.method, url: req.url });
  if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: "GROQ_API_KEY not configured" });

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const { audio, mimeType } = req.body as { audio: string; mimeType: string };
    const base64Data = audio.includes(",") ? audio.split(",")[1] : audio;
    const audioBuffer = Buffer.from(base64Data, "base64");

    const file = await toFile(audioBuffer, "audio.webm", { type: mimeType || "audio/webm" });

    const transcription = await groq.audio.transcriptions.create({
      file,
      model: "whisper-large-v3-turbo",
      language: "ar",
      response_format: "json",
    });

    return res.status(200).json({ text: transcription.text || "" });
  } catch (err: any) {
    console.error("STT error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
