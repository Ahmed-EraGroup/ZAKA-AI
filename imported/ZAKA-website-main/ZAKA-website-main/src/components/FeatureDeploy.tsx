import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Rocket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FeatureDeploy() {
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
        cardRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3 }
      )
        .fromTo(
          contentRef.current,
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.3 },
          '<'
        )
        // Settle
        .to({}, { duration: 0.4 })
        // Exit
        .to(cardRef.current, { x: -100, opacity: 0, duration: 0.3 })
        .to(contentRef.current, { x: 100, opacity: 0, duration: 0.3 }, '<');
    }
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen relative overflow-hidden bg-[#05060B]">
      {/* Ambient glow center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] glow-orb-cyan opacity-20 rounded-full" />

      <div className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-center h-full px-8 lg:px-[8vw] max-w-7xl mx-auto w-full gap-8 md:gap-0">
        {/* Card Left */}
        <div ref={cardRef} className="flex flex-1 justify-center md:justify-start w-full">
          <div className="w-full md:w-[38vw] max-w-[500px] h-[40vh] md:h-[62vh] min-h-[300px] md:min-h-[420px] glass-card p-6 flex flex-col">
            {/* Deploy Card UI */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-sm font-medium text-white">عمليات النشر</span>
            </div>

            {/* Deployments list */}
            <div className="flex-1 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div>
                  <p className="text-sm text-white font-medium">v1.4.2</p>
                  <p className="text-xs text-gray-500 mt-1">الإنتاج</p>
                </div>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full badge-online font-mono">
                  نجاح
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div>
                  <p className="text-sm text-white font-medium">v1.4.3-rc.1</p>
                  <p className="text-xs text-gray-500 mt-1">التجريبية</p>
                </div>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full badge-idle font-mono">
                  قيد البناء
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div>
                  <p className="text-sm text-white font-medium">v1.4.1</p>
                  <p className="text-xs text-gray-500 mt-1">الإنتاج</p>
                </div>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full badge-error font-mono">
                  فشل
                </span>
              </div>
            </div>

            {/* Deploy Frequency bar chart placeholder */}
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <p className="text-xs text-gray-400 mb-3">وتيرة النشر</p>
              <div className="flex items-end gap-2 h-16">
                <div className="w-full bg-[#4B6BFF]/40 rounded-t-sm h-[40%]" />
                <div className="w-full bg-[#4B6BFF]/60 rounded-t-sm h-[60%]" />
                <div className="w-full bg-[#4B6BFF]/80 rounded-t-sm h-[80%]" />
                <div className="w-full bg-[#4B6BFF] rounded-t-sm h-[100%]" />
                <div className="w-full bg-[#4B6BFF]/50 rounded-t-sm h-[50%]" />
                <div className="w-full bg-[#4B6BFF]/70 rounded-t-sm h-[70%]" />
                <div className="w-full bg-[#4B6BFF]/90 rounded-t-sm h-[90%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Text Right (38vw) */}
        <div ref={contentRef} className="w-full md:w-[38vw] pl-0 md:pl-8">
          <span className="font-mono text-xs tracking-[0.12em] text-[#4B6BFF] uppercase mb-4 block">
            النشر
          </span>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold text-white leading-[0.95] tracking-[-0.02em] mb-6">
            انشر في دقائق، وليس أسابيع
          </h2>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-6">
            نشر بنقرة واحدة مع إمكانية التراجع، والمعاينات، وتكافؤ البيئات — لتبدو الإصدارات مملة (بطريقة جيدة).
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Check className="w-4 h-4 text-[#4B6BFF]" />
              عمليات نشر متصلة بـ Git
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Check className="w-4 h-4 text-[#4B6BFF]" />
              روابط معاينة فورية
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Check className="w-4 h-4 text-[#4B6BFF]" />
              فحوصات صحة تلقائية
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
