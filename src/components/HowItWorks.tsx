import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    id: "01",
    title: "استماع فوري",
    desc: "الوكيل يستقبل سؤال الزائر صوتيًا أو كتابيًا ويحدد نية الطلب خلال ثوانٍ.",
  },
  {
    id: "02",
    title: "فهم وسياق",
    desc: "يفهم سياق نشاطك ويربط الإجابة بالمعلومات الصحيحة بدل الردود العامة.",
  },
  {
    id: "03",
    title: "تنفيذ تلقائي",
    desc: "ينفّذ الإجراء مباشرة: تأهيل عميل، إنشاء تذكرة، أو إرسال الطلب للنظام الداخلي.",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-how-title]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        y: 24,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from("[data-how-card]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        y: 40,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-spacing px-8 md:px-16" id="how-it-works" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10" data-how-title>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-heading-gradient mt-4">
            كيف يعمل في موقعك؟
          </h2>
          <p className="text-foreground/75 text-lg mt-4">
            تدفق بسيط من 3 خطوات: استلام الطلب، فهمه، ثم تنفيذه تلقائيًا.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <article
              key={step.id}
              data-how-card
              className="bg-card/95 backdrop-blur-sm rounded-2xl border border-border/80 p-6"
            >
              <span className="font-mono-system text-clay text-sm">{step.id}</span>
              <h3 className="font-display text-2xl font-bold mt-2 text-foreground">{step.title}</h3>
              <p className="mt-3 text-foreground/75 leading-relaxed">{step.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
