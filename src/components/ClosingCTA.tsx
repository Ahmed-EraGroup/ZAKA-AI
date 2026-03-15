import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ClosingCTA = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-cta-el]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative section-spacing px-8 md:px-16 overflow-hidden"
      dir="rtl"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(201,107,62,0.12) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <p data-cta-el className="font-mono-system text-xs text-clay uppercase tracking-widest mb-4">
          ابدأ الآن
        </p>

        <h2
          data-cta-el
          className="font-display font-extrabold text-4xl md:text-6xl text-heading-gradient leading-tight"
        >
          وكيلك الذكي
          <br />
          ينتظرك
        </h2>

        <p data-cta-el className="text-muted-foreground text-lg mt-6 leading-relaxed">
          انشر وكيل صوت أو دردشة داخل موقعك خلال أيام — بدون تعقيد تقني، بدون فريق كبير.
        </p>

        <div data-cta-el className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#deploy"
            className="inline-flex items-center gap-3 bg-clay text-bone font-semibold px-8 py-4 rounded-full shadow-lg shadow-clay/25 hover:brightness-95 hover:scale-[1.02] transition-all duration-200"
          >
            احجز عرض مجاني
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#agents"
            className="inline-flex items-center gap-3 border border-border/60 text-foreground/80 px-8 py-4 rounded-full hover:border-clay/40 hover:text-foreground transition-all duration-200"
          >
            اكتشف الوكلاء
          </a>
        </div>

        {/* Trust indicators */}
        <div data-cta-el className="mt-12 flex flex-wrap justify-center gap-8 text-xs text-muted-foreground font-mono-system">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            إعداد في أقل من 48 ساعة
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-clay" />
            دعم فني مستمر
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-clay" />
            بدون عقد طويل الأمد
          </span>
        </div>
      </div>
    </section>
  );
};

export default ClosingCTA;
