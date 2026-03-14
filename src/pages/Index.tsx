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

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
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
