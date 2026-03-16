import type { Handler, HandlerEvent } from "@netlify/functions";

const AZURE_SPEECH_KEY    = process.env.AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || "eastus";

export const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: "Method not allowed" };
  if (!AZURE_SPEECH_KEY) return { statusCode: 500, headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ error: "Azure Speech key not configured" }) };

  try {
    const { text } = JSON.parse(event.body || "{}");
    if (!text) return { statusCode: 400, headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ error: "Text required" }) };

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
      return { statusCode: 502, headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ error: "TTS service error" }) };
    }

    const audioBuffer = await ttsRes.arrayBuffer();
    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "audio/mpeg" },
      body: Buffer.from(audioBuffer).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err: any) {
    console.error("TTS function error:", err);
    return { statusCode: 500, headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ error: err.message }) };
  }
};
