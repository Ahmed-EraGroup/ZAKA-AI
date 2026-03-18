import type { VercelRequest, VercelResponse } from "@vercel/node";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

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
        max_tokens: 250,
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
