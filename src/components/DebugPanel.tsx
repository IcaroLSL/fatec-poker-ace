import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePokerStore } from "@/store/pokerStore";

export function DebugPanel() {
  const events = usePokerStore((s) => s.debugEvents);
  const clear = usePokerStore((s) => s.clearDebug);
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[380px] max-w-[90vw]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full px-3 py-2 rounded-t-lg bg-black/80 border border-white/10 text-xs terminal-font text-green-400 flex items-center justify-between"
      >
        <span>$ debug.log [{events.length}]</span>
        <span className="text-muted-foreground">{open ? "▼" : "▲"}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 320 }}
            exit={{ height: 0 }}
            className="overflow-hidden bg-black/90 border-x border-b border-white/10 rounded-b-lg"
          >
            <div className="flex items-center justify-end p-1 border-b border-white/10">
              <button
                onClick={clear}
                className="text-[10px] terminal-font text-red-400 hover:text-red-300 px-2"
              >
                clear
              </button>
            </div>
            <div className="overflow-y-auto h-[280px] p-2 terminal-font text-[10px] space-y-1">
              {events.length === 0 && (
                <div className="text-muted-foreground">// aguardando eventos...</div>
              )}
              {events.map((e) => (
                <div key={e.id} className="flex gap-2">
                  <span
                    className={cn(
                      "shrink-0",
                      e.direction === "in" ? "text-green-400" : "text-blue-400",
                    )}
                  >
                    {e.direction === "in" ? "←" : "→"}
                  </span>
                  <span className="text-gold shrink-0">{e.type}</span>
                  <span className="text-white/60 truncate">
                    {JSON.stringify(e.payload)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
