import { useState, useRef, useEffect, useCallback } from "react";

// ── Types ───────────────────────────────────────────
type Message = { role: "user" | "assistant"; content: string };
type DisplayMessage = { role: "user" | "bot"; text: string };

// ── Quick Replies ───────────────────────────────────
const quickReplies = [
  "ايش خدماتكم؟",
  "كم الأسعار؟",
  "كيف يشتغل الوكيل الصوتي؟",
  "أبغى أتواصل معكم",
];

// ── Fallback (offline / error) ──────────────────────
const FALLBACK =
  "عذراً، ما قدرت أتصل بالخادم حالياً.\n\n📱 تواصل مباشرة عبر واتساب: wa.me/966548508603";

// ── API Call ────────────────────────────────────────
async function callAgent(messages: Message[]): Promise<string> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.reply || FALLBACK;
  } catch {
    return FALLBACK;
  }
}

// ── Component ───────────────────────────────────────
const ChatAgent = () => {
  const [open, setOpen] = useState(false);
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([]);
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayMessages, typing]);

  // Greeting on first open
  useEffect(() => {
    if (open && !hasGreeted) {
      setHasGreeted(true);
      setTyping(true);
      setTimeout(() => {
        setDisplayMessages([
          {
            role: "bot",
            text: "أهلاً! 👋 أنا المساعد الذكي لـ ذكاء.\n\nأقدر أساعدك تعرف أكثر عن خدماتنا. اختر من الأسئلة السريعة أو اكتب سؤالك.",
          },
        ]);
        setTyping(false);
      }, 800);
    }
  }, [open, hasGreeted]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || typing) return;
      const trimmed = text.trim();

      // Add user message to display
      setDisplayMessages((prev) => [...prev, { role: "user", text: trimmed }]);
      setInput("");
      setTyping(true);

      // Build conversation history for Claude
      const newHistory: Message[] = [...history, { role: "user", content: trimmed }];
      setHistory(newHistory);

      // Call Claude
      const reply = await callAgent(newHistory);

      // Add bot response
      setHistory((prev) => [...prev, { role: "assistant", content: reply }]);
      setDisplayMessages((prev) => [...prev, { role: "bot", text: reply }]);
      setTyping(false);
    },
    [history, typing]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
          open ? "bg-foreground/20 backdrop-blur-sm" : "bg-clay shadow-clay/30"
        }`}
        aria-label="المساعد الذكي"
      >
        {open ? (
          <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-bone" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      <div
        dir="rtl"
        className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border/60 bg-midnight/95 backdrop-blur-xl shadow-2xl shadow-midnight/50 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none"
        }`}
        style={{ height: "480px" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40 bg-midnight">
          <div className="w-9 h-9 rounded-full bg-clay/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">مساعد ذكاء</p>
            <div className="flex items-center gap-1.5">
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                متصل الآن
              </p>
              <span className="text-xs text-muted-foreground">• مدعوم بـ Claude AI</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {displayMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-clay/15 text-foreground rounded-tr-sm"
                    : "bg-card border border-border/50 text-foreground/90 rounded-tl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-end">
              <div className="bg-card border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-clay/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-clay/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-clay/60 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {/* Quick replies — show only at start */}
          {displayMessages.length <= 1 && !typing && hasGreeted && (
            <div className="flex flex-wrap gap-2 justify-end mt-2">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-clay/10 border border-clay/20 text-clay rounded-full px-3 py-1.5 hover:bg-clay/20 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-border/40 px-4 py-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب سؤالك..."
            disabled={typing}
            className="flex-1 bg-card/50 border border-border/40 rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-clay/40 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="w-10 h-10 rounded-full bg-clay flex items-center justify-center hover:brightness-95 transition-all disabled:opacity-30"
          >
            <svg className="w-4 h-4 text-bone rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatAgent;
