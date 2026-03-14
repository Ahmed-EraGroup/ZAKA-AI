import { useMemo, useRef, useState, useCallback, useEffect } from "react";

type OrbState = "idle" | "listening" | "processing" | "speaking";

const NUM_PARTICLES = 28;

interface Particle {
  id: number;
  angle: number;
  radius: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
}

const generateParticles = (): Particle[] =>
  Array.from({ length: NUM_PARTICLES }, (_, i) => ({
    id: i,
    angle: (360 / NUM_PARTICLES) * i + Math.random() * 15,
    radius: 120 + Math.random() * 60,
    size: 2 + Math.random() * 4,
    speed: 8 + Math.random() * 12,
    opacity: 0.3 + Math.random() * 0.7,
    delay: Math.random() * 5,
  }));

const stateConfig: Record<OrbState, {
  label: string;
  gradient: string;
  glow: string;
  ring: string;
  particleColor: string;
}> = {
  idle: {
    label: "اضغط للتحدث",
    gradient: "radial-gradient(circle at 35% 35%, #6ac6ff, #4facfe 40%, #0077cc)",
    glow: "0 0 50px rgba(79,172,254,0.55), 0 0 100px rgba(79,172,254,0.2)",
    ring: "rgba(79,172,254,",
    particleColor: "rgba(79,172,254,",
  },
  listening: {
    label: "جارٍ الاستماع...",
    gradient: "radial-gradient(circle at 35% 35%, #a0ffd6, #43e97b 40%, #1a9e55)",
    glow: "0 0 60px rgba(67,233,123,0.65), 0 0 120px rgba(67,233,123,0.25)",
    ring: "rgba(67,233,123,",
    particleColor: "rgba(67,233,123,",
  },
  processing: {
    label: "جارٍ المعالجة...",
    gradient: "radial-gradient(circle at 35% 35%, #ffe580, #f9d423 40%, #d4830a)",
    glow: "0 0 60px rgba(249,212,35,0.65), 0 0 110px rgba(249,212,35,0.25)",
    ring: "rgba(249,212,35,",
    particleColor: "rgba(249,212,35,",
  },
  speaking: {
    label: "جارٍ الرد...",
    gradient: "radial-gradient(circle at 35% 35%, #ffb3d0, #fa709a 40%, #c0305a)",
    glow: "0 0 70px rgba(250,112,154,0.7), 0 0 140px rgba(250,112,154,0.25)",
    ring: "rgba(250,112,154,",
    particleColor: "rgba(250,112,154,",
  },
};

const ParticleOrb = () => {
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const orbStateRef = useRef<OrbState>("idle");
  const [particles, setParticles] = useState<Particle[]>(generateParticles);
  const [ripple, setRipple] = useState(false);
  const recognitionRef = useRef<any>(null);
  const demoTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const config = stateConfig[orbState];

  useEffect(() => {
    orbStateRef.current = orbState;
  }, [orbState]);

  useEffect(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1280;
    if (w < 640) {
      setParticles((prev) =>
        prev.map((p) => ({ ...p, radius: p.radius * 0.6, size: Math.max(1, p.size * 0.8) }))
      );
    }
  }, []);

  // Cleanup demo timers on unmount
  useEffect(() => () => demoTimersRef.current.forEach(clearTimeout), []);

  const speak = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.onend = () => setOrbState("idle");
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  const respond = useCallback(
    (userText: string) => {
      let reply = "لم أفهم طلبك، هل يمكنك تكراره؟";
      if (userText.includes("مرحبا") || userText.includes("أهلا"))
        reply = "أهلاً بك، كيف يمكنني مساعدتك؟";
      else if (userText.includes("وقت") || userText.includes("الساعة"))
        reply = `الساعة الآن ${new Date().toLocaleTimeString("ar-SA")}`;
      else if (userText.includes("اسمك"))
        reply = "أنا زكاء، مساعدك الصوتي الذكي.";
      setOrbState("speaking");
      speak(reply);
    },
    [speak]
  );

  // Demo cycle when SpeechRecognition isn't available
  const runDemo = useCallback(() => {
    const clear = (id: ReturnType<typeof setTimeout>) =>
      demoTimersRef.current.push(id);

    setOrbState("listening");
    clear(setTimeout(() => {
      setOrbState("processing");
      clear(setTimeout(() => {
        setOrbState("speaking");
        clear(setTimeout(() => setOrbState("idle"), 2200));
      }, 1200));
    }, 2000));
  }, []);

  const handleOrbClick = useCallback(() => {
    if (orbState !== "idle") return;

    // Ripple feedback
    setRipple(true);
    setTimeout(() => setRipple(false), 600);

    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SR) {
      runDemo();
      return;
    }

    const recognition = new SR();
    recognition.lang = "ar-SA";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => setOrbState("listening");
    recognition.onresult = (event: any) => {
      setOrbState("processing");
      setTimeout(() => respond(event.results[0][0].transcript), 600);
    };
    recognition.onerror = () => setOrbState("idle");
    recognition.onend = () => {
      if (orbStateRef.current === "listening") setOrbState("idle");
    };

    try { recognition.start(); } catch (_) { runDemo(); }
  }, [orbState, respond, runDemo]);

  return (
    <div className="relative w-full flex flex-col items-center justify-center gap-6" style={{ height: 340 }} dir="rtl">

      {/* Particles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180;
          const x = Math.cos(rad) * p.radius;
          const y = Math.sin(rad) * p.radius;
          return (
            <div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                background: `${config.particleColor}${p.opacity})`,
                boxShadow: `0 0 ${p.size * 2}px ${config.particleColor}${p.opacity * 0.5})`,
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
                animation: `particle-float ${p.speed}s ease-in-out ${p.delay}s infinite alternate`,
                transition: "background 0.5s, box-shadow 0.5s",
                willChange: "transform, opacity",
              }}
            />
          );
        })}
      </div>

      {/* Animated rings */}
      {[1, 2, 3].map((ring) => (
        <div
          key={ring}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 220 + ring * 38,
            height: 220 + ring * 38,
            border: `1px solid ${config.ring}${0.18 - ring * 0.04})`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: `ringPulse ${2.5 + ring * 0.7}s ease-in-out ${ring * 0.4}s infinite alternate`,
            transition: "border-color 0.5s",
          }}
        />
      ))}

      {/* Ripple on click */}
      {ripple && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 230,
            height: 230,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: `2px solid ${config.ring}0.8)`,
            animation: "rippleOut 0.6s ease-out forwards",
          }}
        />
      )}

      {/* Orb */}
      <div
        className={`relative z-10 rounded-full cursor-pointer transition-all duration-500 hover:scale-[1.06] ${
          orbState === "listening" ? "animate-orb-pulse" : ""
        } ${orbState === "speaking" ? "scale-110" : ""}`}
        onClick={handleOrbClick}
        style={{
          width: 200,
          height: 200,
          background: config.gradient,
          boxShadow: config.glow,
          transition: "background 0.5s, box-shadow 0.5s, transform 0.3s",
          willChange: "transform",
        }}
      >
        {/* Inner glare */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "45%",
            height: "38%",
            top: "14%",
            left: "16%",
            background: "radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 80%)",
          }}
        />
      </div>

      <p className="relative z-10 text-sm text-foreground/60 tracking-wide transition-opacity duration-300">
        {config.label}
      </p>
    </div>
  );
};

export default ParticleOrb;
