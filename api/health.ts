import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    ok: true,
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    env: {
      GROQ_API_KEY: process.env.GROQ_API_KEY ? "SET (" + process.env.GROQ_API_KEY.slice(0, 6) + "...)" : "MISSING",
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? "SET" : "MISSING",
      ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY ? "SET" : "MISSING",
    },
  });
}
