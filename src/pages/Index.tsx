import React, { useEffect, useState, useCallback, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatAgent from "@/components/ChatAgent";

const HowItWorks = React.lazy(() => import("@/components/HowItWorks"));
const AgentShowcase = React.lazy(() => import("@/components/AgentShowcase"));
const Features = React.lazy(() => import("@/components/Features"));
const Philosophy = React.lazy(() => import("@/components/Philosophy"));
const Testimonials = React.lazy(() => import("@/components/Testimonials"));
const ProtocolStack = React.lazy(() => import("@/components/ProtocolStack"));
const Pricing = React.lazy(() => import("@/components/Pricing"));
const ClosingCTA = React.lazy(() => import("@/components/ClosingCTA"));
const ContactForm = React.lazy(() => import("@/components/ContactForm"));
import { useLenis } from "@/hooks/useLenis";

gsap.registerPlugin(ScrollTrigger);

const marqueeItems = [
  "وكيل صوتي",
  "دردشة ذكية",
  "أتمتة متكاملة",
  "تكامل CRM",
  "ربط API",
  "استجابة فورية",
  "دعم 24/7",
  "لغة عربية",
];

const MarqueeStrip = () => (
  <div className="border-y border-white/5 py-5 bg-white/[0.012]">
    <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 px-8" dir="rtl">
      {marqueeItems.map((tag, i) => (
        <span
          key={i}
          className="flex items-center gap-3 text-xs font-mono-system uppercase tracking-widest"
          style={{
            animation: `tagBreath ${3.5 + i * 0.4}s ease-in-out ${i * 0.3}s infinite alternate`,
          }}
        >
          <span className="h-[3px] w-[3px] rounded-full bg-clay/60 flex-shrink-0" />
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const Index = () => {
  useLenis();

  useEffect(() => {
    // Glow-on-enter for all section headings
    const headings = document.querySelectorAll(".text-heading-gradient");
    const triggers = Array.from(headings).map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => el.classList.add("glow-active"),
      })
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  const [loaded, setLoaded] = useState(false);
  const handleLoaded = useCallback(() => setLoaded(true), []);

  return (
    <>
      {!loaded && <Loader onDone={handleLoaded} />}
      <div className={`noise-overlay min-h-screen bg-background ${!loaded ? "opacity-0" : "opacity-100 transition-opacity duration-500"}`}>
        <Navbar />
        <main>
          <Hero />
          <MarqueeStrip />
          <Suspense fallback={<div />}>
            <HowItWorks />
            <AgentShowcase />
            <Features />
            <Philosophy />
            <Testimonials />
            <ProtocolStack />
            <Pricing />
            <ClosingCTA />
            <ContactForm />
          </Suspense>
        </main>
        <Footer />
        <WhatsAppButton />
        <ChatAgent />
      </div>
    </>
  );
};

export default Index;
