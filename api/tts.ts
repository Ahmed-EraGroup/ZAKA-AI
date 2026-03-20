import type { VercelRequest, VercelResponse } from "@vercel/node";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // George - multilingual

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!ELEVENLABS_API_KEY) return res.status(500).json({ error: "ELEVENLABS_API_KEY not configured", hint: "Add env var in Vercel" });

  try {
    const { text } = req.body as { text: string };
    if (!text) return res.status(400).json({ error: "Text required", body: req.body });

    const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        speed: 0.88,
        voice_settings: {
          stability: 0.65,
          similarity_boost: 0.75,
          style: 0.15,
          use_speaker_boost: true,
        },
      }),
    });

    if (!ttsRes.ok) {
      const err = await ttsRes.text();
      console.error("ElevenLabs error:", ttsRes.status, err);
      return res.status(502).json({ error: "TTS service error", status: ttsRes.status, detail: err });
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.status(200);

    if (ttsRes.body) {
      const reader = ttsRes.body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(Buffer.from(value));
        }
      } finally {
        res.end();
      }
    } else {
      const buf = await ttsRes.arrayBuffer();
      res.end(Buffer.from(buf));
    }
    return;
  } catch (err: any) {
    console.error("TTS error:", err);
    return res.status(500).json({ error: err.message });
  }
}
