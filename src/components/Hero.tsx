import { useEffect, useRef } from "react";
import gsap from "gsap";
import ParticleOrb from "./ParticleOrb";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <section
      ref={containerRef}
      className="relative min-h-[76dvh] flex flex-col items-center overflow-hidden bg-background"
      id="hero"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,40%,6%)] via-background to-[hsl(260,20%,8%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-8 md:px-16 pt-28 pb-6 text-center" dir="rtl">
        <p
          data-hero-anim
          className="font-display font-bold text-xl text-clay tracking-wide md:text-4xl"
        >
          ذكــاء
        </p>
        <h1
          data-hero-anim
          className="font-display font-extrabold text-7xl tracking-tight text-heading-gradient leading-[1.15] mt-4"
        >
          وكلاء ذكاء اصطناعي
          <br />
          يعملون من أجلك
        </h1>
        <p
          data-hero-anim
          className="text-muted-foreground text-lg md:text-xl mt-4 max-w-2xl mx-auto leading-relaxed"
        >
          انشر وكلاء صوت، دردشة، وأتمتة مستقلة مباشرة داخل موقعك الإلكتروني. ذكــاء تمكّنك من الرد الفوري على الزوار، تأهيل العملاء، وتنفيذ المهام على مدار الساعة.
        </p>
      </div>

      <div data-hero-anim className="relative z-10 w-full max-w-xl mx-auto mt-4 pb-8">
        <ParticleOrb />
      </div>
    </section>
  );
};

export default Hero;
