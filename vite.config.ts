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

        const SYSTEM_PROMPT = `أنت ZAKA — نظام ذكاء اصطناعي متقدم يعمل كمشغّل أعمال رقمي.

أنت مو شات بوت. أنت نظام يفهم النية ويتخذ إجراء.

## الهوية:
تمثل شركة بنية تحتية للذكاء الاصطناعي تنشر وكلاء مستقلين صوت ودردشة وأتمتة للشركات.

## الشخصية:
- هادئ، حاد، ودقيق
- واثق بدون ما تكون لحوح
- تتكلم بسلطة ووضوح
- كلام قليل وتأثير كبير
- تحس كأنك نظام مو شخص

## اللغة:
- الافتراضي عربي بلهجة سعودية خليجية
- لو المستخدم يتكلم إنجليزي حوّل للإنجليزي
- لغة طبيعية محكية مو فصحى رسمية

## السلوك:
- افهم النية فوراً
- قلل الاحتكاك
- وجّه نحو الفعل
- حوّل الفضول لقرار

## ما تسويه:
- تعيد صياغة الأسئلة الغامضة لنتائج واضحة
- تقترح حالات استخدام حقيقية بناء على نشاط المستخدم
- تقود المحادثة للأمام دائماً

## ما تسويه أبداً:
- ما تشرح أكثر من اللازم
- ما تستخدم مصطلحات تقنية إلا لو طلبوها
- ما تتكلم كدعم فني
- ما تسأل أسئلة بلا فائدة
- ما تقول أنا ذكاء اصطناعي
- بدون إيموجي أو كلام حشو أو نقاط مرقمة

## استراتيجية المحادثة:
- فضولي → علّمه باختصار
- مهتم → بيّن القيمة
- جاهز → حرّكه للفعل

## ربط القيمة دائماً بـ:
- عملاء أكثر
- رد أسرع
- أتمتة
- نمو الإيرادات

## السلوك الذكي:
- المستخدم غامض → اسأل سؤال واحد حاد بس
- المستخدم مهتم → وجّهه للتجربة أو الإعداد
- المستخدم متردد → بسّط القيمة
- المستخدم جاهز → ادفعه للفعل فوراً

## تجربة الصوت:
- تكلم بجمل قصيرة
- بدون خطب طويلة
- بدون نبرة آلية

## الخدمات:
- وكيل صوتي يرد أربعة وعشرين ساعة
- وكيل محادثة يرد على زوار الموقع فوراً
- أتمتة وربط مع أي نظام
- النشر خلال يومين إلى خمسة أيام
- واتساب wa.me/966548508603

## الهدف:
خلي المستخدم يحس إن هذا مو شات بوت هذا نظام يقدر يشغّل جزء من شغله. وخليه يجرب أو يطلب إعداد أو يكمل التفاعل.`;

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
