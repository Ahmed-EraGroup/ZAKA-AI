import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const InteractiveOrb = () => {
  const [state, setState] = React.useState<"idle" | "listening" | "speaking">("idle");
  const [statusText, setStatusText] = React.useState("اضغط للتحدث");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "ar-SA";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setState("listening");
        setStatusText("جارٍ الاستماع...");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log("النص المستلم:", transcript);

        setState("speaking");
        setStatusText("جارٍ المعالجة...");

        respond(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("حدث خطأ:", event.error);
        setState("idle");
        if (event.error === 'not-allowed') {
          setStatusText("الرجاء السماح باستخدام الميكروفون.");
        } else {
          setStatusText("حدث خطأ، حاول مرة أخرى.");
        }
      };

      recognition.onend = () => {
        setState((prev) => {
          if (prev !== "speaking") {
            setStatusText("اضغط للتحدث");
            return "idle";
          }
          return prev;
        });
      };

      recognitionRef.current = recognition;
    } else {
      setStatusText("متصفحك لا يدعم خاصية التعرف على الصوت.");
    }
  }, []);

  const respond = (userText: string) => {
    let reply = "لم أفهم طلبك، هل يمكنك تكراره؟";

    if (userText.includes("مرحبا") || userText.includes("أهلا")) {
      reply = "أهلاً بك، كيف يمكنني مساعدتك؟";
    } else if (userText.includes("وقت") || userText.includes("الساعة")) {
      const now = new Date().toLocaleTimeString('ar-SA');
      reply = `الساعة الآن ${now}`;
    } else if (userText.includes("اسمك")) {
      reply = "أنا مساعدك الصوتي التجريبي.";
    }

    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.lang = "ar-SA";

    utterance.onend = () => {
      setState("idle");
      setStatusText("اضغط للتحدث");
    };

    speechSynthesis.speak(utterance);
  };

  const handleClick = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.log("Recognition already started");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full pt-8">
      <div
        id="voiceOrb"
        className={`${state === 'listening' ? 'listening' : ''} ${state === 'speaking' ? 'speaking' : ''}`}
        onClick={handleClick}
        style={!recognitionRef.current && state === 'idle' && statusText === "متصفحك لا يدعم خاصية التعرف على الصوت." ? { backgroundColor: 'gray', background: 'gray' } : {}}
      ></div>
      <div id="statusText" className="mt-8 text-xl text-gray-300 font-medium">{statusText}</div>
    </div>
  );
};

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-anim]", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.18,
        delay: 0.3
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[100dvh] flex flex-col items-center overflow-hidden bg-background" id="hero">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,_rgba(56,120,255,0.15)_0%,_transparent_70%)] blur-[20px]"></div>
        <div className="absolute top-[5%] left-[30%] w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(56,120,255,0.1)_0%,_transparent_70%)]"></div>
        <div className="absolute top-[10%] right-[25%] w-[300px] h-[300px] bg-[radial-gradient(circle,_rgba(100,80,255,0.08)_0%,_transparent_70%)]"></div>
      </div>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }}></div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-8 md:px-16 pt-36 pb-8 text-center" dir="rtl">
        <p data-hero-anim className="font-mono-system text-xs tracking-[0.3em] text-blue-400/80 uppercase mb-6">ZAKA PLATFORM</p>
        <h1 data-hero-anim className="font-display font-extrabold text-5xl md:text-7xl tracking-tight text-foreground leading-[1.05]">
          وكلاء ذكاء اصطناعي<br />
          <span className="text-heading-gradient">يعملون من أجلك</span>
        </h1>
        <p data-hero-anim className="text-muted-foreground text-base md:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
          انشر وكلاء صوت، دردشة، وأتمتة مستقلة مباشرة داخل موقعك الإلكتروني. ZAKA تمكّنك من الرد الفوري على الزوار، تأهيل العملاء، وتنفيذ المهام — 24/7.
        </p>
        <div data-hero-anim className="flex flex-wrap justify-center gap-4 mt-8">
          <a href="#deploy" className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-8 py-4 rounded-full text-sm overflow-hidden transition-all hover:shadow-lg hover:shadow-blue-500/30">
            <span className="relative z-10">اطلب عرض توضيحي</span>
            <ArrowRight className="relative z-10 w-4 h-4 rotate-180" />
          </a>
          <a href="#infrastructure" className="inline-flex items-center gap-2 text-muted-foreground font-medium px-8 py-4 rounded-full text-sm hover:text-foreground transition-all">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            شاهد العرض
          </a>
        </div>
      </div>
      <div data-hero-anim className="relative z-10 w-full max-w-xl mx-auto flex-shrink-0" style={{ height: "320px" }}>
        <InteractiveOrb />
      </div>
    </section>
  );
};

