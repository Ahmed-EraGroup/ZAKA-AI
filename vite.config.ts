import { defineConfig, type PluginOption, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// ── Dev-only: proxy /.netlify/functions/chat → Anthropic API ──
function chatProxyPlugin(): PluginOption {
  return {
    name: "chat-proxy",
    configureServer(server) {
      // Load all env vars (including non-VITE_ prefixed)
      const env = loadEnv("development", process.cwd(), "");
      const anthropicKey = env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;

      const azureSpeechKey    = env.AZURE_SPEECH_KEY    || process.env.AZURE_SPEECH_KEY;
      const azureSpeechRegion = env.AZURE_SPEECH_REGION || process.env.AZURE_SPEECH_REGION || "eastus";
      const groqKey = env.GROQ_API_KEY || process.env.GROQ_API_KEY;

      // ── STT via Groq Whisper ──
      server.middlewares.use("/api/stt", async (req, res) => {
        const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" };
        if (req.method === "OPTIONS") { res.writeHead(204, corsHeaders); res.end(); return; }
        if (req.method !== "POST") { res.writeHead(405); res.end(); return; }

        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const audioBuffer = Buffer.concat(chunks);

        if (!groqKey) {
          res.writeHead(500, { "Content-Type": "application/json", ...corsHeaders });
          res.end(JSON.stringify({ error: "GROQ_API_KEY not set" })); return;
        }

        try {
          // Use Node.js 18+ built-in FormData + Blob
          const blob = new Blob([audioBuffer], { type: "audio/webm" });
          const form = new FormData();
          form.append("file", blob, "audio.webm");
          form.append("model", "whisper-large-v3-turbo");
          form.append("language", "ar");
          form.append("response_format", "json");

          const sttRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${groqKey}` },
            body: form,
          });

          if (!sttRes.ok) {
            const err = await sttRes.text();
            console.error("Groq STT error:", sttRes.status, err);
            res.writeHead(502, { "Content-Type": "application/json", ...corsHeaders });
            res.end(JSON.stringify({ error: "STT error", details: err })); return;
          }

          const data = (await sttRes.json()) as { text?: string };
          res.writeHead(200, { "Content-Type": "application/json", ...corsHeaders });
          res.end(JSON.stringify({ text: data.text || "" }));
        } catch (err: any) {
          console.error("STT proxy error:", err);
          res.writeHead(500, { "Content-Type": "application/json", ...corsHeaders });
          res.end(JSON.stringify({ error: err.message }));
        }
      });

      // ── TTS via Azure Speech ──
      server.middlewares.use("/api/tts", async (req, res) => {
        const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" };
        if (req.method === "OPTIONS") { res.writeHead(204, corsHeaders); res.end(); return; }
        if (req.method !== "POST") { res.writeHead(405); res.end(); return; }

        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const { text } = JSON.parse(Buffer.concat(chunks).toString());

        if (!azureSpeechKey) {
          res.writeHead(500, { "Content-Type": "application/json", ...corsHeaders });
          res.end(JSON.stringify({ error: "AZURE_SPEECH_KEY not set" }));
          return;
        }

        try {
          const ssml = `<speak version='1.0' xml:lang='ar-SA'>
  <voice name='ar-SA-ZariyahNeural'>
    <prosody rate='0%' pitch='0%'>
      ${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
    </prosody>
  </voice>
</speak>`;

          const ttsRes = await fetch(
            `https://${azureSpeechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`,
            {
              method: "POST",
              headers: {
                "Ocp-Apim-Subscription-Key": azureSpeechKey,
                "Content-Type": "application/ssml+xml",
                "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
              },
              body: ssml,
            }
          );

          if (!ttsRes.ok) {
            const err = await ttsRes.text();
            console.error("Azure TTS error:", ttsRes.status, err);
            res.writeHead(502, { "Content-Type": "application/json", ...corsHeaders });
            res.end(JSON.stringify({ error: "TTS error" }));
            return;
          }

          const audioBuffer = await ttsRes.arrayBuffer();
          res.writeHead(200, {
            "Content-Type": "audio/mpeg",
            "Content-Length": audioBuffer.byteLength.toString(),
            ...corsHeaders,
          });
          res.end(Buffer.from(audioBuffer));
        } catch (err: any) {
          console.error("TTS proxy error:", err);
          res.writeHead(500, { "Content-Type": "application/json", ...corsHeaders });
          res.end(JSON.stringify({ error: err.message }));
        }
      });

      // ── Chat via Anthropic ──
      server.middlewares.use("/.netlify/functions/chat", async (req, res) => {
        if (req.method === "OPTIONS") {
          res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
          });
          res.end();
          return;
        }

        if (req.method !== "POST") {
          res.writeHead(405);
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        // Read body
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const body = JSON.parse(Buffer.concat(chunks).toString());

        const apiKey = anthropicKey;
        if (!apiKey) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "ANTHROPIC_API_KEY not set in .env" }));
          return;
        }

        const SYSTEM_PROMPT = `أنت المساعد الذكي لشركة "ذكاء" (ZAKA). تتحدث بالعربية بأسلوب ودود ومهني.

## عن ذكاء:
البنية التحتية لوكلاء الذكاء الاصطناعي في السعودية. ننشر وكلاء صوت ودردشة وأتمتة مستقلين داخل مواقع العملاء خلال أيام.

## الخدمات:
1. وكيل صوتي — يستقبل مكالمات ويرد بالصوت بالعربي أربعة وعشرين ساعة طوال الأسبوع
2. وكيل محادثة — دردشة ذكية ترد على زوار الموقع فوراً
3. أتمتة ذكية — ربط مع CRM وأنظمة داخلية وتنفيذ تلقائي

## الباقات:
- باقة تأسيسية: وكيل واحد، 1,000 تفاعل/شهر
- باقة نمو: 3 وكلاء، 10,000 تفاعل/شهر، تكامل CRM
- باقة مؤسسية: وكلاء غير محدودة، SLA مخصص

## معلومات:
- النشر خلال 2-5 أيام عمل
- دعم فني مستمر أربعة وعشرين ساعة طوال الأسبوع
- ندعم العربية والإنجليزية
- نتكامل مع أي CRM أو نظام عبر API
- واتساب: wa.me/966548508603

## تعليمات:
- أجب بإيجاز ووضوح (3-5 أسطر كحد أقصى)
- إذا سألوا عن أسعار محددة بالأرقام، قل "تواصل معنا للحصول على عرض سعر مخصص"
- إذا السؤال خارج نطاق خدماتنا، وجّههم للتواصل المباشر
- كن ودوداً واستخدم إيموجي باعتدال
- لا تخترع معلومات غير موجودة أعلاه
- ردودك ستُقرأ بصوت عالٍ، لذا اكتبها كما تتحدث بالعربية الفصحى البسيطة
- لا تستخدم إيموجي أو رموز خاصة أو نقاط ترقيم متكررة
- لا تستخدم النقاط المرقّمة أو الشرطات — اكتب جملاً متدفقة طبيعية
- اجعل الرد قصيراً، جملتان أو ثلاث كحد أقصى
- تحدث بأسلوب ودود ومباشر كأنك تكلم شخصاً أمامك`;

        try {
          const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: "claude-haiku-4-5-20251001",
              max_tokens: 400,
              system: SYSTEM_PROMPT,
              messages: (body.messages || []).slice(-10),
            }),
          });

          if (!apiRes.ok) {
            const errText = await apiRes.text();
            console.error("Anthropic API error:", apiRes.status, errText);
            res.writeHead(502, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "AI service error", details: errText }));
            return;
          }

          const data = (await apiRes.json()) as { content?: { text?: string }[] };
          const reply = data.content?.[0]?.text || "عذراً، حدث خطأ.";

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ reply }));
        } catch (err: any) {
          console.error("Chat proxy error:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "development" && chatProxyPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-three": ["three", "@react-three/fiber", "@react-three/drei"],
          "vendor-gsap": ["gsap", "lenis"],
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
}));
