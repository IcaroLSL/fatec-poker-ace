import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Player } from "@/types/poker";

interface Props {
  open: boolean;
  onClose: () => void;
  players: Player[];
  myName: string | null;
  onTransfer: (target: string, amount: number) => void;
}

export function TransferModal({ open, onClose, players, myName, onTransfer }: Props) {
  const [target, setTarget] = useState("");
  const [amount, setAmount] = useState(50);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9 }}
            className="bg-card border border-[var(--gold)]/30 rounded-2xl p-6 w-full max-w-sm space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gold">Transferir fichas</h3>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Selecione um jogador</option>
              {players
                .filter((p) => p.name !== myName)
                .map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
            </select>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/10 text-sm hover:bg-white/20"
              >
                Cancelar
              </button>
              <button
                disabled={!target || !amount}
                onClick={() => {
                  onTransfer(target, amount);
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-gradient-gold text-black font-semibold text-sm disabled:opacity-50"
              >
                Transferir
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
