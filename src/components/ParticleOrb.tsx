import { useMemo, useRef, useState, useCallback, useEffect } from "react";

type OrbState = "idle" | "listening" | "processing" | "speaking";

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
}

interface SpeechRecognitionResultItemLike {
  transcript: string;
}

interface SpeechRecognitionEventLike {
  results: {
    0: {
      0: SpeechRecognitionResultItemLike;
    };
  };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;
type ExtendedWindow = Window & {
  SpeechRecognition?: SpeechRecognitionCtor;
  webkitSpeechRecognition?: SpeechRecognitionCtor;
};

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

const stateConfig: Record<
  OrbState,
  { label: string; gradient: string; shadow: string; particleColor: string }
> = {
  idle: {
    label: "اضغط للتحدث",
    gradient: "radial-gradient(circle at 30% 30%, #4facfe, #00f2fe)",
    shadow: "0 0 40px rgba(79, 172, 254, 0.5), 0 0 80px rgba(0, 242, 254, 0.2)",
    particleColor: "rgba(79, 172, 254,",
  },
  listening: {
    label: "جارٍ الاستماع...",
    gradient: "radial-gradient(circle at 30% 30%, #43e97b, #38f9d7)",
    shadow: "0 0 60px rgba(67, 233, 123, 0.6), 0 0 120px rgba(56, 249, 215, 0.3)",
    particleColor: "rgba(67, 233, 123,",
  },
  processing: {
    label: "جارٍ المعالجة...",
    gradient: "radial-gradient(circle at 30% 30%, #f9d423, #ff4e50)",
    shadow: "0 0 60px rgba(249, 212, 35, 0.6), 0 0 100px rgba(255, 78, 80, 0.3)",
    particleColor: "rgba(249, 212, 35,",
  },
  speaking: {
    label: "جارٍ الرد...",
    gradient: "radial-gradient(circle at 30% 30%, #fa709a, #fee140)",
    shadow: "0 0 70px rgba(250, 112, 154, 0.7), 0 0 140px rgba(254, 225, 64, 0.3)",
    particleColor: "rgba(250, 112, 154,",
  },
};

const ParticleOrb = () => {
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const orbStateRef = useRef<OrbState>(orbState);
  const [particles, setParticles] = useState<Particle[]>(generateParticles);
  const recognitionRef = useRef<any>(null);

  const config = stateConfig[orbState];

  useEffect(() => {
    orbStateRef.current = orbState;
  }, [orbState]);

  useEffect(() => {
    // Reduce particle radii on small screens for better fit
    const w = typeof window !== 'undefined' ? window.innerWidth : 1280;
    if (w < 640) {
      setParticles((prev) => prev.map((p) => ({ ...p, radius: p.radius * 0.6, size: Math.max(1, p.size * 0.8) })));
    }
  }, []);

  const speak = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.onend = () => {
      setOrbState("idle");
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  const respond = useCallback(
    (userText: string) => {
      let reply = "لم أفهم طلبك، هل يمكنك تكراره؟";

      if (userText.includes("مرحبا") || userText.includes("أهلا")) {
        reply = "أهلاً بك، كيف يمكنني مساعدتك؟";
      } else if (userText.includes("وقت") || userText.includes("الساعة")) {
        const now = new Date().toLocaleTimeString("ar-SA");
        reply = `الساعة الآن ${now}`;
      } else if (userText.includes("اسمك")) {
        reply = "أنا زكاء، مساعدك الصوتي الذكي.";
      }

      setOrbState("speaking");
      speak(reply);
    },
    [speak]
  );

  const handleOrbClick = useCallback(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return;
    if (orbState !== "idle") return;

    const recognition = new SpeechRecognition();
    recognition.lang = "ar-SA";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      orbStateRef.current = "listening";
      setOrbState("listening");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setOrbState("processing");
      setTimeout(() => respond(transcript), 600);
    };

    recognition.onerror = () => {
      setOrbState("idle");
    };

    recognition.onend = () => {
      setOrbState((prev) => (prev === "listening" ? "idle" : prev));
    };

    try {
      recognition.start();
    } catch (e) {
      // ignore
    }
  }, [orbState, respond]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-6" dir="rtl">
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
                boxShadow: `0 0 ${p.size * 2}px ${config.particleColor}${p.opacity * 0.6})`,
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
                animation: `particle-float ${p.speed}s ease-in-out ${p.delay}s infinite alternate`,
                transition: "background 0.4s, box-shadow 0.4s",
                willChange: "transform, opacity",
              }}
            />
          );
        })}
      </div>

      {/* Orb */}
      <div
        className={`relative z-10 w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px] rounded-full cursor-pointer transition-all duration-300 hover:scale-105 ${
          orbState === "listening" ? "animate-orb-pulse" : ""
        } ${orbState === "speaking" ? "scale-110" : ""}`}
        onClick={handleOrbClick}
        style={{
          background: config.gradient,
          boxShadow: config.shadow,
          willChange: "transform",
        }}
      />

      <p className="mt-6 text-sm text-foreground/70">{config.label}</p>
    </div>
  );
};

export default ParticleOrb;
