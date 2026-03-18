import { useEffect, useState, useRef } from "react";

const STAGES = [
  "تهيئة النظام...",
  "تحميل وكلاء الذكاء...",
  "ربط الأنظمة...",
  "جاهز للإطلاق",
];

const Loader = ({ onDone }: { onDone: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const [hiding, setHiding] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 1 + Math.random() * 2,
      o: 0.15 + Math.random() * 0.35,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,107,62,${p.o})`;
        ctx.fill();
      }
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201,107,62,${0.08 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Progress animation
  useEffect(() => {
    let raf: number;
    let start: number | null = null;
    const duration = 1400;

    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(eased * 100);
      setProgress(val);

      // Update stage
      if (val < 25) setStage(0);
      else if (val < 55) setStage(1);
      else if (val < 85) setStage(2);
      else setStage(3);

      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setHiding(true);
        setTimeout(onDone, 400);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-midnight flex flex-col items-center justify-center transition-all duration-700 ${
        hiding ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated orb */}
        <div className="relative">
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              width: 120,
              height: 120,
              top: -10,
              left: -10,
              background: "radial-gradient(circle, rgba(201,107,62,0.15) 0%, transparent 70%)",
              animationDuration: "2s",
            }}
          />

          {/* Spinning ring */}
          <svg width="100" height="100" viewBox="0 0 100 100" className="animate-spin" style={{ animationDuration: "3s" }}>
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="rgba(201,107,62,0.15)"
              strokeWidth="1"
            />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="#c96b3e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.83} 283`}
              className="transition-all duration-200"
              transform="rotate(-90 50 50)"
            />
          </svg>

          {/* Logo in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/zaka-logo.svg"
              alt="ذكــاء"
              className="h-8 w-auto object-contain"
              style={{
                filter: `drop-shadow(0 0 ${8 + progress * 0.2}px rgba(201,107,62,0.5))`,
              }}
            />
          </div>
        </div>

        {/* Progress number */}
        <div className="flex items-baseline gap-1">
          <span
            className="text-4xl font-display font-bold tabular-nums"
            style={{
              background: "linear-gradient(135deg, #c96b3e 0%, #f0c27f 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {progress}
          </span>
          <span className="text-lg text-clay/60 font-display">%</span>
        </div>

        {/* Stage label */}
        <p
          className="text-sm font-mono-system text-muted-foreground transition-all duration-300"
          dir="rtl"
          key={stage}
          style={{ animation: "fadeInUp 0.3s ease-out" }}
        >
          {STAGES[stage]}
        </p>

        {/* Progress bar */}
        <div className="w-56 h-[3px] bg-border/20 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-150"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #c96b3e, #f0c27f)",
              boxShadow: "0 0 12px rgba(201,107,62,0.5)",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
