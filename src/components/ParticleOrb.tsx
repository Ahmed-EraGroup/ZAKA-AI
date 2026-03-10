import { useMemo, useRef, useState } from "react";

type OrbState = "idle" | "listening" | "speaking";

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

const ParticleOrb = () => {
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const orbStateRef = useRef<OrbState>(orbState);
  const [statusText, setStatusText] = useState("اضغط للتحدث");

  const orbClasses = useMemo(() => {
    if (orbState === "listening") return "listening";
    if (orbState === "speaking") return "speaking";
    return "";
  }, [orbState]);

  const respond = (userText: string) => {
    let reply = "لم أفهم طلبك، هل يمكنك تكراره؟";

    if (userText.includes("مرحبا") || userText.includes("أهلا")) {
      reply = "أهلا بك، كيف يمكنني مساعدتك؟";
    } else if (userText.includes("وقت") || userText.includes("الساعة")) {
      const now = new Date().toLocaleTimeString("ar-SA");
      reply = `الساعة الآن ${now}`;
    } else if (userText.includes("اسمك")) {
      reply = "أنا مساعدك الصوتي التجريبي.";
    }

    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.lang = "ar-SA";
    utterance.onend = () => {
      orbStateRef.current = "idle";
      setOrbState("idle");
      setStatusText("اضغط للتحدث");
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startRecognition = () => {
    const browserWindow = window as ExtendedWindow;
    const SpeechRecognition =
      browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setOrbState("idle");
      setStatusText("متصفحك لا يدعم خاصية التعرف على الصوت.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ar-SA";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      orbStateRef.current = "listening";
      setOrbState("listening");
      setStatusText("جارٍ الاستماع...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      orbStateRef.current = "speaking";
      setOrbState("speaking");
      setStatusText("جارٍ المعالجة...");
      respond(transcript);
    };

    recognition.onerror = () => {
      orbStateRef.current = "idle";
      setOrbState("idle");
      setStatusText("حدث خطأ، حاول مرة أخرى.");
    };

    recognition.onend = () => {
      if (orbStateRef.current !== "speaking") {
        setOrbState("idle");
        orbStateRef.current = "idle";
        setStatusText("اضغط للتحدث");
      }
    };

    try {
      recognition.start();
    } catch {
      setStatusText("التعرف الصوتي يعمل بالفعل.");
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center" dir="rtl">
      <style>{`
        .voice-orb {
          width: 150px;
          height: 150px;
          background: radial-gradient(circle at 30% 30%, #4facfe, #00f2fe);
          border-radius: 9999px;
          box-shadow: 0 0 20px rgba(79, 172, 254, 0.4);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          border: 0;
        }
        .voice-orb:hover {
          transform: scale(1.05);
        }
        .voice-orb.listening {
          animation: voice-pulse 1.5s infinite;
          background: radial-gradient(circle at 30% 30%, #43e97b, #38f9d7);
          box-shadow: 0 0 40px rgba(67, 233, 123, 0.6);
        }
        .voice-orb.speaking {
          background: radial-gradient(circle at 30% 30%, #fa709a, #fee140);
          box-shadow: 0 0 50px rgba(250, 112, 154, 0.8);
          transform: scale(1.1);
        }
        @keyframes voice-pulse {
          0% { transform: scale(1); box-shadow: 0 0 20px rgba(67, 233, 123, 0.4); }
          50% { transform: scale(1.1); box-shadow: 0 0 40px rgba(67, 233, 123, 0.8); }
          100% { transform: scale(1); box-shadow: 0 0 20px rgba(67, 233, 123, 0.4); }
        }
      `}</style>

      <button
        type="button"
        aria-label="voice-orb"
        className={`voice-orb ${orbClasses}`}
        onClick={startRecognition}
      />

      <p className="mt-8 text-xl text-gray-300">{statusText}</p>
    </div>
  );
};

export default ParticleOrb;