const WhoIsThisFor = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-showcase-anim]", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const items = [
    "المتاجر الإلكترونية",
    "الشركات الخدمية",
    "شركات التقنية",
    "المؤسسات التي تستقبل استفسارات يوميًا",
    "أي نشاط يريد تقليل التكلفة وزيادة الاستجابة"
  ];

  return (
    <section ref={containerRef} className="pinned relative py-24 md:py-32 overflow-hidden bg-background opacity-90" id="agent-showcase">
      <div className="max-w-5xl mx-auto px-6 md:px-16 text-center" dir="rtl">
        <h2 data-showcase-anim className="font-display font-extrabold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1]">
          <span className="bg-gradient-to-l from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">لمن هذه الخدمة؟</span>
        </h2>
        <ul data-showcase-anim className="flex flex-wrap justify-center gap-2 mt-8">
          {items.map((item, i) => (
            <li key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-muted-foreground">
              {item}
            </li>
          ))}
        </ul>
        <div data-showcase-anim className="mt-8">
          <a href="#deploy" className="relative inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-sm text-foreground bg-gradient-to-l from-cyan-500 to-purple-600 shadow-[0_0_30px_rgba(6,182,212,0.4),0_0_60px_rgba(147,51,234,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6),0_0_80px_rgba(147,51,234,0.3)] transition-shadow duration-300">
            ابدأ الآن
          </a>
        </div>
      </div>
    </section>
  );
};

