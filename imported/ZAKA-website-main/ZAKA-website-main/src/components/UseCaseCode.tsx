import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function UseCaseCode() {
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
        contentRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3 }
      )
        .fromTo(
          imageRef.current,
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.3 },
          '<'
        )
        // Settle
        .to({}, { duration: 0.4 })
        // Exit
        .to(contentRef.current, { x: -100, opacity: 0, duration: 0.3 })
        .to(imageRef.current, { x: 100, opacity: 0, duration: 0.3 }, '<');
    }
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen relative overflow-hidden bg-[#05060B]">
      <div className="relative z-10 flex flex-col md:flex-row h-full">
        {/* Content Left (54vw) */}
        <div ref={contentRef} className="w-full md:absolute md:left-0 md:top-0 md:w-[54vw] h-[50vh] md:h-full flex flex-col justify-center px-8 md:px-[4vw]">
          <span className="font-mono text-xs tracking-[0.12em] text-[#4B6BFF] uppercase mb-4">
            حالة استخدام
          </span>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold text-white leading-[0.95] tracking-[-0.02em] mb-6">
            توليد أكواد يمكنك الوثوق بها
          </h2>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-6 max-w-xl">
            قم بتوليد واختبار وتوثيق الكود مع سياق من مستودعك — راجع قبل دمج أي شيء.
          </p>
          <a href="#" className="inline-flex items-center gap-2 text-[#4B6BFF] hover:text-[#4B6BFF]/80 text-sm font-medium transition-colors">
            استكشف المستندات <ArrowRight className="w-4 h-4 rotate-180" />
          </a>
        </div>

        {/* Image Panel Right (46vw) */}
        <div ref={imageRef} className="w-full md:absolute md:right-0 md:top-0 md:w-[46vw] h-[50vh] md:h-full bg-gradient-to-bl from-emerald-500/30 via-emerald-500/10 to-transparent flex items-center justify-center p-4">
          {/* Code block Card */}
          <div className="w-full max-w-[400px] h-[30vh] min-h-[200px] glass-card p-5 flex flex-col relative overflow-hidden bg-[#0B0E16]/80">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-gray-500 mr-2 font-mono">api.ts</span>
            </div>
            <pre className="font-mono text-[10px] sm:text-xs text-gray-300 overflow-x-auto text-left" dir="ltr">
              <code>
                <span className="text-purple-400">async function</span> <span className="text-blue-400">getUser</span>(id: <span className="text-yellow-400">string</span>) {'{'}
                <br />
                {'  '}try {'{'}
                <br />
                {'    '}<span className="text-purple-400">const</span> user = <span className="text-purple-400">await</span> db.users.findUnique({'{'}
                <br />
                {'      '}where: {'{'} id {'}'},
                <br />
                {'    '}{'}'});
                <br />
                {'    '}<span className="text-purple-400">return</span> user;
                <br />
                {'  '}{'}'} catch (error) {'{'}
                <br />
                {'    '}logger.error(<span className="text-green-400">'Failed to fetch user'</span>, error);
                <br />
                {'    '}<span className="text-purple-400">throw</span> new <span className="text-yellow-400">ApiError</span>(500);
                <br />
                {'  '}{'}'}
                <br />
                {'}'}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
