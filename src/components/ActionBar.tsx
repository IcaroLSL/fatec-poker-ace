import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  disabled?: boolean;
  onCall: () => void;
  onFold: () => void;
  onRaise: (amount: number) => void;
}

export function ActionBar({ disabled, onCall, onFold, onRaise }: Props) {
  const [raise, setRaise] = useState(50);

  const btn =
    "px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all border-2 shadow-lg";

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "flex flex-wrap items-center gap-3 p-4 rounded-2xl",
        "bg-black/60 backdrop-blur border border-[var(--gold)]/20",
        disabled && "opacity-50 pointer-events-none",
      )}
    >
      <button
        onClick={onFold}
        disabled={disabled}
        className={cn(
          btn,
          "bg-gradient-to-b from-[oklch(0.45_0.2_25)] to-[oklch(0.3_0.18_25)]",
          "border-red-900 text-white hover:scale-105 hover:brightness-110",
        )}
      >
        Fold
      </button>
      <button
        onClick={onCall}
        disabled={disabled}
        className={cn(
          btn,
          "bg-gradient-to-b from-[oklch(0.5_0.16_250)] to-[oklch(0.32_0.14_250)]",
          "border-blue-900 text-white hover:scale-105 hover:brightness-110",
        )}
      >
        Call
      </button>

      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 border border-white/10">
        <input
          type="range"
          min={10}
          max={1000}
          step={10}
          value={raise}
          onChange={(e) => setRaise(Number(e.target.value))}
          className="accent-[var(--gold)]"
        />
        <span className="text-gold font-mono w-14 text-right">{raise}</span>
      </div>

      <button
        onClick={() => onRaise(raise)}
        disabled={disabled}
        className={cn(
          btn,
          "bg-gradient-gold text-black border-yellow-700 hover:scale-105 hover:brightness-110 glow-gold",
        )}
      >
        Raise
      </button>
    </motion.div>
  );
}
