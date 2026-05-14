import { motion } from "framer-motion";
import { CommunityCards } from "./CommunityCards";
import { PlayerSeat } from "./PlayerSeat";
import { PokerCard } from "./PokerCard";
import { usePokerStore } from "@/store/pokerStore";

export function PokerTable() {
  const players = usePokerStore((s) => s.players);
  const pot = usePokerStore((s) => s.pot);
  const round = usePokerStore((s) => s.round);
  const community = usePokerStore((s) => s.communityCards);
  const privateHand = usePokerStore((s) => s.privateHand);
  const myName = usePokerStore((s) => s.myName);
  const turn = usePokerStore((s) => s.currentTurn);

  const total = Math.max(players.length, 2);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6 py-10">
      <div className="relative w-full max-w-5xl aspect-[16/10]">
        {/* The felt table */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-8 rounded-[50%] felt-surface"
        />

        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <CommunityCards cards={community} pot={pot} round={round} />
        </div>

        {/* Seats */}
        {players.map((p, i) => (
          <PlayerSeat
            key={p.name}
            player={p}
            isMe={p.name === myName}
            isTurn={p.name === turn}
            seatIndex={i}
            totalSeats={total}
          />
        ))}

        {players.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-white/60">
              <div className="text-2xl font-bold text-gold mb-2">Aguardando jogadores</div>
              <div className="text-sm">Conecte-se à mesa para começar</div>
            </div>
          </div>
        )}
      </div>

      {/* My hand */}
      {privateHand.length > 0 && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-4 flex gap-3"
        >
          {privateHand.map((c, i) => (
            <PokerCard key={i} card={c} size="lg" delay={i * 0.2} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
