import type { Handler, HandlerEvent } from "@netlify/functions";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `أنت المساعد الذكي لشركة "ذكاء" (ZAKA). تتحدث بالعربية بأسلوب ودود ومهني.

## عن ذكاء:
البنية التحتية لوكلاء الذكاء الاصطناعي في السعودية. ننشر وكلاء صوت ودردشة وأتمتة مستقلين داخل مواقع العملاء خلال أيام.

## الخدمات:
1. وكيل صوتي — يستقبل مكالمات ويرد بالصوت بالعربي أربعة وعشرين ساعة طوال الأسبوع. يفهم نية المتصل ويجيب من بيانات نشاط العميل.
2. وكيل محادثة — دردشة ذكية ترد على زوار الموقع فوراً، تؤهل العملاء، وتحوّل للفريق عند الحاجة.
3. أتمتة ذكية — ربط مع CRM وأنظمة داخلية وتنفيذ تلقائي (تأهيل عملاء، إنشاء تذاكر، إرسال طلبات).

## الباقات:
- باقة تأسيسية: وكيل واحد، 1,000 تفاعل/شهر
- باقة نمو: 3 وكلاء، 10,000 تفاعل/شهر، تكامل CRM
- باقة مؤسسية: وكلاء غير محدودة، SLA مخصص، دعم أولوية

## معلومات:
- النشر خلال 2-5 أيام عمل
- دعم فني مستمر أربعة وعشرين ساعة طوال الأسبوع
- ندعم العربية والإنجليزية
- نتكامل مع أي CRM أو نظام عبر API
- واتساب: wa.me/966548508603

## تعليمات:
- أجب بإيجاز ووضوح (3-5 أسطر كحد أقصى)
- إذا سألوا عن أسعار محددة بالأرقام، قل "تواصل معنا للحصول على عرض سعر مخصص"
- إذا السؤال خارج نطاق خدماتنا، وجّههم للتواصل المباشر عبر واتساب أو نموذج التواصل
- كن ودوداً ومباشراً
- لا تخترع معلومات غير موجودة أعلاه
- ردودك قد تُقرأ بصوت عالٍ، اكتبها كجمل متدفقة طبيعية بدون إيموجي أو نقاط مرقّمة أو رموز خاصة`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const handler: Handler = async (event: HandlerEvent) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  if (!ANTHROPIC_API_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "API key not configured" }) };
  }

  try {
    const { messages } = JSON.parse(event.body || "{}") as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Messages required" }) };
    }

    // Limit conversation history to last 10 messages to control costs
    const trimmedMessages = messages.slice(-10);

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
        messages: trimmedMessages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: "AI service error" }),
      };
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "عذراً، حدث خطأ. حاول مرة أخرى.";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal error" }),
    };
  }
};
