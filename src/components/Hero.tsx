import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParticleOrb from "./ParticleOrb";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-anim]", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.3,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Parallax on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to("[data-hero-content]", {
        y: -60,
        opacity: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });
      gsap.to("[data-hero-orb]", {
        y: -25,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2.5,
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[76dvh] flex flex-col items-center overflow-hidden bg-background"
      id="hero"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,40%,6%)] via-background to-[hsl(260,20%,8%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      <div className="absolute inset-0 flex items-start justify-center pointer-events-none z-0">
        <div
          style={{
            width: 720,
            height: 420,
            maxWidth: '80%',
            maxHeight: '50%',
            background:
              'radial-gradient(circle at 50% 35%, rgba(59,130,246,0.65) 0%, rgba(59,130,246,0.12) 25%, rgba(0,0,0,0) 60%), radial-gradient(circle at 50% 45%, rgba(249,115,22,0.12) 0%, rgba(249,115,22,0) 30%)',
            filter: 'blur(48px)',
            borderRadius: '9999px',
            opacity: 0.95,
          }}
        />
      </div>

      <div
        data-hero-content
        className="relative z-10 w-full max-w-4xl mx-auto px-8 md:px-16 pt-28 pb-6 text-center"
        dir="rtl"
      >
        {/* Brand name — SVG draw animation */}
        <div data-hero-anim className="relative inline-flex flex-col items-center">
          <svg
            viewBox="0 0 280 80"
            className="w-44 md:w-64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <style>{`
                .zaka-stroke {
                  font-family: 'Outfit', sans-serif;
                  font-size: 68px;
                  font-weight: 800;
                  fill: transparent;
                  stroke: #c96b3e;
                  stroke-width: 1.6;
                  stroke-linecap: round;
                  stroke-linejoin: round;
                  stroke-dasharray: 1100;
                  stroke-dashoffset: 1100;
                  animation: drawZaka 2.4s cubic-bezier(0.4,0,0.2,1) 0.5s forwards;
                }
                @keyframes drawZaka {
                  0%   { stroke-dashoffset: 1100; fill: transparent; }
                  65%  { stroke-dashoffset: 0;    fill: transparent; }
                  100% { stroke-dashoffset: 0;    fill: #c96b3e; stroke-width: 0.6; }
                }
              `}</style>
            </defs>
            <text
              x="50%"
              y="66"
              textAnchor="middle"
              className="zaka-stroke"
              direction="rtl"
            >
              ذكاء
            </text>
          </svg>
        </div>
        <h1
          data-hero-anim
          className="font-display font-extrabold text-7xl tracking-tight text-heading-gradient mt-4"
        >
          وكلاء ذكاء اصطناعي
          <br />
          يعملون من أجلك
        </h1>
        <p
          data-hero-anim
          className="text-muted-foreground text-lg md:text-xl mt-4 max-w-2xl mx-auto leading-relaxed"
        >
          انشر وكلاء صوت، دردشة، وأتمتة مستقلة مباشرة داخل موقعك الإلكتروني. ZAKA تمكّنك من الرد الفوري على الزوار، تأهيل العملاء، وتنفيذ المهام — 24/7.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-foreground/70 uppercase tracking-[2px]">
          <span className="flex items-center gap-2"><span className="h-1 w-4 rounded-full bg-clay" />صوت طبيعي وقابل للتخصيص</span>
          <span className="flex items-center gap-2"><span className="h-1 w-4 rounded-full bg-clay" />فهم سياق الموقع والمحتوى</span>
          <span className="flex items-center gap-2"><span className="h-1 w-4 rounded-full bg-clay" />أتمتة المهام وتكامل سير العمل</span>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <a
            href="#pricing"
            className="inline-flex items-center gap-3 bg-clay text-bone px-5 py-3 rounded-full shadow-lg hover:brightness-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
            </svg>
            باقاتنا
          </a>

          <a
            href="#contact"
            className="inline-flex items-center gap-3 border border-border/60 text-foreground px-5 py-3 rounded-full hover:bg-white/3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V9H3v10a2 2 0 002 2z" />
            </svg>
            احجز عرض
          </a>
        </div>
      </div>

      <div data-hero-orb data-hero-anim className="relative z-10 w-full max-w-xl mx-auto mt-12 pb-24">
        <ParticleOrb />
      </div>
    </section>
  );
};

export default Hero;
