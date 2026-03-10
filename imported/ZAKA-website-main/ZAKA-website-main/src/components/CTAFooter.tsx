import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MessageCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function CTAFooter() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current && ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }, []);

  return (
    <>
      {/* CTA Area */}
      <div ref={sectionRef} className="relative py-24 md:py-32 bg-[#0B0E16] overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vh] glow-orb-indigo opacity-30 rounded-full" />

        <div ref={ctaRef} className="text-center px-6 relative z-10">
          <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-bold text-white tracking-[-0.03em] mb-4">
            ابدأ البناء مجاناً
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-md mx-auto">
            بدون بطاقة ائتمان. بدون حدود لبيئة الاختبار. فقط انشر.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-[#4B6BFF] hover:bg-[#4B6BFF]/90 text-white rounded-full px-8 py-3 text-base font-medium transition-all hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center">
              إنشاء حساب <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
            <button className="border border-white/10 hover:bg-white/5 text-white rounded-full px-8 py-3 text-base font-medium transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
              <MessageCircle className="w-4 h-4" /> تحدث إلى المبيعات
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-16 px-6 lg:px-10 bg-[#0B0E16]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Logo Column */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <a href="#" className="font-display text-2xl font-bold text-white tracking-tight">ZAKA</a>
              <p className="mt-4 text-sm text-gray-400 max-w-xs">
                بنية تحتية لوكلاء الذكاء الاصطناعي للفرق التي تنجز.
              </p>
              <div className="flex items-center gap-4 mt-6">
                {/* Social icons */}
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-medium text-white text-sm mb-4">المنتج</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">الوكلاء</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">مسارات العمل</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">المراقبة</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">الأمان</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">الأسعار</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-medium text-white text-sm mb-4">الموارد</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">المستندات</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">مرجع API</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">سجل التغييرات</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">الحالة</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-medium text-white text-sm mb-4">الشركة</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">المدونة</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">الوظائف</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">اتصل بنا</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-medium text-white text-sm mb-4">قانوني</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">الخصوصية</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">الشروط</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">© 2024 ZAKA. جميع الحقوق محفوظة.</p>
            <p className="text-xs text-gray-400">مبني لمستقبل الذكاء الاصطناعي.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
