import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FeatureCollaborate() {
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
            التعاون
          </span>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold text-white leading-[0.95] tracking-[-0.02em] mb-6">
            اعملوا معاً بدون فوضى
          </h2>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-6">
            شارك الوكلاء، وراجع عمليات التشغيل، واجعل الجميع على اطلاع دائم من خلال التعليقات والموافقات المدمجة.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Check className="w-4 h-4 text-[#4B6BFF]" />
              الإشارة إلى زملاء الفريق في سجلات الوكلاء
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Check className="w-4 h-4 text-[#4B6BFF]" />
              ضوابط الوصول القائمة على الأدوار
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Check className="w-4 h-4 text-[#4B6BFF]" />
              مسارات الموافقة للإجراءات الحرجة
            </li>
          </ul>
        </div>

        {/* Card Right */}
        <div ref={cardRef} className="flex flex-1 justify-center md:justify-end w-full">
          <div className="w-full md:w-[38vw] max-w-[500px] h-[40vh] md:h-[62vh] min-h-[300px] md:min-h-[420px] glass-card p-6 flex flex-col">
            {/* Collaboration Card UI */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#4B6BFF]/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#4B6BFF]" />
              </div>
              <span className="text-sm font-medium text-white">نشاط الفريق</span>
            </div>

            {/* Activity items */}
            <div className="flex-1 space-y-4 overflow-y-auto">
              <div className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4B6BFF] to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  JD
                </div>
                <div>
                  <p className="text-sm text-white">
                    <span className="font-medium">جين دو</span> وافقت على النشر في بيئة الإنتاج
                  </p>
                  <p className="text-xs text-gray-500 mt-1">منذ دقيقتين</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  AS
                </div>
                <div>
                  <p className="text-sm text-white">
                    <span className="font-medium">أليكس سميث</span> علّق على مصنف الدعم
                  </p>
                  <p className="text-xs text-gray-400 mt-1 italic bg-white/[0.05] p-2 rounded-lg border border-white/[0.05]">
                    "يبدو جيداً، دعنا ندمج هذا."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">منذ 15 دقيقة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
