import { create } from "zustand";
import type {
  Card,
  ChatMessage,
  ConnectionState,
  DebugEvent,
  Player,
} from "@/types/poker";

interface PokerState {
  roomId: string | null;
  myName: string | null;
  connection: ConnectionState;
  players: Player[];
  pot: number;
  round: string;
  communityCards: Card[];
  privateHand: Card[];
  chat: ChatMessage[];
  currentTurn: string | null;
  gameStarted: boolean;
  debugEvents: DebugEvent[];
  lastError: string | null;

  setRoom: (roomId: string, name: string) => void;
  setConnection: (s: ConnectionState) => void;
  setPlayers: (p: Player[]) => void;
  upsertPlayer: (p: Player) => void;
  removePlayers: (names: string[]) => void;
  setPot: (n: number) => void;
  setRound: (r: string) => void;
  setCommunityCards: (c: Card[]) => void;
  setPrivateHand: (c: Card[]) => void;
  addChat: (m: ChatMessage) => void;
  setChatHistory: (msgs: ChatMessage[]) => void;
  setTurn: (name: string | null) => void;
  setGameStarted: (b: boolean) => void;
  pushDebug: (e: DebugEvent) => void;
  clearDebug: () => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

export const usePokerStore = create<PokerState>((set) => ({
  roomId: null,
  myName: null,
  connection: "idle",
  players: [],
  pot: 0,
  round: "—",
  communityCards: [],
  privateHand: [],
  chat: [],
  currentTurn: null,
  gameStarted: false,
  debugEvents: [],
  lastError: null,

  setRoom: (roomId, name) => set({ roomId, myName: name }),
  setConnection: (connection) => set({ connection }),
  setPlayers: (players) => set({ players }),
  upsertPlayer: (p) =>
    set((s) => {
      const i = s.players.findIndex((x) => x.name === p.name);
      if (i === -1) return { players: [...s.players, p] };
      const copy = [...s.players];
      copy[i] = { ...copy[i], ...p };
      return { players: copy };
    }),
  removePlayers: (names) =>
    set((s) => ({ players: s.players.filter((p) => !names.includes(p.name)) })),
  setPot: (pot) => set({ pot }),
  setRound: (round) => set({ round }),
  setCommunityCards: (communityCards) => set({ communityCards }),
  setPrivateHand: (privateHand) => set({ privateHand }),
  addChat: (m) => set((s) => ({ chat: [...s.chat, m] })),
  setChatHistory: (msgs) => set({ chat: msgs }),
  setTurn: (currentTurn) => set({ currentTurn }),
  setGameStarted: (gameStarted) => set({ gameStarted }),
  pushDebug: (e) =>
    set((s) => ({ debugEvents: [...s.debugEvents.slice(-199), e] })),
  clearDebug: () => set({ debugEvents: [] }),
  setError: (lastError) => set({ lastError }),
  reset: () =>
    set({
      players: [],
      pot: 0,
      round: "—",
      communityCards: [],
      privateHand: [],
      chat: [],
      currentTurn: null,
      gameStarted: false,
    }),
}));
