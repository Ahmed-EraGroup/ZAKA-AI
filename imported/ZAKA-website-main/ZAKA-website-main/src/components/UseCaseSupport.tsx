import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function UseCaseSupport() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current && contentRef.current && imageRef.current) {
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
        imageRef.current,
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
        .to(imageRef.current, { x: -100, opacity: 0, duration: 0.3 })
        .to(contentRef.current, { x: 100, opacity: 0, duration: 0.3 }, '<');
    }
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen relative overflow-hidden bg-[#05060B]">
      <div className="relative z-10 flex flex-col-reverse md:flex-row h-full">
        {/* Image Panel Left (46vw) */}
        <div ref={imageRef} className="w-full md:absolute md:left-0 md:top-0 md:w-[46vw] h-[50vh] md:h-full bg-gradient-to-br from-[#4B6BFF]/30 via-[#4B6BFF]/10 to-transparent flex items-center justify-center p-4">
           {/* Chat UI Card */}
          <div className="w-full max-w-[400px] h-[30vh] min-h-[200px] glass-card p-5 flex flex-col justify-end relative overflow-hidden">
            <span className="text-xs text-gray-400 mb-3 block absolute top-5 left-5">محادثة مباشرة</span>
            {/* Chat bubbles */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 shrink-0" />
                <div className="bg-white/5 rounded-2xl rounded-tr-none p-3 text-sm text-gray-300">
                  كيف يمكنني إعادة تعيين مفتاح API الخاص بي؟
                </div>
              </div>
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-[#4B6BFF]/20 shrink-0 flex items-center justify-center text-xs font-bold text-[#4B6BFF]">AI</div>
                <div className="bg-[#4B6BFF]/10 rounded-2xl rounded-tl-none p-3 text-sm text-white border border-[#4B6BFF]/20">
                  يمكنك إعادة تعيين مفتاح API الخاص بك في لوحة التحكم تحت الإعدادات &gt; الأمان. هل ترغب في أن أرسل لك رابطاً مباشراً؟
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Right (54vw) */}
        <div ref={contentRef} className="w-full md:absolute md:right-0 md:top-0 md:w-[54vw] h-[50vh] md:h-full flex flex-col justify-center px-8 md:px-[4vw]">
          <span className="font-mono text-xs tracking-[0.12em] text-[#4B6BFF] uppercase mb-4">
            حالة استخدام
          </span>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold text-white leading-[0.95] tracking-[-0.02em] mb-6">
            دعم عملاء قابل للتوسع
          </h2>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-6 max-w-xl">
            حل التذاكر من البداية للنهاية: تصنيف، بحث، صياغة ردود، وتصعيد مع سياق كامل.
          </p>
          <a href="#" className="inline-flex items-center gap-2 text-[#4B6BFF] hover:text-[#4B6BFF]/80 text-sm font-medium transition-colors">
            اقرأ القصة <ArrowRight className="w-4 h-4 rotate-180" />
          </a>
        </div>
      </div>
    </section>
  );
}
