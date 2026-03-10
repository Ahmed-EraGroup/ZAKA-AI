import React, { useEffect, useState } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-[#05060B]/80 backdrop-blur-md border-b border-white/[0.06]' : 'bg-transparent'
      }`}
    >
      <div className="flex justify-between items-center h-16 px-6 lg:px-10 max-w-7xl mx-auto">
        {/* Logo */}
        <a href="#" className="text-2xl font-bold text-white font-display tracking-tight">
          ZAKA
        </a>

        {/* Nav Links (desktop) */}
        <nav className="hidden md:flex gap-8">
          <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
            المنتج
          </a>
          <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
            الحلول
          </a>
          <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
            الأسعار
          </a>
          <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
            المستندات
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <a href="#" className="hidden sm:block text-sm text-gray-400 hover:text-white transition-colors">
            تسجيل الدخول
          </a>
          <button className="bg-[#4B6BFF] hover:bg-[#4B6BFF]/90 text-white rounded-full px-5 py-2 text-sm font-medium transition-all hover:scale-105">
            ابدأ الآن
          </button>
        </div>
      </div>
    </header>
  );
}
