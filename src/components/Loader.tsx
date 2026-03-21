import { useEffect, useState, useRef, useCallback } from "react";

/* ─── Stage labels ─── */
const STAGES = [
  { ar: "تهيئة البنية التحتية", en: "INIT INFRASTRUCTURE" },
  { ar: "تحميل وكلاء الذكاء", en: "LOAD AGENTS" },
  { ar: "ربط الأنظمة", en: "CONNECT SYSTEMS" },
  { ar: "جاهز", en: "READY" },
];

/* ─── Waveform bar config ─── */
const WAVE_BARS = 48;
const BAR_GAP = 3;

const Loader = ({ onDone }: { onDone: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const [hiding, setHiding] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedRef = useRef(false);

  /* ─── Background: subtle grid + floating dots ─── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
    };
    resize();

    // Floating particles
    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 0.8 + Math.random() * 1.2,
      o: 0.08 + Math.random() * 0.2,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = "rgba(201,107,62,0.025)";
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Dots
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = w;
        if (d.x > w) d.x = 0;
        if (d.y < 0) d.y = h;
        if (d.y > h) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,107,62,${d.o})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ─── Progress timer ─── */
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let raf: number;
    let start: number | null = null;
    const duration = 1800;

    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / duration, 1);
      // Eased with slight stutter at milestones
      const eased = 1 - Math.pow(1 - p, 3.5);
      const val = Math.round(eased * 100);
      setProgress(val);

      if (val < 25) setStage(0);
      else if (val < 55) setStage(1);
      else if (val < 85) setStage(2);
      else setStage(3);

      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setHiding(true);
          setTimeout(onDone, 500);
        }, 200);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  /* ─── Waveform bar heights (deterministic, progress-based) ─── */
  const getBarHeight = useCallback(
    (i: number) => {
      const phase = (i / WAVE_BARS) * Math.PI * 4 + progress * 0.08;
      const base = Math.sin(phase) * 0.5 + 0.5;
      const alive = Math.min(progress / 100, 1);
      return 4 + base * 28 * alive;
    },
    [progress]
  );

  const stageData = STAGES[stage];

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all ${
        hiding
          ? "opacity-0 scale-[1.02] duration-500"
          : "opacity-100 scale-100 duration-300"
      }`}
      style={{ background: "hsl(216 18% 5%)" }}
    >
      {/* Background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Center radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(201,107,62,0.06) 0%, rgba(201,107,62,0.02) 40%, transparent 70%)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo — large, cinematic */}
        <div className="relative mb-10">
          <img
            src="/zaka-logo.svg"
            alt="ZAKA"
            className="w-auto select-none"
            style={{
              height: 52,
              filter: `drop-shadow(0 0 ${12 + progress * 0.2}px rgba(201,107,62,${0.3 + progress * 0.004}))`,
              transition: "filter 0.3s",
            }}
          />
        </div>

        {/* Waveform visualizer */}
        <div
          className="flex items-center justify-center mb-10"
          style={{ gap: BAR_GAP, height: 36 }}
        >
          {Array.from({ length: WAVE_BARS }, (_, i) => {
            const h = getBarHeight(i);
            // Color: center bars are brighter clay, edges fade to muted
            const dist = Math.abs(i - WAVE_BARS / 2) / (WAVE_BARS / 2);
            const opacity = 0.25 + (1 - dist) * 0.6;
            return (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: 2,
                  height: h,
                  background: `rgba(201,107,62,${opacity})`,
                  transition: "height 0.15s ease-out",
                }}
              />
            );
          })}
        </div>

        {/* Progress number — large, mono */}
        <div className="flex items-baseline gap-2 mb-4">
          <span
            className="text-5xl font-display font-bold tabular-nums tracking-tight"
            style={{
              background: "linear-gradient(135deg, #c96b3e 0%, #e8a87c 50%, #c96b3e 100%)",
              backgroundSize: "200% 100%",
              backgroundPosition: `${progress}% 0`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              transition: "background-position 0.3s",
            }}
          >
            {progress}
          </span>
          <span
            className="text-xl font-display font-light"
            style={{ color: "rgba(201,107,62,0.4)" }}
          >
            %
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative w-64 h-[2px] mb-8 rounded-full overflow-hidden bg-white/[0.04]">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, rgba(201,107,62,0.3), #c96b3e)",
              boxShadow: "0 0 16px rgba(201,107,62,0.4)",
              transition: "width 0.15s ease-out",
            }}
          />
          {/* Pulse at the leading edge */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
            style={{
              left: `${progress}%`,
              background: "#c96b3e",
              boxShadow: "0 0 8px rgba(201,107,62,0.8), 0 0 20px rgba(201,107,62,0.4)",
              transition: "left 0.15s ease-out",
            }}
          />
        </div>

        {/* Stage info */}
        <div className="flex flex-col items-center gap-2" dir="rtl">
          <p
            className="text-sm text-foreground/70 font-medium transition-opacity duration-300"
            key={`ar-${stage}`}
            style={{ animation: "loaderFadeUp 0.35s ease-out" }}
          >
            {stageData.ar}
          </p>
          <p
            className="text-[10px] font-mono-system uppercase tracking-[4px] text-clay/30"
            key={`en-${stage}`}
            style={{ animation: "loaderFadeUp 0.35s ease-out 0.05s both" }}
          >
            {stageData.en}
          </p>
        </div>

        {/* Bottom decorative dots — connection status */}
        <div className="flex items-center gap-3 mt-10">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-[5px] h-[5px] rounded-full transition-all duration-500"
                style={{
                  background:
                    stage >= i
                      ? "#c96b3e"
                      : "rgba(201,107,62,0.12)",
                  boxShadow:
                    stage >= i
                      ? "0 0 8px rgba(201,107,62,0.5)"
                      : "none",
                }}
              />
              {i < 3 && (
                <div
                  className="h-[1px] transition-all duration-700"
                  style={{
                    width: 24,
                    background:
                      stage > i
                        ? "rgba(201,107,62,0.3)"
                        : "rgba(201,107,62,0.06)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes loaderFadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
