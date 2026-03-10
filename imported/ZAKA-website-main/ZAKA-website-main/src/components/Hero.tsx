import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, Play, MessageCircle, Shield, Eye, Users, Rocket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load animation
    const tl = gsap.timeline();

    tl.fromTo(
      contentRef.current?.children || [],
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
    ).fromTo(
      cardRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
      '-=0.4'
    );

    // Scroll animation
    if (sectionRef.current) {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        animation: gsap.to(sectionRef.current, {
          opacity: 0,
          y: -100,
          ease: 'none',
        }),
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen relative overflow-hidden bg-[#05060B]">
      {/* Ambient Glow Orbs */}
      <div className="absolute left-[8vw] top-[10vh] w-[34vw] h-[34vw] glow-orb-indigo opacity-55 rounded-full" />
      <div className="absolute right-[6vw] bottom-[8vh] w-[28vw] h-[28vw] glow-orb-cyan opacity-35 rounded-full" />

      {/* Content */}
      <div ref={contentRef} className="flex flex-col items-center pt-[13.5vh] relative z-10 px-4">
        {/* Eyebrow */}
        <span className="font-mono text-xs tracking-[0.12em] text-gray-400 uppercase mb-4">
          منصة ZAKA
        </span>

        {/* Headline */}
        <h1 className="text-center text-white font-display font-bold leading-[0.92] tracking-[-0.03em] text-[clamp(2.5rem,8vw,6rem)] max-w-[78vw]">
          الذكاء الاصطناعي الذي يعمل عنك
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg text-gray-400 text-center max-w-[52vw]">
          انشر وكلاء ذكاء اصطناعي صوتيين وكتابيين ووكلاء أتمتة مستقلين مباشرة داخل موقعك الإلكتروني. ZAKA تمثل طبقة البنية التحتية لوكلاء الذكاء الاصطناعي — تمكّنك من تشغيلهم وإدارتهم بسهولة.
        </p>

        {/* CTA Row */}
        <div className="flex items-center gap-4 mt-8">
          <button className="bg-[#4B6BFF] hover:bg-[#4B6BFF]/90 text-white rounded-full px-8 py-3 font-medium transition-all hover:scale-105 flex items-center gap-2">
            ابدأ البناء مجاناً <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
          <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium">
            شاهد العرض التوضيحي
          </a>
        </div>
      </div>

      {/* Dashboard Card */}
      <div
        ref={cardRef}
        className="absolute left-1/2 top-[72vh] -translate-x-1/2 w-[86vw] max-w-[1180px] h-[44vh] min-h-[320px] glass-card z-20"
      >
        {/* Dashboard UI */}
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="hidden sm:flex w-14 md:w-16 border-l border-white/[0.06] bg-white/[0.02] flex-col items-center py-4 gap-3 rounded-r-[28px]">
            <div className="w-8 h-8 rounded-lg bg-[#4B6BFF]/20 flex items-center justify-center mb-4">
              <div className="w-4 h-4 rounded bg-[#4B6BFF]" />
            </div>
            <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Users className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Rocket className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Eye className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Shield className="w-5 h-5" />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Agent List */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
              <div className="flex justify-between mb-4">
                <h3 className="text-sm font-medium text-white">الوكلاء</h3>
                <span className="text-xs text-gray-400">3 نشطين</span>
              </div>
              <div className="space-y-2">
                {/* Agent Row 1 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors cursor-pointer border border-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-sm text-white font-medium">مصنف الدعم</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">1.2k مهمة</span>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full badge-online font-mono">
                      متصل
                    </span>
                  </div>
                </div>
                {/* Agent Row 2 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors cursor-pointer border border-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-sm text-white font-medium">مراجع الكود</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">450 طلب سحب</span>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full badge-online font-mono">
                      متصل
                    </span>
                  </div>
                </div>
                {/* Agent Row 3 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors cursor-pointer border border-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    <span className="text-sm text-white font-medium">مستخرج البيانات</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">0 مهمة</span>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full badge-idle font-mono">
                      خامل
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Log Panel */}
            <div className="w-48 md:w-64 border-r border-white/[0.06] bg-white/[0.02] p-4 hidden sm:flex flex-col rounded-l-[28px]">
              <h3 className="font-mono text-xs tracking-wider text-gray-400 uppercase mb-4">السجل المباشر</h3>
              <div className="flex-1 space-y-3 overflow-y-auto font-mono text-[10px] text-gray-500 text-left" dir="ltr">
                <p><span className="text-emerald-400">[OK]</span> تمت معالجة التذكرة #8921 بواسطة مصنف الدعم</p>
                <p><span className="text-emerald-400">[OK]</span> تمت الموافقة على طلب السحب #442 بواسطة مراجع الكود</p>
                <p><span className="text-[#4B6BFF]">[INFO]</span> مستخرج البيانات يدخل في حالة خمول</p>
                <p><span className="text-emerald-400">[OK]</span> تمت معالجة التذكرة #8922 بواسطة مصنف الدعم</p>
                <p><span className="text-emerald-400">[OK]</span> تمت معالجة التذكرة #8923 بواسطة مصنف الدعم</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
