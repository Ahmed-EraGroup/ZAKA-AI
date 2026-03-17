import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = { api: { bodyParser: false } };

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Build multipart/form-data manually — no FormData/Blob globals needed
function buildMultipart(audioBuffer: Buffer, mimeType: string) {
  const boundary = `----Boundary${Date.now()}`;
  const parts: Buffer[] = [];

  // file field
  parts.push(Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="audio.webm"\r\nContent-Type: ${mimeType}\r\n\r\n`
  ));
  parts.push(audioBuffer);
  parts.push(Buffer.from("\r\n"));

  // text fields
  for (const [key, val] of [
    ["model", "whisper-large-v3-turbo"],
    ["language", "ar"],
    ["response_format", "json"],
  ]) {
    parts.push(Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${val}\r\n`
    ));
  }

  parts.push(Buffer.from(`--${boundary}--\r\n`));

  return {
    body: Buffer.concat(parts),
    contentType: `multipart/form-data; boundary=${boundary}`,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!GROQ_API_KEY) return res.status(500).json({ error: "GROQ_API_KEY not configured" });

  try {
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", resolve);
      req.on("error", reject);
    });
    const audioBuffer = Buffer.concat(chunks);

    const mimeType = (req.headers["content-type"] as string) || "audio/webm";
    const { body, contentType } = buildMultipart(audioBuffer, mimeType);

    const sttRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": contentType,
        "Content-Length": body.byteLength.toString(),
      },
      body,
    });

    if (!sttRes.ok) {
      const err = await sttRes.text();
      console.error("Groq STT error:", sttRes.status, err);
      return res.status(502).json({ error: "STT service error", details: err });
    }

    const data = await sttRes.json() as { text?: string };
    return res.status(200).json({ text: data.text || "" });
  } catch (err: any) {
    console.error("STT function error:", err);
    return res.status(500).json({ error: err.message });
  }
}
