import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/poker";

interface Props {
  messages: ChatMessage[];
  myName: string | null;
  onSend: (msg: string) => void;
}

export function ChatPanel({ messages, myName, onSend }: Props) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
  };

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-bold text-sm uppercase tracking-widest text-gold">Chat</h3>
        <span className="text-xs text-muted-foreground">{messages.length}</span>
      </div>

      <div ref={ref} className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const mine = m.from === myName;
            const sys = m.system || m.from === "system";
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex flex-col text-xs",
                  mine && "items-end",
                  sys && "items-center",
                )}
              >
                {sys ? (
                  <div className="px-3 py-1 rounded-full bg-white/5 text-[10px] text-muted-foreground italic">
                    {m.message}
                  </div>
                ) : (
                  <div
                    className={cn(
                      "max-w-[80%] px-3 py-1.5 rounded-2xl",
                      mine
                        ? "bg-gradient-to-br from-[oklch(0.5_0.16_250)] to-[oklch(0.35_0.14_250)] text-white rounded-br-sm"
                        : "bg-white/10 text-white rounded-bl-sm",
                    )}
                  >
                    {!mine && (
                      <div className="text-[10px] text-gold font-semibold mb-0.5">
                        {m.from}
                      </div>
                    )}
                    <div className="break-words">{m.message}</div>
                  </div>
                )}
                <span className="text-[9px] text-muted-foreground mt-0.5 px-1">
                  {new Date(m.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <form onSubmit={submit} className="p-2 border-t border-white/10 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Mensagem..."
          className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--gold)]/50"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-gradient-gold text-black font-semibold text-sm hover:brightness-110"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
