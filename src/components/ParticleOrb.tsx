import { useRef, useState, useCallback, useEffect } from "react";

type OrbState = "idle" | "listening" | "processing" | "speaking";

const NUM_PARTICLES = 28;

interface Particle {
  id: number; angle: number; radius: number;
  size: number; speed: number; opacity: number; delay: number;
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
  label: string; gradient: string; glow: string;
  ring: string; particleColor: string;
}> = {
  idle: {
    label: "اضغط لبدء المحادثة",
    gradient: "radial-gradient(circle at 35% 35%, #6ac6ff, #4facfe 40%, #0077cc)",
    glow: "0 0 50px rgba(79,172,254,0.55), 0 0 100px rgba(79,172,254,0.2)",
    ring: "rgba(79,172,254,", particleColor: "rgba(79,172,254,",
  },
  listening: {
    label: "تكلّم... (اضغط للإيقاف)",
    gradient: "radial-gradient(circle at 35% 35%, #a0ffd6, #43e97b 40%, #1a9e55)",
    glow: "0 0 60px rgba(67,233,123,0.65), 0 0 120px rgba(67,233,123,0.25)",
    ring: "rgba(67,233,123,", particleColor: "rgba(67,233,123,",
  },
  processing: {
    label: "جارٍ التفكير...",
    gradient: "radial-gradient(circle at 35% 35%, #ffe580, #f9d423 40%, #d4830a)",
    glow: "0 0 60px rgba(249,212,35,0.65), 0 0 110px rgba(249,212,35,0.25)",
    ring: "rgba(249,212,35,", particleColor: "rgba(249,212,35,",
  },
  speaking: {
    label: "اضغط للمقاطعة",
    gradient: "radial-gradient(circle at 35% 35%, #ffb3d0, #fa709a 40%, #c0305a)",
    glow: "0 0 70px rgba(250,112,154,0.7), 0 0 140px rgba(250,112,154,0.25)",
    ring: "rgba(250,112,154,", particleColor: "rgba(250,112,154,",
  },
};

