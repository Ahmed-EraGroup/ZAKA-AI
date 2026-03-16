import { useState, useRef, type FormEvent } from "react";
import { z } from "zod";
import emailjs from "@emailjs/browser";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// ── EmailJS config ─────────────────────────────────
// 1. سجّل حساب مجاني على https://www.emailjs.com
// 2. أضف خدمة بريد (Gmail مثلاً) → انسخ Service ID
// 3. أنشئ Template فيها المتغيرات: {{from_name}}, {{from_email}}, {{company}}, {{message}}
//    واجعل To Email = ahmed@letsw.com
// 4. انسخ Template ID و Public Key وحطهم هنا:
const EMAILJS_SERVICE  = "service_zaka";    // ← غيّره
const EMAILJS_TEMPLATE = "template_zaka";   // ← غيّره
const EMAILJS_PUBLIC   = "YOUR_PUBLIC_KEY"; // ← غيّره

const leadSchema = z.object({
  name: z.string().trim().min(1, "الاسم مطلوب").max(100),
  email: z.string().trim().email("بريد إلكتروني غير صالح").max(255),
  company: z.string().trim().max(100).optional(),
  message: z.string().trim().min(1, "الرسالة مطلوبة").max(1000),
});

const ContactForm = () => {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = leadSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    // Save to Supabase
    const { error } = await supabase.from("leads").insert([
      {
        name: result.data.name,
        email: result.data.email,
        company: result.data.company || null,
        message: result.data.message,
      },
    ]);

    // Send email notification via EmailJS
    try {
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
        from_name: result.data.name,
        from_email: result.data.email,
        company: result.data.company || "—",
        message: result.data.message,
      }, EMAILJS_PUBLIC);
    } catch {
      // Email send failed silently — lead is still saved in Supabase
    }

    setLoading(false);

    if (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ ما. حاول مرة أخرى.",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "تم الإرسال", description: "سنتواصل معك قريبًا." });
    setForm({ name: "", email: "", company: "", message: "" });
  };

  const inputClass =
    "w-full bg-midnight border border-border rounded-2xl px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-clay/50 transition-all font-mono-system";

  return (
    <section className="section-spacing px-8 md:px-16" id="deploy" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display font-bold text-3xl md:text-5xl text-heading-gradient mt-4 mb-4">
          جاهز تنشر وكيلك الذكي؟
        </h2>
        <p className="text-foreground/75 mb-12">أدخل بياناتك وسنتواصل معك لنشر الوكيل في موقعك.</p>

        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border/80 bg-card/80 px-4 py-3 text-center text-sm text-foreground/80">
            زمن استجابة أقل من 200ms
          </div>
          <div className="rounded-xl border border-border/80 bg-card/80 px-4 py-3 text-center text-sm text-foreground/80">
            دعم عربي كامل
          </div>
          <div className="rounded-xl border border-border/80 bg-card/80 px-4 py-3 text-center text-sm text-foreground/80">
            تكامل مباشر مع CRM
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              placeholder="الاسم"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
            {errors.name && <p className="text-clay text-xs mt-1 font-mono-system">{errors.name}</p>}
          </div>

          <div>
            <input
              placeholder="اسم الشركة"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
            {errors.email && <p className="text-clay text-xs mt-1 font-mono-system">{errors.email}</p>}
          </div>

          <div>
            <textarea
              placeholder="رسالتك"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={`${inputClass} resize-none`}
            />
            {errors.message && <p className="text-clay text-xs mt-1 font-mono-system">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full bg-clay text-foreground font-semibold py-4 rounded-full text-sm overflow-hidden transition-all hover:shadow-lg hover:shadow-clay/30 disabled:opacity-50"
          >
            <span className="relative z-10">{loading ? "جارٍ النشر..." : "نشر الوكيل في موقعي"}</span>
            <span className="absolute inset-0 bg-foreground/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
