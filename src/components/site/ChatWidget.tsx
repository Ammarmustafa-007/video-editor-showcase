import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CalendarDays, History, Mail, MessageCircle, Plus, Send, UserRound, X } from "lucide-react";
import site from "@/content/site.json";
import avatar from "@/assets/portrait-circle.jpg";

/**
 * "Ask about my work": Abdullah's assistant answers from what's on the site. "Talk to Abdullah" hands the chat to him;
 * his replies arrive in the same chat (it checks every few seconds). Earlier chats stay in History, and a new chat
 * can be started any time. If Nova can't be reached, the chat shows email, WhatsApp and Book a call instead.
 */

type Msg = { id: number; who: "visitor" | "ai" | "owner" | "system"; text: string; at?: string };
type Mode = "ai" | "waiting" | "human";
type ChatRow = { token: string; title: string; updated: string; mode: Mode };

const STARTERS = ["What kind of videos do you edit?", "How much does a project cost?", "Can you edit my wedding film?"];
const FIRST = site.hero.first;
const API = site.chat.endpoint.replace(/\/chat$/, "");
const HEAD = { "Content-Type": "application/json", "X-Requested-With": "novaclips" };
const GREETING: Msg = { id: 0, who: "ai", text: `Hi, I'm ${FIRST}'s assistant. Tell me what you're working on, or ask anything about his editing.` };

const store = {
  get: (k: string) => { try { return localStorage.getItem(k) || ""; } catch { return ""; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};
function visitorId() {
  let v = store.get("abq-chat-id");
  if (!v || v.length < 8) { v = Math.random().toString(36).slice(2) + Date.now().toString(36); store.set("abq-chat-id", v); }
  return v;
}
async function call(path: string, body?: object) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 30000);
  try {
    const r = await fetch(API + path, body ? { method: "POST", headers: HEAD, body: JSON.stringify(body), signal: ctl.signal } : { signal: ctl.signal });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.detail || String(r.status));
    return j;
  } finally { clearTimeout(t); }
}
const ago = (iso: string) => {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  return m < 1 ? "now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`;
};

