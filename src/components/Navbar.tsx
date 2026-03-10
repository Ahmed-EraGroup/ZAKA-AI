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
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-full px-8 py-3 flex items-center gap-8 ${
        scrolled
          ? "bg-midnight/80 backdrop-blur-xl border border-border shadow-lg shadow-midnight/50"
          : "bg-transparent"
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
    </nav>
  );
};

export default Navbar;
