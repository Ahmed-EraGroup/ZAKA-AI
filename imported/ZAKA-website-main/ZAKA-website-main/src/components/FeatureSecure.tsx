import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FeatureSecure() {
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
            {/* Secure Card UI */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-sm font-medium text-white">الأمان</span>
            </div>

            {/* Security checklist */}
            <div className="flex-1 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-white font-medium">SSO / SAML</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full badge-online font-mono">
                  نشط
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-white font-medium">مسارات التدقيق</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full badge-online font-mono">
                  نشط
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-sm text-white font-medium">تدوير الأسرار</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full badge-idle font-mono">
                  مجدول
                </span>
              </div>
            </div>

            {/* Recent Events */}
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <p className="text-xs text-gray-400 mb-3">الأحداث الأخيرة</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                  <div>
                    <p className="text-xs text-white">تم إنشاء مفتاح API جديد</p>
                    <p className="text-[10px] text-gray-500">بواسطة admin@zaka.ai • منذ ساعتين</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                  <div>
                    <p className="text-xs text-white">تم تحديث إعدادات SSO</p>
                    <p className="text-[10px] text-gray-500">بواسطة admin@zaka.ai • منذ يوم</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Right (38vw) */}
        <div ref={contentRef} className="w-full md:w-[38vw] pl-0 md:pl-8">
          <span className="font-mono text-xs tracking-[0.12em] text-[#4B6BFF] uppercase mb-4 block">
            الأمان
          </span>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold text-white leading-[0.95] tracking-[-0.02em] mb-6">
            الحوكمة كإعداد افتراضي
          </h2>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-6">
            التحكم في الوصول (RBAC)، سجلات التدقيق، إدارة الأسرار، وضوابط الامتثال — مدمجة، وليست إضافات.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Check className="w-4 h-4 text-[#4B6BFF]" />
              تسجيل الدخول الموحد (SSO / SAML)
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Check className="w-4 h-4 text-[#4B6BFF]" />
              مسارات التدقيق
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Check className="w-4 h-4 text-[#4B6BFF]" />
              تدوير الأسرار
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
