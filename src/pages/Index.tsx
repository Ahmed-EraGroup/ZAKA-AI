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
    const headings = document.querySelectorAll(".text-heading-gradient");
    headings.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        onEnter: () => el.classList.add("glow-active"),
      });
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
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
