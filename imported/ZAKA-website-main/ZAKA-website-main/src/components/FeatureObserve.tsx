import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Eye } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FeatureObserve() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current && contentRef.current && cardRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // Entrance
      tl.fromTo(
        contentRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3 }
      )
        .fromTo(
          cardRef.current,
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.3 },
          '<'
        )
        // Settle
        .to({}, { duration: 0.4 })
        // Exit
        .to(contentRef.current, { x: -100, opacity: 0, duration: 0.3 })
        .to(cardRef.current, { x: 100, opacity: 0, duration: 0.3 }, '<');
    }
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen relative overflow-hidden bg-[#05060B]">
      {/* Ambient glow center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] glow-orb-indigo opacity-30 rounded-full" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center h-full px-8 lg:px-[8vw] max-w-7xl mx-auto w-full gap-8 md:gap-0">
        {/* Text Left (38vw) */}
        <div ref={contentRef} className="w-full md:w-[38vw] pr-0 md:pr-8">
          <span className="font-mono text-xs tracking-[0.12em] text-[#4B6BFF] uppercase mb-4 block">
            المراقبة
          </span>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold text-white leading-[0.95] tracking-[-0.02em] mb-6">
            شاهد كل خطوة في الوقت الفعلي
          </h2>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-6">
            التتبعات والسجلات ومقاييس التكلفة — يتم التقاطها تلقائياً لتتمكن من تصحيح الأخطاء بسرعة وتحسين الإنفاق.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Check className="w-4 h-4 text-[#4B6BFF]" />
              تتبع التكلفة على مستوى الرمز (Token)
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Check className="w-4 h-4 text-[#4B6BFF]" />
              إعادة تشغيل التتبع
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Check className="w-4 h-4 text-[#4B6BFF]" />
              التنبيه عند وجود شذوذ
            </li>
          </ul>
        </div>

        {/* Card Right */}
        <div ref={cardRef} className="flex flex-1 justify-center md:justify-end w-full">
          <div className="w-full md:w-[38vw] max-w-[500px] h-[40vh] md:h-[62vh] min-h-[300px] md:min-h-[420px] glass-card p-6 flex flex-col">
            {/* Observe Card UI */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-sm font-medium text-white">المقاييس</span>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <p className="text-xs text-gray-400 mb-1">الرموز اليوم</p>
                <p className="text-xl font-bold text-white">1.2M</p>
                <p className="text-[10px] text-emerald-400 mt-1" dir="ltr">+12% vs yesterday</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <p className="text-xs text-gray-400 mb-1">متوسط زمن الاستجابة</p>
                <p className="text-xl font-bold text-white">420ms</p>
                <p className="text-[10px] text-emerald-400 mt-1" dir="ltr">-5% vs yesterday</p>
              </div>
            </div>

            {/* Live Trace code block */}
            <div className="flex-1 rounded-xl bg-[#0B0E16] border border-white/[0.06] p-4 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-3 border-b border-white/[0.06] pb-2">
                <span className="text-xs text-gray-400 font-mono">التتبع المباشر</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="font-mono text-[10px] text-gray-400 space-y-2 overflow-y-auto text-left" dir="ltr">
                <p><span className="text-indigo-400">→</span> LLM Call: gpt-4-turbo</p>
                <p className="pl-4 text-gray-500">Prompt: 124 tokens</p>
                <p className="pl-4 text-gray-500">Completion: 45 tokens</p>
                <p className="pl-4 text-emerald-400">Latency: 380ms</p>
                <p className="mt-2"><span className="text-indigo-400">→</span> Tool Call: search_db</p>
                <p className="pl-4 text-gray-500">Query: "user_id: 12345"</p>
                <p className="pl-4 text-emerald-400">Latency: 45ms</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
