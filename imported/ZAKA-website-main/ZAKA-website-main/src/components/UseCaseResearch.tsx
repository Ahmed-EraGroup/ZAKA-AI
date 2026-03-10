import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function UseCaseResearch() {
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
        <div ref={imageRef} className="w-full md:absolute md:left-0 md:top-0 md:w-[46vw] h-[50vh] md:h-full bg-gradient-to-br from-indigo-500/30 via-indigo-500/10 to-transparent flex items-center justify-center p-4">
          {/* Research Summary Card */}
          <div className="w-full max-w-[400px] h-[40vh] min-h-[300px] glass-card p-5 flex flex-col relative overflow-hidden bg-[#0B0E16]/80">
            <span className="text-xs text-gray-400 mb-3 block border-b border-white/10 pb-2">ملخص البحث</span>
            <h3 className="text-sm font-medium text-white mb-2">تحليل السوق: الربع الثالث 2024</h3>
            <p className="text-xs text-gray-400 mb-4 line-clamp-3 leading-relaxed">
              نما سوق البنية التحتية للذكاء الاصطناعي بنسبة 42% في الربع الثالث، مدفوعاً بتبني الشركات للوكلاء المستقلين. يركز اللاعبون الرئيسيون على ميزات المراقبة والأمان للتميز.
            </p>
            <div className="space-y-2">
              <div className="bg-white/5 p-2 rounded-lg border border-white/10 flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-indigo-500/20 flex items-center justify-center text-[8px] text-indigo-400">1</div>
                <span className="text-[10px] text-gray-300">تقرير Gartner Magic Quadrant</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/10 flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-indigo-500/20 flex items-center justify-center text-[8px] text-indigo-400">2</div>
                <span className="text-[10px] text-gray-300">استطلاع McKinsey لتبني الذكاء الاصطناعي</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/10 flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-indigo-500/20 flex items-center justify-center text-[8px] text-indigo-400">3</div>
                <span className="text-[10px] text-gray-300">بيانات المبيعات الداخلية (Salesforce)</span>
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
            بحث بسرعة الآلة
          </h2>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-6 max-w-xl">
            توليف المصادر، استخراج الكيانات، وبناء قواعد معرفة حية — تلقائياً.
          </p>
          <a href="#" className="inline-flex items-center gap-2 text-[#4B6BFF] hover:text-[#4B6BFF]/80 text-sm font-medium transition-colors">
            شاهد نموذج تقرير <ArrowRight className="w-4 h-4 rotate-180" />
          </a>
        </div>
      </div>
    </section>
  );
}
