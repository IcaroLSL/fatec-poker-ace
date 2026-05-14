import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PokerCard } from "./PokerCard";
import type { Player } from "@/types/poker";

interface Props {
  player: Player;
  isMe?: boolean;
  isTurn?: boolean;
  seatIndex: number;
  totalSeats: number;
}

const POS_BADGE: Record<string, string> = {
  BTN: "bg-gradient-gold text-black",
  SB: "bg-blue-500/80 text-white",
  BB: "bg-red-500/80 text-white",
};

export function PlayerSeat({ player, isMe, isTurn, seatIndex, totalSeats }: Props) {
  // Position around an oval
  const angle = (seatIndex / totalSeats) * Math.PI * 2 + Math.PI / 2;
  const x = 50 + Math.cos(angle) * 42;
  const y = 50 + Math.sin(angle) * 38;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {/* Mini face-down cards for others */}
      {!isMe && (player.cardCount ?? 2) > 0 && (
        <div className="flex -space-x-3 mb-1">
          {Array.from({ length: player.cardCount ?? 2 }).map((_, i) => (
            <div key={i} className="rotate-[-6deg]" style={{ transform: `rotate(${i * 8 - 4}deg)` }}>
              <PokerCard faceDown size="sm" />
            </div>
          ))}
        </div>
      )}

      <div
        className={cn(
          "relative flex flex-col items-center gap-1 rounded-2xl px-3 py-2 min-w-[120px]",
          "bg-gradient-to-b from-[oklch(0.22_0.03_260)] to-[oklch(0.14_0.02_260)]",
          "border-2 transition-all",
          isTurn
            ? "border-[var(--gold)] animate-pulse-glow"
            : isMe
              ? "border-[var(--gold)]/50"
              : "border-white/10",
          player.folded && "opacity-40 grayscale",
        )}
      >
        <div className="flex items-center gap-2 w-full">
          <div
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
              "bg-gradient-to-br from-[oklch(0.4_0.1_260)] to-[oklch(0.2_0.05_260)]",
              "border border-white/20",
            )}
          >
            {player.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col leading-tight min-w-0 flex-1">
            <span className="text-xs font-semibold truncate text-white">
              {player.name} {isMe && <span className="text-gold">★</span>}
            </span>
            <span className="text-[10px] text-gold font-mono">
              {(player.chips ?? 1000).toLocaleString()}
            </span>
          </div>
        </div>

        {player.position && (
          <div
            className={cn(
              "absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold border border-black/40 shadow-lg",
              POS_BADGE[player.position] ?? "bg-white/20 text-white",
            )}
          >
            {player.position}
          </div>
        )}

        {typeof player.bet === "number" && player.bet > 0 && (
          <div className="absolute -bottom-3 px-2 py-0.5 rounded-full bg-black/70 border border-[var(--gold)]/50 text-[10px] text-gold font-mono">
            {player.bet}
          </div>
        )}
      </div>
    </motion.div>
  );
}
