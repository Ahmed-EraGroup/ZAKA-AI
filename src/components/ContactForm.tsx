import { useState, useRef, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
    "w-full bg-midnight border border-border rounded-2xl px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-clay/50 focus:shadow-[0_0_0_3px_rgba(201,107,62,0.1),0_0_20px_rgba(201,107,62,0.06)] transition-all duration-300 font-mono-system";

  return (
    <section className="section-spacing px-8 md:px-16" id="deploy" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display font-bold text-3xl md:text-5xl text-heading-gradient mt-4 mb-4">
          جاهز تنشر وكيلك الذكي؟
        </h2>
        <p className="text-foreground/75 mb-12">أدخل بياناتك وسنتواصل معك لنشر الوكيل في موقعك.</p>

        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "زمن استجابة أقل من 200ms", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
            { label: "دعم عربي كامل", icon: "M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" },
            { label: "تكامل مباشر مع CRM", icon: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card/60 px-4 py-3 text-sm text-foreground/75">
              <svg className="w-4 h-4 text-clay flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </div>
          ))}
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
