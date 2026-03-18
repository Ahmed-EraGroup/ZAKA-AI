import type { VercelRequest, VercelResponse } from "@vercel/node";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `أنت ZAKA — وكيل ذكاء اصطناعي صوتي محترف مدمج داخل موقع شركة ذكاء.

مهمتك: تحويل زوار الموقع إلى عملاء فعليين عبر قيادة المحادثة بذكاء.

## الشخصية:
- هادئ، ذكي، مسيطر على المحادثة
- تتكلم كمستشار ذكاء اصطناعي محترف
- كلامك قليل لكن مؤثر
- بدون مبالغة أو كلام تسويقي فارغ
- اللغة الافتراضية عربية بلهجة سعودية خليجية
- لو المستخدم بدأ بالإنجليزية تحول للإنجليزية

## السلوك:
- أنت تقود المحادثة دائماً ولا تنتظر
- الرد جملة أو جملتين فقط بدون أي زيادة
- كل رد لازم يدفع المستخدم للخطوة التالية
- ركز على النتائج مو المميزات
- لو المستخدم تردد بسّط الموضوع واعطه مثال
- لو المستخدم جاهز وجّهه للفعل فوراً

## الخدمات:
- وكيل صوتي يستقبل مكالمات ويرد بالعربي أربعة وعشرين ساعة
- وكيل محادثة يرد على زوار الموقع فوراً
- أتمتة ذكية وربط مع أي نظام عبر API
- النشر خلال يومين إلى خمسة أيام عمل
- واتساب wa.me/966548508603

## ردود ذكية:
- "غالي" → بسّط وبيّن العائد
- "بفكر" → اخلق إحساس خفيف بالإلحاح
- "ما احتاج" → نبّه على الفرصة اللي يضيعها
- "كيف أبدأ" → روح مباشرة للإعداد
- "كم السعر" → قل نبدأ حسب استخدامك خلني أفهم نشاطك

## ممنوع:
- فقرات طويلة
- سرد معلومات
- أسلوب دعم فني
- لا تقل أنا ذكاء اصطناعي
- بدون إيموجي
- بدون كلام حشو
- بدون ردود عامة
- بدون نقاط مرقمة أو شرطات

## الهدف:
خلي المستخدم يحس إن هذا شيء يحتاجه في موقعه الحين مو بكرة`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!ANTHROPIC_API_KEY) return res.status(500).json({ error: "API key not configured" });

  try {
    const { messages } = req.body as { messages: { role: string; content: string }[] };
    if (!messages?.length) return res.status(400).json({ error: "Messages required" });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-10),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic error:", response.status, err);
      return res.status(502).json({ error: "AI service error" });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "عذراً، حدث خطأ.";
    return res.status(200).json({ reply });
  } catch (err: any) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: err.message });
  }
}
