import { AnimatePresence, motion } from "framer-motion";
import { PokerCard } from "./PokerCard";
import type { Card } from "@/types/poker";

interface Props {
  cards: Card[];
  pot: number;
  round: string;
}

export function CommunityCards({ cards, pot, round }: Props) {
  const slots = Array.from({ length: 5 }, (_, i) => cards[i]);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-black/40 border border-[var(--gold)]/30">
        <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
          {round}
        </span>
      </div>
      <div className="flex gap-2">
        <AnimatePresence>
          {slots.map((c, i) => (
            <div key={i} className="w-16 h-24">
              {c ? (
                <PokerCard card={c} delay={i * 0.15} highlight={round === "TURN" && i === 3 || round === "RIVER" && i === 4} />
              ) : (
                <div className="w-16 h-24 rounded-lg border-2 border-dashed border-white/10" />
              )}
            </div>
          ))}
        </AnimatePresence>
      </div>
      <motion.div
        key={pot}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-3 px-6 py-2 rounded-full bg-black/50 border border-[var(--gold)]/40 glow-gold"
      >
        <div className="flex -space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border-2 border-white/30"
              style={{
                background: `radial-gradient(circle, var(--chip-${["red", "blue", "green"][i]}) 60%, oklch(0 0 0) 100%)`,
              }}
            />
          ))}
        </div>
        <span className="text-gold font-bold tracking-wider">
          POT {pot.toLocaleString()}
        </span>
      </motion.div>
    </div>
  );
}
