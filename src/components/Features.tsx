import { useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FeatureIcon3D = lazy(() => import("./FeatureIcon3D"));

gsap.registerPlugin(ScrollTrigger);

const VoiceAgent = () => {
  const [text, setText] = useState("");
  const fullText = "أريد حجز عرض توضيحي يوم الثلاثاء القادم الساعة 3 مساءً.";
  const waveformDurations = useMemo(
    () => Array.from({ length: 32 }, () => 0.6 + Math.random() * 0.8),
    []
  );

  useEffect(() => {
    let i = 0;
    let resetTimeout: ReturnType<typeof setTimeout> | null = null;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setText(fullText.slice(0, i));
        i++;
      } else {
        if (!resetTimeout) {
          resetTimeout = setTimeout(() => {
            i = 0;
            setText("");
            resetTimeout = null;
          }, 2000);
        }
      }
    }, 60);
    return () => {
      clearInterval(interval);
      if (resetTimeout) clearTimeout(resetTimeout);
    };
  }, []);

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 border border-border/80 flex flex-col gap-6 h-full" dir="rtl">
      <div className="h-6 flex items-start justify-between">
        <span className="font-mono-system text-xs text-foreground/70 uppercase tracking-wider">وحدة الوكيل الصوتي</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-clay animate-pulse-dot" />
          <span className="font-mono-system text-xs text-clay">يستمع...</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-[3px] h-16">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="w-[3px] bg-moss rounded-full"
            style={{
              animation: `waveform ${waveformDurations[i]}s ease-in-out infinite`,
              animationDelay: `${i * 0.05}s`,
              height: "28px",
              transformOrigin: "center",
              willChange: "transform",
            }}
          />
        ))}
      </div>

      <div className="bg-midnight rounded-xl p-4 min-h-[60px]">
        <p className="font-mono-system text-sm text-foreground/80">
          {text}
          <span className="inline-block w-[2px] h-4 bg-clay mr-1 animate-pulse" />
        </p>
      </div>

      <div className="flex justify-between font-mono-system text-xs text-foreground/60">
        <span>زمن الاستجابة: 120ms</span>
        <span>النموذج: v3.2</span>
      </div>
    </div>
  );
};

