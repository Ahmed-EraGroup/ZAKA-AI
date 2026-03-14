import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Philosophy = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-phil-line]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%"
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: "power3.out"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative section-spacing px-8 md:px-16 bg-charcoal overflow-hidden"
      dir="rtl">

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <div className="relative z-10 max-w-5xl mx-auto">



        <h2 data-phil-line className="font-display font-bold text-3xl md:text-5xl text-heading-gradient mt-4 mb-16">
          لماذا ZAKA؟
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
          { icon: "⚡", title: "لا فقدان للزوار", desc: "بسبب تأخر الرد" },
          { icon: "🕐", title: "استجابة فورية", desc: "على مدار الساعة" },
          { icon: "📈", title: "زيادة في فرص البيع", desc: "تحويل الزوار إلى عملاء" },
          { icon: "🛡️", title: "تقليل ضغط فريق الدعم", desc: "أتمتة المهام المتكررة" }].
          map((item, i) =>
          <div data-phil-line key={i} className="group border border-foreground/10 rounded-2xl p-8 hover:border-clay/40 transition-colors duration-300">
              <span className="text-3xl block mb-4">{item.icon}</span>
              <h3 className="font-display font-bold text-2xl text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-lg">{item.desc}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

};

export default Philosophy;