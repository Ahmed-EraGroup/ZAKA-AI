import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stackCards = [
  {
    title: "طبقة المعالجة العصبية",
    subtitle: "تصنيف فوري للنوايا عبر جميع قنوات الإدخال",
    visual: "mesh",
  },
  {
    title: "ذكاء السياق",
    subtitle: "بنية ذاكرة مستمرة مع نوافذ سياق ديناميكية",
    visual: "grid",
  },
  {
    title: "محرك التنفيذ",
    subtitle: "إرسال إجراءات بأقل من 100 مللي ثانية مع تتبع أداء مباشر",
    visual: "graph",
  },
];

const NeuralMesh = () => (
  <div className="relative w-full h-48 overflow-hidden rounded-2xl bg-midnight">
    <svg className="w-full h-full" viewBox="0 0 400 200">
      {Array.from({ length: 15 }).map((_, i) => {
        const x = 30 + (i % 5) * 85;
        const y = 40 + Math.floor(i / 5) * 60;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="hsl(var(--moss))" opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
            {i < 14 && (
              <line x1={x} y1={y} x2={30 + ((i + 1) % 5) * 85} y2={40 + Math.floor((i + 1) / 5) * 60}
                stroke="hsl(var(--moss))" strokeWidth="0.5" opacity="0.2" />
            )}
          </g>
        );
      })}
    </svg>
  </div>
);

const ScanGrid = () => (
  <div className="relative w-full h-48 overflow-hidden rounded-2xl bg-midnight">
    <div className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: "linear-gradient(hsl(var(--clay)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--clay)) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    />
    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-clay to-transparent"
      style={{ animation: "scanLine 3s linear infinite" }}
    />
    <style>{`@keyframes scanLine { 0% { transform: translateY(0); } 100% { transform: translateY(192px); } }`}</style>
  </div>
);

const PerfGraph = () => (
  <div className="relative w-full h-48 overflow-hidden rounded-2xl bg-midnight p-6">
    <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="hsl(var(--clay))"
        strokeWidth="2"
        points="0,80 30,60 60,70 90,30 120,50 150,20 180,40 210,15 240,35 270,25 300,45 330,10 360,30 400,20"
      >
        <animate attributeName="points"
          values="0,80 30,60 60,70 90,30 120,50 150,20 180,40 210,15 240,35 270,25 300,45 330,10 360,30 400,20;0,60 30,70 60,40 90,55 120,30 150,45 180,20 210,50 240,15 270,40 300,25 330,35 360,10 400,30;0,80 30,60 60,70 90,30 120,50 150,20 180,40 210,15 240,35 270,25 300,45 330,10 360,30 400,20"
          dur="4s" repeatCount="indefinite" />
      </polyline>
    </svg>
    <div className="absolute bottom-4 left-6 font-mono-system text-xs text-clay">
      وقت التشغيل: 98.7%
    </div>
  </div>
);

const visuals: Record<string, React.FC> = { mesh: NeuralMesh, grid: ScanGrid, graph: PerfGraph };

const ProtocolStack = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]");
      cards.forEach((card, i) => {
        if (i === 0) return;
        ScrollTrigger.create({
          trigger: card,
          start: "top 80%",
          onEnter: () => {
            for (let j = 0; j < i; j++) {
              gsap.to(cards[j], {
                scale: 0.92 - (i - j - 1) * 0.03,
                filter: `blur(${(i - j) * 6}px)`,
                opacity: 0.5 - (i - j - 1) * 0.15,
                duration: 0.6,
              });
            }
          },
          onLeaveBack: () => {
            gsap.to(cards[i - 1], { scale: 1, filter: "blur(0px)", opacity: 1, duration: 0.6 });
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-8 md:px-16" id="infrastructure" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <span className="font-mono-system text-xs text-muted-foreground uppercase tracking-widest">حزمة البروتوكولات</span>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-heading-gradient mt-4 mb-20">
          ذكاء متعدد الطبقات
        </h2>
        <div className="space-y-8">
          {stackCards.map((card, i) => {
            const Visual = visuals[card.visual];
            return (
              <div
                key={i}
                data-stack-card
                className="bg-card rounded-3xl border border-border p-10 will-change-transform"
              >
                <span className="font-mono-system text-xs text-muted-foreground">الطبقة {i + 1}</span>
                <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground mt-3 mb-2">
                  {card.title}
                </h3>
                <p className="text-muted-foreground mb-8">{card.subtitle}</p>
                <Visual />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProtocolStack;