const ChatAgent = () => {
  const cards = ["تحليل النية", "ذاكرة السياق", "تنفيذ الإجراء"];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActive((p) => (p + 1) % 3), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 border border-border/80 flex flex-col gap-6 h-full" dir="rtl">
      <div className="h-6 flex items-start">
        <span className="font-mono-system text-xs text-foreground/70 uppercase tracking-wider">محرك وكيل المحادثة</span>
      </div>

      <div className="relative h-48 flex items-center justify-center">
        {cards.map((label, i) => {
          const offset = (i - active + 3) % 3;
          return (
            <div
              key={label}
              className="absolute w-full max-w-[280px] bg-midnight border border-border rounded-2xl p-6 transition-all duration-500"
              style={{
                transform: `translateY(${offset * 16}px) scale(${1 - offset * 0.05})`,
                opacity: offset === 0 ? 1 : 0.4 - offset * 0.1,
                zIndex: 3 - offset,
                transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${offset === 0 ? "bg-clay" : "bg-muted-foreground/30"}`} />
                <span className="font-display font-semibold text-foreground">{label}</span>
              </div>
              {offset === 0 && <p className="text-sm text-foreground/70 mt-3">جارٍ معالجة خط الأنابيب النشط...</p>}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 justify-center">
        {cards.map((_, i) => (
          <div key={i} className={`w-8 h-1 rounded-full transition-colors duration-300 ${i === active ? "bg-clay" : "bg-muted"}`} />
        ))}
      </div>
    </div>
  );
};

const automationNodes = ["نموذج العميل المحتمل", "مزامنة CRM", "إرسال البريد", "تم التقاط العميل"];

const AutomationProtocol = () => {
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActiveNode((p) => (p + 1) % automationNodes.length), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 border border-border/80 flex flex-col gap-6 h-full" dir="rtl">
      <div className="h-6 flex items-start">
        <span className="font-mono-system text-xs text-foreground/70 uppercase tracking-wider">بروتوكول الأتمتة</span>
      </div>

      <div className="flex flex-col gap-3 py-4">
        {automationNodes.map((node, i) => (
          <div key={node} className="flex items-center gap-4">
            <div
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex-shrink-0 ${
                i <= activeNode ? "border-clay bg-clay/20" : "border-muted-foreground/30"
              }`}
            >
              {i === activeNode && <div className="w-full h-full rounded-full bg-clay animate-pulse-dot" />}
            </div>
            {i < automationNodes.length - 1 && (
              <div
                className={`absolute mr-[7px] mt-8 w-[2px] h-6 transition-colors duration-300 ${
                  i < activeNode ? "bg-clay/40" : "bg-muted"
                }`}
              />
            )}
            <span
              className={`font-mono-system text-sm transition-colors duration-300 ${
                i <= activeNode ? "text-foreground" : "text-foreground/60"
              }`}
            >
              {node}
            </span>
            {i === activeNode && <span className="mr-auto font-mono-system text-xs text-clay">● نشط</span>}
          </div>
        ))}
      </div>

      <div className="bg-midnight rounded-xl p-3 font-mono-system text-xs text-moss" dir="ltr">
        → system.execute(workflow_id: "ax-7291")
      </div>
    </div>
  );
};

const Features = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-feature-card]",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-spacing px-8 md:px-16" id="agents" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-display font-bold text-3xl md:text-5xl text-heading-gradient mt-4">ماذا تقدم ذكــاء؟</h2>
          <p className="text-muted-foreground text-lg md:text-xl mt-4 max-w-2xl mx-auto leading-relaxed">
            نوفر لك وكلاء ذكاء اصطناعي مخصصين لنشاطك
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div data-feature-card>
            <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 border border-border/80 h-full flex flex-col gap-4 text-center items-center">
              <Suspense fallback={<div className="w-24 h-24 rounded-2xl bg-clay/10 animate-pulse" />}>
                <FeatureIcon3D type="voice" />
              </Suspense>
              <h3 className="font-display font-bold text-xl text-foreground">وكيل صوتي</h3>
              <p className="text-foreground/75 text-sm leading-relaxed">
                يتحدث مع زوار موقعك بالصوت بشكل طبيعي ويجيب على استفساراتهم فورًا.
              </p>
            </div>
          </div>

          <div data-feature-card>
            <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 border border-border/80 h-full flex flex-col gap-4 text-center items-center">
              <Suspense fallback={<div className="w-24 h-24 rounded-2xl bg-clay/10 animate-pulse" />}>
                <FeatureIcon3D type="chat" />
              </Suspense>
              <h3 className="font-display font-bold text-xl text-foreground">وكيل محادثة</h3>
              <p className="text-foreground/75 text-sm leading-relaxed">
                يرد على الأسئلة، يشرح خدماتك، ويجمع بيانات العملاء المحتملين.
              </p>
            </div>
          </div>

          <div data-feature-card>
            <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 border border-border/80 h-full flex flex-col gap-4 text-center items-center">
              <Suspense fallback={<div className="w-24 h-24 rounded-2xl bg-clay/10 animate-pulse" />}>
                <FeatureIcon3D type="automation" />
              </Suspense>
              <h3 className="font-display font-bold text-xl text-foreground">أتمتة ذكية</h3>
              <p className="text-foreground/75 text-sm leading-relaxed">
                يربط المحادثات بأنظمتك الداخلية مثل CRM والحجوزات والطلبات والدعم الفني.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div data-feature-card>
            <VoiceAgent />
          </div>
          <div data-feature-card>
            <ChatAgent />
          </div>
          <div data-feature-card>
            <AutomationProtocol />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
