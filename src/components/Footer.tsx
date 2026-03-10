const Footer = () => (
  <footer className="relative bg-charcoal text-foreground rounded-t-[4rem] overflow-hidden mt-8">
    {/* Subtle Noise Texture */}
    <div
      className="absolute inset-0 opacity-5 pointer-events-none"
      style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/noise.png')" }}
    />

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
          className="inline-block bg-moss hover:bg-moss/80 text-foreground px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
        >
          اطلب عرض توضيحي
        </a>
      </div>

      {/* System Status */}
      <div className="mt-12 flex items-center justify-center gap-3 text-sm font-mono-system text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span>System Operational</span>
      </div>

      {/* Bottom */}
      <div className="mt-12 text-xs text-muted-foreground/40 font-mono-system">
        © 2026 ZAKA Infrastructure. All systems active.
      </div>
    </div>
  </footer>
);

export default Footer;
