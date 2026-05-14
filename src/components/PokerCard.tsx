import { motion } from "framer-motion";
import type { Card, Suit } from "@/types/poker";
import { cn } from "@/lib/utils";

const SUIT_GLYPH: Record<Suit, string> = {
  espada: "♠",
  copa: "♥",
  ouro: "♦",
  paus: "♣",
};

const SUIT_RED: Record<Suit, boolean> = {
  espada: false,
  copa: true,
  ouro: true,
  paus: false,
};

interface PokerCardProps {
  card?: Card;
  faceDown?: boolean;
  size?: "sm" | "md" | "lg";
  highlight?: boolean;
  delay?: number;
}

const SIZE_CLASSES = {
  sm: "w-10 h-14 text-[10px]",
  md: "w-16 h-24 text-sm",
  lg: "w-20 h-28 text-base",
};

const SUIT_SIZE = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-5xl",
};

export function PokerCard({
  card,
  faceDown,
  size = "md",
  highlight,
  delay = 0,
}: PokerCardProps) {
  if (faceDown || !card) {
    return (
      <motion.div
        initial={{ rotateY: 180, opacity: 0, y: -20 }}
        animate={{ rotateY: 0, opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className={cn(
          "rounded-lg card-shadow relative overflow-hidden",
          SIZE_CLASSES[size],
        )}
        style={{
          background:
            "repeating-linear-gradient(45deg, oklch(0.3 0.1 260), oklch(0.3 0.1 260) 4px, oklch(0.22 0.08 260) 4px, oklch(0.22 0.08 260) 8px)",
          border: "2px solid oklch(0.78 0.16 80 / 60%)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-3/5 h-4/5 rounded"
            style={{
              background:
                "radial-gradient(circle, oklch(0.78 0.16 80 / 30%), transparent 70%)",
              border: "1px solid oklch(0.78 0.16 80 / 50%)",
            }}
          />
        </div>
      </motion.div>
    );
  }

  const isRed = SUIT_RED[card.suit];
  const colorClass = isRed ? "text-[var(--card-red)]" : "text-[var(--card-black)]";

  return (
    <motion.div
      initial={{ rotateY: 180, opacity: 0, scale: 0.5 }}
      animate={{ rotateY: 0, opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 200 }}
      whileHover={{ y: -8, scale: 1.05 }}
      className={cn(
        "rounded-lg bg-white card-shadow relative select-none",
        SIZE_CLASSES[size],
        highlight && "glow-gold",
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className={cn("absolute top-1 left-1.5 leading-none font-bold", colorClass)}>
        <div>{card.value}</div>
        <div className="-mt-0.5">{SUIT_GLYPH[card.suit]}</div>
      </div>
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center font-bold",
          colorClass,
          SUIT_SIZE[size],
        )}
      >
        {SUIT_GLYPH[card.suit]}
      </div>
      <div
        className={cn(
          "absolute bottom-1 right-1.5 leading-none font-bold rotate-180",
          colorClass,
        )}
      >
        <div>{card.value}</div>
        <div className="-mt-0.5">{SUIT_GLYPH[card.suit]}</div>
      </div>
    </motion.div>
  );
}
