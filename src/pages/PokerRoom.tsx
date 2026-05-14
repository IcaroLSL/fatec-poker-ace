import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { destroySocket, getSocket } from "@/websocket/PokerSocket";
import { usePokerStore } from "@/store/pokerStore";
import { PokerTable } from "@/components/PokerTable";
import { ChatPanel } from "@/components/ChatPanel";
import { ActionBar } from "@/components/ActionBar";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { DebugPanel } from "@/components/DebugPanel";
import { TransferModal } from "@/components/TransferModal";

function Lobby({ onEnter }: { onEnter: (room: string, name: string) => void }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("mesa-1");

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card/80 backdrop-blur border border-[var(--gold)]/20 rounded-3xl p-8 space-y-6 shadow-2xl"
      >
        <div className="text-center">
          <motion.div
            animate={{ textShadow: ["0 0 10px var(--gold)", "0 0 20px var(--gold)", "0 0 10px var(--gold)"] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl font-black tracking-wider text-gold"
          >
            POKER FATEC
          </motion.div>
          <p className="text-sm text-muted-foreground mt-2 uppercase tracking-[0.3em]">
            Texas Hold'em Online
          </p>
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-gold/80">Sala</span>
            <input
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full mt-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[var(--gold)]/50"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-gold/80">Seu nome</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Alice"
              className="w-full mt-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[var(--gold)]/50"
            />
          </label>
        </div>

        <button
          disabled={!name.trim() || !room.trim()}
          onClick={() => onEnter(room.trim(), name.trim())}
          className="w-full py-3 rounded-xl bg-gradient-gold text-black font-bold uppercase tracking-widest disabled:opacity-40 hover:brightness-110 glow-gold transition"
        >
          Entrar na mesa
        </button>

        <p className="text-[11px] text-center text-muted-foreground">
          Conexão: <span className="terminal-font text-gold">localhost:8080</span>
        </p>
      </motion.div>
    </div>
  );
}

export function PokerRoom() {
  const myName = usePokerStore((s) => s.myName);
  const roomId = usePokerStore((s) => s.roomId);
  const setRoom = usePokerStore((s) => s.setRoom);
  const players = usePokerStore((s) => s.players);
  const chat = usePokerStore((s) => s.chat);
  const turn = usePokerStore((s) => s.currentTurn);
  const gameStarted = usePokerStore((s) => s.gameStarted);
  const connection = usePokerStore((s) => s.connection);
  const reset = usePokerStore((s) => s.reset);

  const [chatOpen, setChatOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  useEffect(() => {
    if (!roomId || !myName) return;
    getSocket(roomId, myName);
    return () => {
      destroySocket();
      reset();
    };
  }, [roomId, myName, reset]);

  if (!roomId || !myName) {
    return (
      <Lobby
        onEnter={(r, n) => setRoom(r, n)}
      />
    );
  }

  const sock = getSocket();
  const isMyTurn = turn === myName;
  const actionsDisabled = !gameStarted || !isMyTurn || connection !== "connected";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/30 backdrop-blur z-20">
        <div className="flex items-center gap-3">
          <span className="text-lg font-black text-gold tracking-wider">POKER FATEC</span>
          <span className="text-xs text-muted-foreground">/ {roomId}</span>
        </div>
        <div className="flex items-center gap-2">
          <ConnectionStatus />
          {!gameStarted && (
            <button
              onClick={() => sock?.send({ type: "START", start: true })}
              className="px-3 py-1.5 rounded-lg bg-gradient-gold text-black text-xs font-bold uppercase tracking-wider hover:brightness-110"
            >
              Start
            </button>
          )}
          {gameStarted && (
            <button
              onClick={() => sock?.send({ type: "NEXT_ROUND" })}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-xs uppercase tracking-wider hover:bg-white/20"
            >
              Next
            </button>
          )}
          <button
            onClick={() => setTransferOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-white/10 text-xs uppercase tracking-wider hover:bg-white/20"
          >
            Transfer
          </button>
          <button
            onClick={() => setChatOpen((v) => !v)}
            className="md:hidden px-3 py-1.5 rounded-lg bg-white/10 text-xs uppercase"
          >
            Chat
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Table area */}
        <main className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0">
            <PokerTable />
          </div>
          <div className="p-4 flex justify-center">
            <ActionBar
              disabled={actionsDisabled}
              onCall={() => sock?.send({ type: "ACTION", action: "CALL" })}
              onFold={() => sock?.send({ type: "ACTION", action: "FOLD" })}
              onRaise={(amount) =>
                sock?.send({ type: "ACTION", action: "RAISE", amount })
              }
            />
          </div>
        </main>

        {/* Chat sidebar - desktop */}
        <aside className="hidden md:flex w-80 p-3 border-l border-white/5">
          <ChatPanel
            messages={chat}
            myName={myName}
            onSend={(message) => sock?.send({ type: "CHAT", message })}
          />
        </aside>
      </div>

      {/* Mobile chat drawer */}
      {chatOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/70 p-4" onClick={() => setChatOpen(false)}>
          <div className="h-full" onClick={(e) => e.stopPropagation()}>
            <ChatPanel
              messages={chat}
              myName={myName}
              onSend={(message) => sock?.send({ type: "CHAT", message })}
            />
          </div>
        </div>
      )}

      <TransferModal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        players={players}
        myName={myName}
        onTransfer={(target, amount) =>
          sock?.send({ type: "TRANSFER", target, amount })
        }
      />

      <DebugPanel />
    </div>
  );
}
