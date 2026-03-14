import { useEffect, useRef } from "react";
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

const Pricing = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-pricing-card]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
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
            <div
              key={tier.name}
              data-pricing-card
              className={`rounded-3xl p-8 border flex flex-col ${
                tier.highlighted
                  ? "bg-moss border-moss/30 shadow-lg shadow-moss/10"
                  : "bg-card border-border"
              }`}
            >
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
