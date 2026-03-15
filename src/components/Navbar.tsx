import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      dir="rtl"
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-full px-6 py-3 flex items-center gap-6 ${
        scrolled
          ? "bg-midnight/80 backdrop-blur-xl border border-border shadow-lg shadow-midnight/50"
          : "bg-midnight/40 backdrop-blur-md border border-border/30"
      }`}
    >
      <a href="#" className="inline-flex items-center" aria-label="الرئيسية">
        <img
          src="/zaka-logo.svg"
          alt="ذكــاء"
          className="h-9 w-auto object-contain"
          loading="eager"
        />
      </a>

      <div className="hidden md:flex items-center gap-5 text-sm text-foreground/70">
        <a href="#how-it-works" className="hover:text-clay transition-colors duration-200">كيف يعمل</a>
        <a href="#agents"       className="hover:text-clay transition-colors duration-200">الوكلاء</a>
        <a href="#enterprise"   className="hover:text-clay transition-colors duration-200">الباقات</a>
      </div>

      <a
        href="#deploy"
        className="hidden md:inline-flex items-center bg-clay text-bone text-sm font-medium px-4 py-2 rounded-full hover:brightness-95 transition-all"
      >
        تواصل معنا
      </a>
    </nav>
  );
};

export default Navbar;
