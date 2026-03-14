import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import AgentShowcase from "@/components/AgentShowcase";
import Features from "@/components/Features";
import Philosophy from "@/components/Philosophy";
import ProtocolStack from "@/components/ProtocolStack";
import Pricing from "@/components/Pricing";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
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

const MarqueeStrip = () => {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="overflow-hidden border-y border-white/5 py-4 bg-white/[0.012]">
      <div className="flex gap-10 animate-marquee whitespace-nowrap w-max">
        {items.map((tag, i) => (
          <span
            key={i}
            className="flex items-center gap-4 text-xs font-mono-system text-foreground/35 uppercase tracking-widest"
          >
            {tag}
            <span className="h-[3px] w-[3px] rounded-full bg-clay/50" />
          </span>
        ))}
      </div>
    </div>
  );
};

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

  return (
    <div className="noise-overlay min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <MarqueeStrip />
        <HowItWorks />
        <AgentShowcase />
        <Features />
        <Philosophy />
        <ProtocolStack />
        <Pricing />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