const ParticleOrb = () => {
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const orbStateRef = useRef<OrbState>("idle");
  const [particles] = useState<Particle[]>(generateParticles);
  const [ripple, setRipple] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [volume, setVolume] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const volumeRafRef = useRef<number>(0);
  const conversationRef = useRef<{ role: "user" | "assistant"; content: string }[]>([]);
  const demoTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const activeRef = useRef(false); // is the conversation active?

  useEffect(() => { orbStateRef.current = orbState; }, [orbState]);
  useEffect(() => () => { demoTimersRef.current.forEach(clearTimeout); stopEverything(); }, []);

  // ── Stop all audio/recording ──
  const stopEverything = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
    cancelAnimationFrame(volumeRafRef.current);
    setVolume(0);
  }, []);

  // ── TTS via ElevenLabs ──
  const speak = useCallback(async (text: string) => {
    setOrbState("speaking");

    const ttsUrl = "/api/tts";
    try {
      const res = await fetch(ttsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("TTS failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        audioRef.current = null;
        // Auto-listen again after speaking
        if (activeRef.current) startListening();
        else { setOrbState("idle"); setLiveTranscript(""); }
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        if (activeRef.current) startListening();
        else setOrbState("idle");
      };
      await audio.play();
    } catch {
      if (activeRef.current) startListening();
      else setOrbState("idle");
    }
  }, []);

  // ── Send transcript to Claude ──
  const processMessage = useCallback(async (userText: string) => {
    setOrbState("processing");
    setLiveTranscript(userText);
    conversationRef.current.push({ role: "user", content: userText });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationRef.current.slice(-10) }),
      });
      if (!res.ok) throw new Error("Chat failed");
      const data = await res.json();
      const reply = data.reply || "عذراً، حاول مرة أخرى.";
      conversationRef.current.push({ role: "assistant", content: reply });
      speak(reply);
    } catch {
      if (activeRef.current) startListening();
      else setOrbState("idle");
    }
  }, [speak]);

  // ── Start recording with silence detection ──
  const startListening = useCallback(async () => {
    audioChunksRef.current = [];
    setLiveTranscript("");

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      activeRef.current = false;
      setOrbState("idle");
      return;
    }

    streamRef.current = stream;
    setOrbState("listening");

    // Volume analyser for visual feedback + silence detection
    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    analyserRef.current = analyser;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const SILENCE_THRESHOLD = 8;     // أي صوت فوق هذا = كلام
    const SILENCE_DURATION = 1500;   // ms صمت بعد الكلام → وقف
    const MIN_RECORD = 1200;         // أقل مدة تسجيل قبل اكتشاف الصمت
    const MAX_DURATION = 15000;      // حد أقصى

    const recordStart = Date.now();
    let silenceStart = Date.now();

    const maxTimer = setTimeout(() => stopRecording(), MAX_DURATION);
    demoTimersRef.current.push(maxTimer);

    const checkVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setVolume(avg);

      if (avg > SILENCE_THRESHOLD) {
        silenceStart = Date.now(); // إعادة ضبط مؤقت الصمت عند الكلام
      } else if (
        Date.now() - recordStart > MIN_RECORD &&
        Date.now() - silenceStart > SILENCE_DURATION
      ) {
        stopRecording();
        return;
      }

      if (orbStateRef.current === "listening") {
        volumeRafRef.current = requestAnimationFrame(checkVolume);
      }
    };
    volumeRafRef.current = requestAnimationFrame(checkVolume);

    // MediaRecorder
    const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg";
    const recorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      clearTimeout(maxTimer);
      cancelAnimationFrame(volumeRafRef.current);
      stream.getTracks().forEach(t => t.stop());
      await ctx.close();
      setVolume(0);

      if (!activeRef.current) { setOrbState("idle"); setLiveTranscript(""); return; }

      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
      if (audioBlob.size < 500) {
        // Too short — listen again
        if (activeRef.current) startListening();
        return;
      }

      setOrbState("processing");
      try {
        const sttUrl = "/api/stt";
        const res = await fetch(sttUrl, {
          method: "POST",
          headers: { "Content-Type": mimeType },
          body: audioBlob,
        });
        const data = await res.json();
        const text = data.text?.trim();
        if (text) {
          processMessage(text);
        } else {
          if (activeRef.current) startListening();
          else setOrbState("idle");
        }
      } catch {
        if (activeRef.current) startListening();
        else setOrbState("idle");
      }
    };

    recorder.start();
  }, [processMessage]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // ── Orb click ──
  const handleOrbClick = useCallback(() => {
    setRipple(true);
    setTimeout(() => setRipple(false), 600);

    // Toggle off
    if (activeRef.current) {
      activeRef.current = false;
      stopEverything();
      setOrbState("idle");
      setLiveTranscript("");
      return;
    }

    // Start conversation
    activeRef.current = true;
    conversationRef.current = [];
    startListening();
  }, [startListening, stopEverything]);

  const config = stateConfig[orbState];

  // Visual volume scale for orb
  const orbScale = orbState === "listening"
    ? 1 + Math.min(volume / 255, 1) * 0.12
    : orbState === "speaking" ? 1.08 : 1;

  return (
    <div className="relative w-full flex flex-col items-center justify-center gap-4" style={{ minHeight: 360 }} dir="rtl">

      {/* Particles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180;
          const x = Math.cos(rad) * p.radius;
          const y = Math.sin(rad) * p.radius;
          return (
            <div key={p.id} className="absolute rounded-full" style={{
              width: p.size, height: p.size,
              background: `${config.particleColor}${p.opacity})`,
              boxShadow: `0 0 ${p.size * 2}px ${config.particleColor}${p.opacity * 0.5})`,
              left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
              animation: `particle-float ${p.speed}s ease-in-out ${p.delay}s infinite alternate`,
              transition: "background 0.5s, box-shadow 0.5s",
            }} />
          );
        })}
      </div>

      {/* Rings */}
      {[1, 2, 3].map((ring) => (
        <div key={ring} className="absolute rounded-full pointer-events-none" style={{
          width: 220 + ring * 38, height: 220 + ring * 38,
          border: `1px solid ${config.ring}${0.18 - ring * 0.04})`,
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          animation: `ringPulse ${2.5 + ring * 0.7}s ease-in-out ${ring * 0.4}s infinite alternate`,
          transition: "border-color 0.5s",
        }} />
      ))}

      {/* Ripple */}
      {ripple && (
        <div className="absolute rounded-full pointer-events-none" style={{
          width: 230, height: 230, top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          border: `2px solid ${config.ring}0.8)`,
          animation: "rippleOut 0.6s ease-out forwards",
        }} />
      )}

      {/* Orb */}
      <div
        className="relative z-10 rounded-full cursor-pointer"
        onClick={handleOrbClick}
        style={{
          width: 200, height: 200,
          background: config.gradient,
          boxShadow: config.glow,
          transform: `scale(${orbScale})`,
          transition: "background 0.5s, box-shadow 0.5s, transform 0.1s",
          willChange: "transform",
        }}
      >
        {/* Inner glare */}
        <div className="absolute rounded-full pointer-events-none" style={{
          width: "45%", height: "38%", top: "14%", left: "16%",
          background: "radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 80%)",
        }} />

        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {orbState === "idle" && (
            <svg className="w-12 h-12 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          )}
          {orbState === "listening" && (
            <div className="flex items-end gap-[3px] h-10">
              {[0.6, 1, 0.7, 1.2, 0.5, 1, 0.8].map((h, i) => (
                <div key={i} className="w-[4px] bg-white/80 rounded-full"
                  style={{
                    height: `${Math.max(6, Math.min(40, (volume / 255) * 40 * h + 6))}px`,
                    transition: "height 0.1s",
                  }}
                />
              ))}
            </div>
          )}
          {orbState === "processing" && (
            <svg className="w-10 h-10 text-white/80 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          )}
          {orbState === "speaking" && (
            <svg className="w-12 h-12 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25S18.75 7.5 18.75 12s-3 6.75-3 6.75M12 7.5S14.25 9 14.25 12 12 16.5 12 16.5M3.75 9.75h2.25L9.75 6v12l-3.75-3.75H3.75a1.5 1.5 0 01-1.5-1.5v-3a1.5 1.5 0 011.5-1.5z" />
            </svg>
          )}
        </div>
      </div>

      {/* Label */}
      <p className="relative z-10 text-sm text-foreground/60 tracking-wide transition-all duration-300">
        {config.label}
      </p>

      {/* Live transcript */}
      {liveTranscript && (
        <p className="relative z-10 text-sm text-foreground/80 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-border/40 max-w-xs text-center">
          "{liveTranscript}"
        </p>
      )}
    </div>
  );
};

export default ParticleOrb;
