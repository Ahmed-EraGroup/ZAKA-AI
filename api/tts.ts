import type { VercelRequest, VercelResponse } from "@vercel/node";

const AZURE_SPEECH_KEY    = process.env.AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || "eastus";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!AZURE_SPEECH_KEY) return res.status(500).json({ error: "Azure Speech key not configured" });

  try {
    const { text } = req.body as { text: string };
    if (!text) return res.status(400).json({ error: "Text required" });

    const ssml = `<speak version='1.0' xml:lang='ar-SA'>
  <voice name='ar-SA-ZariyahNeural'>
    <prosody rate='0%' pitch='0%'>
      ${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
    </prosody>
  </voice>
</speak>`;

    const ttsRes = await fetch(
      `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
        },
        body: ssml,
      }
    );

    if (!ttsRes.ok) {
      const err = await ttsRes.text();
      console.error("Azure TTS error:", ttsRes.status, err);
      return res.status(502).json({ error: "TTS service error" });
    }

    const audioBuffer = await ttsRes.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", audioBuffer.byteLength.toString());
    return res.status(200).send(Buffer.from(audioBuffer));
  } catch (err: any) {
    console.error("TTS error:", err);
    return res.status(500).json({ error: err.message });
  }
}