const WhatWeOffer = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [text, setText] = React.useState("");
  const fullText = "مرحباً بك في ZAKA، كيف يمكنني مساعدتك اليوم؟";

  const cards = ["تحليل النية", "استرجاع المعرفة", "توليد الرد"];
  const [active, setActive] = React.useState(0);

  const nodes = ["استقبال الطلب", "التحقق من البيانات", "تحديث CRM", "إرسال تأكيد"];
  const [activeNode, setActiveNode] = React.useState(0);

  useEffect(() => {
    let i = 0;
    const textInterval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length + 10) i = 0;
    }, 100);

    const cardsInterval = setInterval(() => {
      setActive(prev => (prev + 1) % cards.length);
    }, 2000);

    const nodesInterval = setInterval(() => {
      setActiveNode(prev => (prev + 1) % nodes.length);
    }, 1500);

    return () => {
      clearInterval(textInterval);
      clearInterval(cardsInterval);
      clearInterval(nodesInterval);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-feature-card]", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%"
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="pinned py-32 px-8 md:px-16" id="agents" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-display font-bold text-3xl md:text-5xl text-heading-gradient mt-4">ماذا تقدم ZAKA؟</h2>
          <p className="text-muted-foreground text-lg md:text-xl mt-4 max-w-2xl mx-auto leading-relaxed">
            نوفّر لك وكلاء ذكاء اصطناعي مخصصين لنشاطك
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div data-feature-card>
            <div className="bg-card rounded-2xl p-8 border border-border flex flex-col gap-6 h-full" dir="rtl">
              <div className="flex items-center justify-between">
                <span className="font-mono-system text-xs text-muted-foreground uppercase tracking-wider">وحدة الوكيل الصوتي</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-clay animate-pulse-dot" />
                  <span className="font-mono-system text-xs text-clay">يستمع…</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-[3px] h-16">
                {Array.from({ length: 32 }).map((_, i) =>
                <div
                  key={i}
                  className="w-[3px] bg-moss rounded-full"
                  style={{
                    animationName: 'waveform',
                    animationDuration: `${0.6 + Math.random() * 0.8}s`,
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                    animationDelay: `${i * 0.05}s`,
                    height: "8px"
                  }} />
                )}
              </div>
              <div className="bg-midnight rounded-xl p-4 min-h-[60px]">
                <p className="font-mono-system text-sm text-foreground/80">
                  {text}
                  <span className="inline-block w-[2px] h-4 bg-clay mr-1 animate-pulse" />
                </p>
              </div>
              <div className="flex justify-between font-mono-system text-xs text-muted-foreground">
                <span>زمن الاستجابة: 120ms</span>
                <span>النموذج: v3.2</span>
              </div>
            </div>
          </div>
          <div data-feature-card>
            <div className="bg-card rounded-2xl p-8 border border-border flex flex-col gap-6 h-full" dir="rtl">
              <span className="font-mono-system text-xs text-muted-foreground uppercase tracking-wider">محرك وكيل المحادثة</span>
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
                        transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)"
                      }}>

                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${offset === 0 ? "bg-clay" : "bg-muted-foreground/30"}`} />
                        <span className="font-display font-semibold text-foreground">{label}</span>
                      </div>
                      {offset === 0 &&
                      <p className="text-sm text-muted-foreground mt-3">جارٍ معالجة خط الأنابيب النشط…</p>
                      }
                    </div>);
                })}
              </div>
              <div className="flex gap-2 justify-center">
                {cards.map((_, i) =>
                <div key={i} className={`w-8 h-1 rounded-full transition-colors duration-300 ${i === active ? "bg-clay" : "bg-muted"}`} />
                )}
              </div>
            </div>
          </div>
          <div data-feature-card>
            <div className="bg-card rounded-2xl p-8 border border-border flex flex-col gap-6 h-full" dir="rtl">
              <span className="font-mono-system text-xs text-muted-foreground uppercase tracking-wider">بروتوكول الأتمتة</span>
              <div className="flex flex-col gap-3 py-4">
                {nodes.map((node, i) =>
                <div key={node} className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex-shrink-0 ${
                  i <= activeNode ? "border-clay bg-clay/20" : "border-muted-foreground/30"}`
                  }>
                      {i === activeNode && <div className="w-full h-full rounded-full bg-clay animate-pulse-dot" />}
                    </div>
                    {i < nodes.length - 1 &&
                  <div className={`absolute mr-[7px] mt-8 w-[2px] h-6 transition-colors duration-300 ${
                  i < activeNode ? "bg-clay/40" : "bg-muted"}`
                  } />
                  }
                    <span className={`font-mono-system text-sm transition-colors duration-300 ${
                  i <= activeNode ? "text-foreground" : "text-muted-foreground"}`
                  }>
                      {node}
                    </span>
                    {i === activeNode &&
                  <span className="mr-auto font-mono-system text-xs text-clay">●  نشط</span>
                  }
                  </div>
                )}
              </div>
              <div className="bg-midnight rounded-xl p-3 font-mono-system text-xs text-moss" dir="ltr">
                → system.execute(workflow_id: "ax-7291")
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const WhyZaka = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-phil-line]", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const items = [
    { icon: "⚡", title: "لا فقدان للزوار", desc: "بسبب تأخر الرد" },
    { icon: "🕐", title: "استجابة فورية", desc: "على مدار الساعة" },
    { icon: "📈", title: "زيادة في فرص البيع", desc: "تحويل الزوار إلى عملاء" },
    { icon: "🛡️", title: "تقليل ضغط فريق الدعم", desc: "أتمتة المهام المتكررة" }
  ];

  return (
    <section ref={containerRef} className="pinned relative py-40 px-8 md:px-16 bg-charcoal overflow-hidden" dir="rtl">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "60px 60px" }}></div>
      <div className="relative z-10 max-w-5xl mx-auto">
        <h2 data-phil-line className="font-display font-bold text-4xl md:text-6xl text-heading-gradient leading-tight mb-16">لماذا ZAKA؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, i) => (
            <div key={i} data-phil-line className="group border border-foreground/10 rounded-2xl p-8 hover:border-clay/40 transition-colors duration-300">
              <span className="text-3xl block mb-4">{item.icon}</span>
              <h3 className="font-display font-bold text-2xl text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-lg">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MultiLayerIntelligence = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-stack-card]", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const layers = [
    { title: "طبقة المعالجة العصبية", subtitle: "تصنيف فوري للنوايا عبر جميع قنوات الإدخال", visual: "mesh" },
    { title: "ذكاء السياق", subtitle: "بنية ذاكرة مستمرة مع نوافذ سياق ديناميكية", visual: "grid" },
    { title: "محرك التنفيذ", subtitle: "إرسال إجراءات بأقل من 100 مللي ثانية مع تتبع أداء مباشر", visual: "graph" }
  ];

  const renderVisual = (type: string) => {
    switch (type) {
      case "mesh":
        return (
          <div className="relative w-full h-48 overflow-hidden rounded-2xl bg-midnight flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_rgba(194,84,52,0.4)_0%,_transparent_70%)]"></div>
            <svg className="w-full h-full opacity-50" viewBox="0 0 400 200">
              {Array.from({ length: 15 }).map((_, i) => {
                const cx = 30 + (i % 5) * 85;
                const cy = 40 + Math.floor(i / 5) * 60;
                return (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="4" fill="hsl(var(--moss))" className="animate-pulse-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                    {i % 5 < 4 && <line x1={cx} y1={cy} x2={cx + 85} y2={cy} stroke="hsl(var(--moss))" strokeWidth="1" opacity="0.3" />}
                    {Math.floor(i / 5) < 2 && <line x1={cx} y1={cy} x2={cx} y2={cy + 60} stroke="hsl(var(--moss))" strokeWidth="1" opacity="0.3" />}
                  </g>
                );
              })}
            </svg>
          </div>
        );
      case "grid":
        return (
          <div className="relative w-full h-48 overflow-hidden rounded-2xl bg-midnight flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_rgba(194,84,52,0.4)_0%,_transparent_70%)]"></div>
            <div className="grid grid-cols-6 gap-2 p-4 w-full h-full opacity-60">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="bg-moss/20 rounded-sm border border-moss/30 animate-pulse-dot" style={{ animationDelay: `${Math.random() * 2}s` }}></div>
              ))}
            </div>
          </div>
        );
      case "graph":
        return (
          <div className="relative w-full h-48 overflow-hidden rounded-2xl bg-midnight flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_rgba(194,84,52,0.4)_0%,_transparent_70%)]"></div>
            <svg className="w-full h-full opacity-60" viewBox="0 0 400 200" preserveAspectRatio="none">
              <path d="M0,150 Q50,100 100,120 T200,80 T300,110 T400,50" fill="none" stroke="hsl(var(--clay))" strokeWidth="3" className="animate-pulse" />
              <path d="M0,150 Q50,100 100,120 T200,80 T300,110 T400,50 L400,200 L0,200 Z" fill="url(#grad)" opacity="0.2" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--clay))" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section ref={containerRef} className="pinned py-32 px-8 md:px-16" id="infrastructure" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <span className="font-mono-system text-xs text-muted-foreground uppercase tracking-widest">حزمة البروتوكولات</span>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-heading-gradient mt-4 mb-20">ذكاء متعدد الطبقات</h2>
        <div className="space-y-8">
          {layers.map((layer, i) => (
            <div key={i} data-stack-card className="bg-card rounded-3xl border border-border p-10 will-change-transform">
              <span className="font-mono-system text-xs text-muted-foreground">الطبقة {i + 1}</span>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground mt-3 mb-2">{layer.title}</h3>
              <p className="text-muted-foreground mb-8">{layer.subtitle}</p>
              {renderVisual(layer.visual)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DeployInfrastructure = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-pricing-card]", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%"
        },
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const plans = [
    { name: "الباقات الأساسية", features: ["تشغيل وكيل واحد (صوت أو دردشة)", "إعداد كامل وربط أساسي", "دعم فني"], highlighted: false },
    { name: "الشركات", features: ["تخصيص برمجي متقدم", "ربط بأنظمتك الداخلية", "أتمتة متعددة", "بنية تحتية مخصصة"], highlighted: true }
  ];

  return (
    <section ref={containerRef} className="pinned py-32 px-8 md:px-16" id="enterprise" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display font-bold text-3xl md:text-5xl text-heading-gradient mt-4 mb-16">انشر بنيتك التحتية</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <div key={i} data-pricing-card className={`rounded-3xl p-8 border ${plan.highlighted ? 'bg-card border-clay/50 shadow-[0_0_30px_rgba(194,84,52,0.15)]' : 'bg-midnight border-border'}`}>
              <h3 className="font-display font-bold text-2xl text-foreground mb-6">{plan.name}</h3>
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-foreground/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-clay"></div>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [form, setForm] = React.useState({ name: "", company: "", email: "", message: "" });
  const [status, setStatus] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(true);
    setTimeout(() => setStatus(false), 2000);
  };

  const inputClass = "w-full bg-midnight border border-border rounded-2xl px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-clay/50 transition-all font-mono-system";

  return (
    <section className="pinned py-32 px-8 md:px-16" id="deploy" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display font-bold text-3xl md:text-5xl text-heading-gradient mt-4 mb-4">جاهز تنشر وكيلك الذكي؟</h2>
        <p className="text-muted-foreground mb-12">أدخل بياناتك وسنتواصل معك لنشر الوكيل في موقعك.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input placeholder="الاسم" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} required />
          </div>
          <div>
            <input placeholder="اسم الشركة" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className={inputClass} required />
          </div>
          <div>
            <input type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} required />
          </div>
          <div>
            <textarea placeholder="رسالتك" rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className={`${inputClass} resize-none`} required />
          </div>
          <button type="submit" disabled={status} className="group relative w-full bg-clay text-foreground font-semibold py-4 rounded-full text-sm overflow-hidden transition-all hover:shadow-lg hover:shadow-clay/30 disabled:opacity-50">
            <span className="relative z-10">{status ? "جارٍ النشر…" : "نشر الوكيل في موقعي"}</span>
            <span className="absolute inset-0 bg-foreground/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
          </button>
        </form>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="relative bg-charcoal text-foreground rounded-t-[4rem] overflow-hidden mt-8" dir="rtl">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "60px 60px" }}></div>
      <div className="relative max-w-5xl mx-auto px-6 md:px-12 pt-24 pb-14 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">ZAKA</h2>
        <p className="mt-6 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          البنية التحتية لوكلاء الذكاء الاصطناعي. انشر وكلاء صوت ودردشة وأتمتة مستقلين داخل موقعك خلال أيام — بدون تعقيد تقني.
        </p>
        <div className="mt-10">
          <a href="#deploy" className="inline-block bg-moss hover:bg-moss/80 text-foreground px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105">
            اطلب عرض توضيحي
          </a>
        </div>
        <div className="mt-12 flex items-center justify-center gap-3 text-sm font-mono-system text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="font-mono-system">System Operational</span>
        </div>
        <div className="mt-12 text-xs text-muted-foreground/40 font-mono-system">
          © 2026 ZAKA Infrastructure. All systems active.
        </div>
      </div>
    </footer>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav ref={navRef} dir="rtl" className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-full px-8 py-3 flex items-center gap-8 ${scrolled ? "bg-midnight/80 backdrop-blur-xl border border-border shadow-lg shadow-midnight/50" : "bg-transparent"}`}>
      <a href="#" className="font-display font-bold text-xl tracking-tight text-foreground">ZAKA</a>
    </nav>
  );
};

export default function App() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll(".text-heading-gradient").forEach((element) => {
        ScrollTrigger.create({
          trigger: element,
          start: "top 80%",
          onEnter: () => element.classList.add("glow-active")
        });
      });

      gsap.utils.toArray<HTMLElement>("section.pinned").forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          pin: true,
          pinSpacing: true,
          scrub: 0.35,
          end: "+=55%"
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="noise-overlay min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <WhoIsThisFor />
        <WhatWeOffer />
        <WhyZaka />
        <MultiLayerIntelligence />
        <DeployInfrastructure />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
