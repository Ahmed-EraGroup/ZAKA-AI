import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tiers = [
  {
    name: "الباقة الأساسية",
    badgeColor: "bg-blue-500",
    summary: "مبلغ مقطوع للإعداد + اشتراك شهري ثابت",
    features: [
      "إعداد كامل للوكيل",
      "تخصيص الردود والصوت",
      "تركيب على الموقع",
      "صيانة وتشغيل مستمر",
    ],
    highlighted: false,
  },
  {
    name: "باقة الشركات",
    badgeColor: "bg-clay",
    summary: "تسعير حسب المشروع",
    features: [
      "تخصيص برمجي كامل",
      "ربط مع CRM أو ERP",
      "تكامل API",
      "استضافة خاصة",
      "دعم أولوية",
    ],
    highlighted: true,
  },
];

const PricingCard = ({ tier }: { tier: typeof tiers[0] }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;

    // Move glow to cursor position
    const glow = card.querySelector<HTMLDivElement>(".card-glow");
    if (glow) {
      glow.style.opacity = "1";
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
    const glow = card.querySelector<HTMLDivElement>(".card-glow");
    if (glow) glow.style.opacity = "0";
  }, []);

  return (
    <div
      ref={cardRef}
      data-pricing-card
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl p-8 border flex flex-col transition-transform duration-200 ease-out ${
        tier.highlighted
          ? "bg-moss border-moss/30 shadow-lg shadow-moss/10"
          : "bg-card border-border"
      }`}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {/* Cursor-following glow */}
      <div
        className="card-glow pointer-events-none absolute w-48 h-48 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-300"
        style={{
          background: tier.highlighted
            ? "radial-gradient(circle, rgba(201,107,62,0.2) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(79,172,254,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Highlighted card shimmer border */}
      {tier.highlighted && (
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="pricing-shimmer" />
        </div>
      )}

      <div className="relative z-10">
        <div className="mb-6 flex flex-row-reverse items-center justify-end gap-3 text-right">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${tier.badgeColor}`} />
          <span className="font-display font-bold text-2xl text-foreground">{tier.name}</span>
        </div>
        <p className="text-foreground/75 text-sm mb-6">{tier.summary}</p>

        <ul className="space-y-3 flex-1 mb-8">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-foreground/85">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  tier.highlighted ? "bg-clay" : "bg-muted-foreground/40"
                }`}
              />
              {feature}
            </li>
          ))}
        </ul>
        <a
          href="#deploy"
          className={`group relative inline-flex items-center justify-center font-semibold px-6 py-3.5 rounded-full text-sm overflow-hidden transition-all ${
            tier.highlighted
              ? "bg-clay text-foreground hover:shadow-lg hover:shadow-clay/30"
              : "border border-foreground/20 text-foreground/80 hover:border-foreground/40"
          }`}
        >
          <span className="relative z-10">تواصل معنا</span>
          <span className="absolute inset-0 bg-foreground/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </a>
      </div>
    </div>
  );
};

const Pricing = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-pricing-card]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-spacing px-8 md:px-16" id="enterprise" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display font-bold text-3xl md:text-5xl text-heading-gradient text-center mt-4 mb-16">
          انشر بنيتك التحتية
        </h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
