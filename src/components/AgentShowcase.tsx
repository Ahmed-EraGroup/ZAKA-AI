import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AgentShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-showcase-anim]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative section-spacing overflow-hidden bg-background"
      id="agent-showcase"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-16 text-center" dir="rtl">
        <h2
          data-showcase-anim
          className="font-display font-bold text-3xl md:text-5xl text-heading-gradient mt-4"
        >
          لمن هذه الخدمة؟
        </h2>

        <ul data-showcase-anim className="flex flex-wrap justify-center gap-2 mt-8">
          {[
            "المتاجر الإلكترونية",
            "الشركات الخدمية",
            "شركات التقنية",
            "المؤسسات التي تستقبل استفسارات يوميًا",
            "أي نشاط يريد تقليل التكلفة وزيادة الاستجابة",
          ].map((item) => (
            <li
              key={item}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-muted-foreground"
            >
              {item}
            </li>
          ))}
        </ul>

        <div data-showcase-anim className="mt-8">
          <a
            href="#deploy"
            className="relative inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-sm text-foreground bg-gradient-to-l from-cyan-500 to-purple-600 shadow-[0_0_30px_rgba(6,182,212,0.4),0_0_60px_rgba(147,51,234,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6),0_0_80px_rgba(147,51,234,0.3)] transition-shadow duration-300"
          >
            ابدأ الآن
          </a>
        </div>
      </div>
    </section>
  );
};

export default AgentShowcase;
