import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "قللنا وقت حل التذاكر بنسبة 40% في أسبوعين.",
    author: "قائد الهندسة",
    company: "برمجيات كخدمة",
  },
  {
    quote: "عمليات النشر تحولت من مخيفة إلى مملة.",
    author: "مهندس منصة",
    company: "تكنولوجيا مالية",
  },
  {
    quote: "المراقبة أصبحت أخيراً منطقية لنماذج اللغة الكبيرة (LLMs).",
    author: "مهندس تعلم الآلة",
    company: "شركة ذكاء اصطناعي ناشئة",
  },
  {
    quote: "فريق الدعم لدينا ينام فعلياً الآن.",
    author: "رئيس نجاح العملاء",
    company: "تجارة إلكترونية",
  },
  {
    quote: "إعادة تشغيل التتبع وفرت علينا ساعات من تصحيح الأخطاء.",
    author: "مهندس ذكاء اصطناعي",
    company: "مؤسسة",
  },
  {
    quote: "التحكم في الوصول وسجلات التدقيق جاهزة للاستخدام.",
    author: "قائد الأمان",
    company: "رعاية صحية",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current && cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
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
    <section ref={sectionRef} className="w-full py-24 md:py-32 bg-[#05060B] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] glow-orb-indigo opacity-20 rounded-full" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-bold text-white tracking-[-0.02em] mb-4">
            محبوب من قبل المطورين
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            الفرق تطلق منتجاتها بشكل أسرع عندما يقوم الوكلاء بالعمل الشاق.
          </p>
        </div>

        {/* Cards Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 md:translate-y-0 lg:odd:translate-y-6 hover:bg-white/[0.05] transition-colors"
            >
              {/* 5 stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white text-base leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4B6BFF]/40 to-[#4B6BFF]/20 flex items-center justify-center text-white font-bold text-sm">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.author}</p>
                  <p className="text-xs text-gray-400">{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logo Bar */}
        <div className="mt-20 lg:mt-32">
          <p className="text-center text-xs text-gray-400 uppercase tracking-wider mb-8">
            موثوق من قبل فرق في
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12" dir="ltr">
            {['Stripe', 'Notion', 'Figma', 'Linear', 'Vercel', 'Supabase', 'Raycast', 'Pitch'].map((logo) => (
              <span key={logo} className="font-display text-lg md:text-xl text-gray-400/40 font-bold hover:text-gray-400/80 transition-colors cursor-default">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
