import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq, { toFile } from "groq-sdk";

export const config = { api: { bodyParser: false } };

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: "GROQ_API_KEY not configured" });

  try {
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      req.on("data", (chunk: Buffer) => chunks.push(chunk));
      req.on("end", resolve);
      req.on("error", reject);
    });
    const audioBuffer = Buffer.concat(chunks);

    const file = await toFile(audioBuffer, "audio.webm", { type: "audio/webm" });

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
