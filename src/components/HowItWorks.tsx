import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    id: "01",
    title: "استماع فوري",
    desc: "الوكيل يستقبل سؤال الزائر صوتيًا أو كتابيًا ويحدد نية الطلب خلال ثوانٍ.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    id: "02",
    title: "فهم وسياق",
    desc: "يفهم سياق نشاطك ويربط الإجابة بالمعلومات الصحيحة بدل الردود العامة.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    id: "03",
    title: "تنفيذ تلقائي",
    desc: "ينفّذ الإجراء مباشرة: تأهيل عميل، إنشاء تذكرة، أو إرسال الطلب للنظام الداخلي.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-how-title]",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true } }
      );

      gsap.fromTo("[data-how-card]",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%", once: true } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-spacing px-8 md:px-16" id="how-it-works" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14" data-how-title>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-heading-gradient mt-4">
            كيف يعمل في موقعك؟
          </h2>
          <p className="text-foreground/75 text-lg mt-4">
            تدفق بسيط من 3 خطوات: استلام الطلب، فهمه، ثم تنفيذه تلقائيًا.
          </p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-6">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-16 right-[16.67%] left-[16.67%] h-[1px] bg-gradient-to-l from-clay/40 via-clay/20 to-clay/40 pointer-events-none" />

          {steps.map((step, i) => (
            <article
              key={step.id}
              data-how-card
              className="group relative bg-card/80 backdrop-blur-sm rounded-2xl border border-border/60 p-7 hover:border-clay/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-clay/[0.05]"
            >
              {/* Large background number */}
              <span className="absolute top-4 left-4 font-display font-black text-7xl text-foreground/[0.03] leading-none select-none pointer-events-none transition-colors duration-500 group-hover:text-clay/[0.08]">
                {step.id}
              </span>

              {/* Icon + step number */}
              <div className="relative flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-clay/10 border border-clay/20 flex items-center justify-center text-clay transition-colors duration-300 group-hover:bg-clay/20">
                  {step.icon}
                </div>
                <span className="font-mono-system text-clay/60 text-xs">
                  خطوة {step.id}
                </span>
                {/* Connector dot (desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute -left-3 top-5 w-2 h-2 rounded-full bg-clay/30 border border-clay/40" />
                )}
              </div>

              <h3 className="font-display text-2xl font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-foreground/70 leading-relaxed">{step.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