export function ChatWidget() {
  const { email, whatsapp } = site.chat;
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"chat" | "list">("chat");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [token, setToken] = useState("");
  const [mode, setMode] = useState<Mode>("ai");
  const [online, setOnline] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);
  const [chats, setChats] = useState<ChatRow[]>([]);
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef("");
  const lastId = useRef(0);

  const merge = useCallback((list: Msg[]) => {
    if (!list?.length) return;
    setMsgs((m) => {
      const seen = new Set(m.map((x) => x.id));
      const add = list.filter((x) => !seen.has(x.id));
      return add.length ? [...m, ...add] : m;
    });
    lastId.current = Math.max(lastId.current, ...list.map((x) => x.id));
  }, []);

  const loadChat = useCallback(async (tok: string) => {
    setMsgs([]); lastId.current = 0; setToken(tok); store.set("abq-chat-token", tok); setView("chat");
    if (!tok) { setMode("ai"); return; }
    try {
      const r = await call(`/poll?visitor=${vid.current}&token=${encodeURIComponent(tok)}&after=0`);
      setMode(r.mode); setOnline(r.online); merge(r.messages); setOffline(false);
    } catch { setToken(""); store.set("abq-chat-token", ""); }
  }, [merge]);

  useEffect(() => { vid.current = visitorId(); }, []);
  useEffect(() => { if (open && !msgs.length && store.get("abq-chat-token")) loadChat(store.get("abq-chat-token")); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight, behavior: "smooth" }); }, [msgs, busy, offline, view]);

  // while Abdullah is (or may be) in the chat, check for his replies
  useEffect(() => {
    if (!open || !token || mode === "ai") return;
    const t = setInterval(async () => {
      try {
        const r = await call(`/poll?visitor=${vid.current}&token=${encodeURIComponent(token)}&after=${lastId.current}`);
        setMode(r.mode); setOnline(r.online); merge(r.messages);
      } catch { /* try again next tick */ }
    }, 4000);
    return () => clearInterval(t);
  }, [open, token, mode, merge]);

  const send = async (q: string) => {
    q = q.trim();
    if (!q || busy) return;
    setText("");
    const temp: Msg = { id: -Date.now(), who: "visitor", text: q };
    setMsgs((m) => [...m, temp]);
    setBusy(mode === "ai");
    try {
      const r = await call("/chat", { visitor: vid.current, token, text: q });
      setMsgs((m) => m.filter((x) => x.id !== temp.id));
      merge(r.messages);
      setToken(r.token); store.set("abq-chat-token", r.token); setMode(r.mode); setOnline(r.online);
      setOffline(!!r.ai_down && r.mode === "ai");
    } catch {
      setOffline(true);
    } finally {
      setBusy(false);
    }
  };

  const human = async () => {
    try {
      const r = await call("/human", { visitor: vid.current, token });
      merge(r.messages); setMode(r.mode); setOnline(r.online);
    } catch { setOffline(true); }
  };

  const openList = async () => {
    setView("list");
    try { setChats((await call(`/chats?visitor=${vid.current}`)).chats || []); } catch { setChats([]); }
  };

  const shown = msgs.length ? msgs : [GREETING];
  const status = mode === "human" ? `${FIRST} is in this chat` : mode === "waiting" ? (online ? `${FIRST} will reply here` : `Waiting for ${FIRST}`) : offline ? "Away right now" : "Replies in seconds";

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        aria-label={open ? "Close chat" : "Ask about my work"}
        className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-brand-yellow py-3 pl-4 pr-5 text-sm font-medium text-primary-foreground shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)] transition-transform active:scale-[0.97]"
      >
        {open ? <X size={18} strokeWidth={1.5} /> : <MessageCircle size={18} strokeWidth={1.5} />}
        <span className="hidden sm:inline">{open ? "Close" : "Ask about my work"}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-20 left-3 right-3 z-[60] flex h-[min(600px,76vh)] flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[#130e24] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.75)] sm:left-auto sm:right-5 sm:w-[390px]"
            role="dialog"
            aria-label={`Chat about ${FIRST}'s work`}
          >
            {/* header */}
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3">
              {view === "list" ? (
                <button onClick={() => setView("chat")} aria-label="Back to the chat" className="grid h-9 w-9 place-items-center rounded-[10px] text-white/70 transition-colors hover:bg-white/[0.06]"><ArrowLeft size={18} strokeWidth={1.5} /></button>
              ) : (
                <span className="relative">
                  <img src={avatar} alt="" className="h-9 w-9 rounded-full object-cover ring-1 ring-[#c9a6ff]/60" />
                  <i className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-[#130e24] ${offline ? "bg-white/40" : mode === "human" || online ? "bg-[#4cc38a]" : "bg-[#c9a6ff]"}`} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{view === "list" ? "Your chats" : mode === "human" ? `${FIRST} ${site.hero.last}` : `${FIRST}'s assistant`}</p>
                {view === "chat" && <p className="truncate text-xs text-white/50">{status}</p>}
              </div>
              {view === "chat" && (
                <>
                  <button onClick={openList} aria-label="Earlier chats" title="Earlier chats" className="grid h-9 w-9 place-items-center rounded-[10px] text-white/70 transition-colors hover:bg-white/[0.06]"><History size={17} strokeWidth={1.5} /></button>
                  <button onClick={() => loadChat("")} aria-label="New chat" title="New chat" className="grid h-9 w-9 place-items-center rounded-[10px] text-white/70 transition-colors hover:bg-white/[0.06]"><Plus size={18} strokeWidth={1.5} /></button>
                </>
              )}
            </div>

            {view === "list" ? (
              <div className="flex-1 overflow-y-auto p-3">
                <button onClick={() => loadChat("")} className="mb-2 flex w-full items-center gap-2 rounded-[12px] border border-dashed border-white/15 px-3 py-3 text-sm text-white/80 transition-colors hover:border-[#c9a6ff]/60"><Plus size={16} strokeWidth={1.5} /> New chat</button>
                {chats.length === 0 && <p className="px-2 py-6 text-center text-sm text-white/50">Your earlier chats show up here.</p>}
                {chats.map((c) => (
                  <button key={c.token} onClick={() => loadChat(c.token)} className={`flex w-full items-center gap-3 rounded-[12px] px-3 py-3 text-left transition-colors hover:bg-white/[0.05] ${c.token === token ? "bg-white/[0.05]" : ""}`}>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white/60">{c.mode === "ai" ? <MessageCircle size={15} strokeWidth={1.5} /> : <UserRound size={15} strokeWidth={1.5} />}</span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm text-foreground">{c.title || "Chat"}</span><span className="block text-xs text-white/45">{ago(c.updated)}{c.mode !== "ai" ? ` · with ${FIRST}` : ""}</span></span>
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div ref={box} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  {shown.map((m) =>
                    m.who === "system" ? (
                      <p key={m.id} className="mx-auto max-w-[90%] text-center text-xs leading-relaxed text-white/50">{m.text}</p>
                    ) : (
                      <div key={m.id} className={`flex ${m.who === "visitor" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] whitespace-pre-wrap rounded-[16px] px-3.5 py-2.5 text-sm leading-relaxed ${m.who === "visitor" ? "rounded-br-[6px] bg-brand-yellow text-primary-foreground" : m.who === "owner" ? "rounded-bl-[6px] border border-[#4cc38a]/40 bg-[#4cc38a]/10 text-foreground" : "rounded-bl-[6px] bg-white/[0.06] text-foreground"}`}>
                          {m.who === "owner" && <span className="mb-0.5 block text-[11px] font-medium text-[#4cc38a]">{FIRST}</span>}
                          {m.text}
                        </div>
                      </div>
                    ),
                  )}
                  {busy && (
                    <div className="flex gap-1 px-2 py-2" aria-label="Typing">
                      {[0, 1, 2].map((d) => (
                        <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-brand-yellow" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }} />
                      ))}
                    </div>
                  )}
                  {offline && (
                    <div className="rounded-[14px] border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-sm text-foreground">The assistant can't answer right now. Reach {FIRST} directly:</p>
                      <div className="mt-3 flex flex-col gap-2">
                        <a href={site.links.call} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-[10px] bg-white/[0.06] px-3 py-2 text-sm text-foreground hover:bg-white/10"><CalendarDays size={15} className="text-brand-yellow" /> Book a 30-minute call</a>
                        <a href={`mailto:${email}?subject=${encodeURIComponent("Project enquiry")}`} className="inline-flex items-center gap-2 rounded-[10px] bg-white/[0.06] px-3 py-2 text-sm text-foreground hover:bg-white/10"><Mail size={15} className="text-brand-yellow" /> {email}</a>
                        <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-[10px] bg-white/[0.06] px-3 py-2 text-sm text-foreground hover:bg-white/10"><MessageCircle size={15} className="text-brand-yellow" /> WhatsApp</a>
                      </div>
                    </div>
                  )}
                  {msgs.length === 0 && !busy && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {STARTERS.map((s) => (
                        <button key={s} onClick={() => send(s)} className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-foreground/90 transition-colors hover:border-[#c9a6ff]/60">{s}</button>
                      ))}
                    </div>
                  )}
                </div>

                {mode === "ai" && msgs.length > 0 && (
                  <button onClick={human} className="mx-3 mb-2 inline-flex items-center justify-center gap-2 rounded-[10px] border border-white/10 py-2 text-xs text-white/75 transition-colors hover:bg-white/[0.05]">
                    <UserRound size={14} strokeWidth={1.5} /> Talk to {FIRST}
                  </button>
                )}
                <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="flex items-center gap-2 border-t border-white/[0.08] p-3">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={mode === "ai" ? "Ask about editing, timelines, your project" : `Message ${FIRST}`}
                    maxLength={800}
                    aria-label="Message"
                    className="h-11 flex-1 rounded-[10px] border border-white/10 bg-white/[0.04] px-3.5 text-sm text-foreground placeholder:text-white/40 focus:border-[#c9a6ff]/60 focus:outline-none"
                  />
                  <button type="submit" disabled={busy || !text.trim()} aria-label="Send" className="grid h-11 w-11 place-items-center rounded-[10px] bg-brand-yellow text-primary-foreground disabled:opacity-40">
                    <Send size={16} strokeWidth={1.5} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
