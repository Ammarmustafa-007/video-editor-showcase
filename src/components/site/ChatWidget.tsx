import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MessageCircle, Send, X } from "lucide-react";
import site from "@/content/site.json";

/**
 * "Ask me about my work": a small chat that answers questions about Abdullah's editing (style, services, turnaround,
 * how to start a project). Answers come from his own assistant through the Nova Clips portal. When that can't be
 * reached, the chat says so and offers email and WhatsApp instead, so nobody leaves empty-handed.
 */

type Msg = { role: "me" | "him"; text: string };
const STARTERS = ["What kind of videos do you edit?", "How fast can you deliver?", "How do we start a project?"];

function visitorId() {
  try {
    let v = localStorage.getItem("abq-chat-id");
    if (!v) {
      v = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("abq-chat-id", v);
    }
    return v;
  } catch {
    return "anon-" + Math.random().toString(36).slice(2);
  }
}

export function ChatWidget() {
  const { endpoint, email, whatsapp } = site.chat;
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "him", text: "Hi! I'm Abdullah's assistant. Ask me anything about his editing, a project you have in mind, or how to work together." }]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const id = useRef<string>("");

  useEffect(() => { id.current = visitorId(); }, []);
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight, behavior: "smooth" }); }, [msgs, busy, offline]);

  const send = async (q: string) => {
    q = q.trim();
    if (!q || busy) return;
    setText("");
    const next: Msg[] = [...msgs, { role: "me", text: q }];
    setMsgs(next);
    setBusy(true);
    try {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), 30000);
      const r = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitor: id.current, messages: next.slice(-10).map((m) => ({ role: m.role === "me" ? "user" : "assistant", text: m.text })) }),
        signal: ctl.signal,
      });
      clearTimeout(t);
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json();
      setMsgs((m) => [...m, { role: "him", text: String(j.reply || "").trim() || "Sorry, I didn't catch that. Could you ask again?" }]);
      setOffline(false);
    } catch {
      setOffline(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3.2, type: "spring", stiffness: 200, damping: 18 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? "Close chat" : "Ask about my work"}
        className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-brand-yellow pl-4 pr-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
        <span className="hidden sm:inline">{open ? "Close" : "Ask about my work"}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed bottom-20 right-4 left-4 sm:left-auto z-[60] flex h-[min(560px,72vh)] sm:w-[380px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#130b29]/95 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(120,70,220,0.55)]"
            role="dialog"
            aria-label="Chat about Abdullah's work"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`absolute inline-flex h-full w-full rounded-full ${offline ? "bg-white/30" : "bg-emerald-400/60 animate-ping"}`} />
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${offline ? "bg-white/40" : "bg-emerald-400"}`} />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-foreground">Abdullah's assistant</p>
                <p className="text-xs text-muted-foreground">{offline ? "Away right now" : "Usually answers in seconds"}</p>
              </div>
            </div>

            <div ref={box} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {msgs.map((m, k) => (
                <div key={k} className={`flex ${m.role === "me" ? "justify-end" : "justify-start"}`}>
                  <p className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === "me" ? "rounded-br-md bg-brand-yellow text-primary-foreground" : "rounded-bl-md bg-white/[0.06] text-foreground"}`}>
                    {m.text}
                  </p>
                </div>
              ))}
              {busy && (
                <div className="flex gap-1 px-2 py-2" aria-label="Typing">
                  {[0, 1, 2].map((d) => (
                    <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-brand-yellow" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }} />
                  ))}
                </div>
              )}
              {offline && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm text-foreground">The assistant can't answer right now. Reach Abdullah directly:</p>
                  <div className="mt-3 flex flex-col gap-2">
                    <a href={`mailto:${email}?subject=${encodeURIComponent("Project enquiry")}`} className="inline-flex items-center gap-2 rounded-xl bg-white/[0.06] px-3 py-2 text-sm text-foreground hover:bg-white/10">
                      <Mail size={15} className="text-brand-yellow" /> {email}
                    </a>
                    <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white/[0.06] px-3 py-2 text-sm text-foreground hover:bg-white/10">
                      <MessageCircle size={15} className="text-brand-yellow" /> WhatsApp
                    </a>
                  </div>
                </div>
              )}
              {msgs.length === 1 && !busy && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {STARTERS.map((s) => (
                    <button key={s} onClick={() => send(s)} className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-foreground/90 hover:border-brand-yellow/60">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(text); }}
              className="flex items-center gap-2 border-t border-white/10 p-3"
            >
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ask about editing, prices, timelines…"
                maxLength={600}
                className="h-11 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-yellow/60 focus:outline-none"
              />
              <button type="submit" disabled={busy || !text.trim()} aria-label="Send" className="grid h-11 w-11 place-items-center rounded-xl bg-brand-yellow text-primary-foreground disabled:opacity-40">
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
