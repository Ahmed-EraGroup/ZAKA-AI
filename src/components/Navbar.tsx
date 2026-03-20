import { useEffect, useRef, useState, useCallback } from "react";

const navLinks = [
  { href: "#how-it-works", label: "كيف يعمل" },
  { href: "#agents", label: "الوكلاء" },
  { href: "#enterprise", label: "الباقات" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 60);
        if (y > 60) {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight > 0) setScrollProgress(Math.min(y / docHeight, 1));
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleNav = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        dir="rtl"
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-full px-6 py-3 flex items-center gap-6 ${
          scrolled
            ? "bg-midnight/70 border border-border/60 shadow-2xl shadow-midnight/60"
            : "bg-midnight/30 border border-white/[0.06]"
        }`}
        style={{
          backdropFilter: scrolled ? "blur(24px) saturate(1.4)" : "blur(12px) saturate(1.1)",
          WebkitBackdropFilter: scrolled ? "blur(24px) saturate(1.4)" : "blur(12px) saturate(1.1)",
        }}
      >
        <a href="#" className="inline-flex items-center" aria-label="الرئيسية">
          <img
            src="/zaka-logo.svg"
            alt="ذكــاء"
            className="h-9 w-auto object-contain"
            loading="eager"
          />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5 text-sm text-foreground/70">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNav(e, link.href)}
              className="relative hover:text-clay transition-colors duration-200 py-1 group"
            >
              {link.label}
              <span className="absolute bottom-0 right-0 h-[1.5px] w-0 bg-clay rounded-full transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <a
          href="#deploy"
          onClick={(e) => handleNav(e, "#deploy")}
          className="hidden md:inline-flex items-center bg-clay text-bone text-sm font-medium px-4 py-2 rounded-full hover:brightness-110 hover:shadow-lg hover:shadow-clay/25 transition-all duration-300"
        >
          تواصل معنا
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="القائمة"
          aria-expanded={menuOpen}
        >
          <span className={`block w-5 h-[2px] bg-foreground transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block w-5 h-[2px] bg-foreground transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-[2px] bg-foreground transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>

        {/* Scroll progress bar */}
        {scrolled && (
          <div className="absolute -bottom-[3px] left-4 right-4 h-[2px] rounded-full overflow-hidden bg-white/[0.06]">
            <div
              className="h-full rounded-full transition-[width] duration-150 ease-out"
              style={{
                width: `${scrollProgress * 100}%`,
                background: "linear-gradient(90deg, hsl(var(--clay)), hsl(var(--bone)))",
              }}
            />
          </div>
        )}
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-midnight/95 backdrop-blur-xl transition-all duration-400 flex flex-col items-center justify-center gap-8 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        dir="rtl"
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNav(e, link.href)}
            className="text-2xl font-display font-bold text-foreground hover:text-clay transition-colors"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#deploy"
          onClick={(e) => handleNav(e, "#deploy")}
          className="bg-clay text-bone font-semibold px-8 py-3 rounded-full text-lg"
        >
          تواصل معنا
        </a>
      </div>
    </>
  );
};

export default Navbar;
