const Footer = () => (
  <footer className="relative bg-charcoal text-foreground rounded-t-[4rem] overflow-hidden mt-8">
    {/* Animated gradient top border */}
    <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
      <div className="footer-gradient-border" />
    </div>

    {/* Subtle Noise Texture */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none noise-overlay-inline" />

    <div className="relative max-w-5xl mx-auto px-6 md:px-12 pt-24 pb-14 text-center">
      {/* Brand */}
      <img
        src="/zaka-logo.svg"
        alt="ZAKA logo"
        className="mx-auto h-12 md:h-14 w-auto object-contain"
        loading="lazy"
      />

      <p className="mt-6 text-muted-foreground max-w-2xl mx-auto leading-relaxed" dir="rtl">
        البنية التحتية لوكلاء الذكاء الاصطناعي.
        انشر وكلاء صوت ودردشة وأتمتة مستقلين داخل موقعك خلال أيام —
        بدون تعقيد تقني.
      </p>

      {/* CTA */}
      <div className="mt-10">
        <a
          href="#deploy"
          className="group inline-flex items-center gap-2 bg-moss hover:bg-moss/80 text-foreground px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-moss/20"
        >
          اطلب عرض توضيحي
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </a>
      </div>

      {/* System Status — enhanced */}
      <div className="mt-12 inline-flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] rounded-full px-5 py-2.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span className="text-sm font-mono-system text-muted-foreground">System Operational</span>
        <span className="text-xs font-mono-system text-muted-foreground/40">99.9% uptime</span>
      </div>

      {/* Bottom */}
      <div className="mt-12 text-xs text-muted-foreground/40 font-mono-system">
        &copy; 2026 ZAKA Infrastructure. All systems active.
      </div>
    </div>
  </footer>
);

export default Footer;
