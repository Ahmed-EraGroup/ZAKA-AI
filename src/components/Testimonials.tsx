import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "محمد العتيبي",
    role: "مدير تسويق، شركة خدمات",
    quote:
      "ذكاء حوّل طريقة تعاملنا مع الزوار — الوكيل يرد فورياً بينما فريقنا ينام. خسرنا صفر عملاء بعد الساعة 6 مساءً.",
    rating: 5,
  },
  {
    name: "سارة القحطاني",
    role: "مؤسسة شركة ناشئة، Riyadh Tech",
    quote:
      "ربطنا النظام بـ CRM بيومين فقط. زادت نسبة تحويل العملاء المحتملين 40% خلال الشهر الأول.",
    rating: 5,
  },
  {
    name: "فيصل الدوسري",
    role: "صاحب متجر إلكتروني",
    quote:
      "كنا نخسر عملاء يومياً بسبب التأخر في الرد. ذكاء حل المشكلة بالكامل وبسعر أقل من موظف واحد.",
    rating: 5,
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-1 mb-4">
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} className="w-4 h-4 text-clay fill-clay" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-testimonial]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        y: 50,
        opacity: 0,
        duration: 0.75,
        stagger: 0.18,
        ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-spacing px-8 md:px-16" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-5xl text-heading-gradient mt-4">
            ماذا قالوا عنّا
          </h2>
          <p className="text-muted-foreground text-lg mt-4">
            عملاء حقيقيون، نتائج قابلة للقياس
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              data-testimonial
              className="bg-card/95 backdrop-blur-sm rounded-2xl border border-border/80 p-8 flex flex-col gap-4 hover:border-clay/30 transition-colors duration-300"
            >
              <Stars count={t.rating} />
              <p className="text-foreground/85 leading-relaxed flex-1">"{t.quote}"</p>
              <div className="border-t border-border/50 pt-4">
                <p className="font-display font-semibold text-foreground">{t.name}</p>
                <p className="text-muted-foreground text-sm mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
