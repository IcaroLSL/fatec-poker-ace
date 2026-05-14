export type Suit = "espada" | "copa" | "ouro" | "paus";
export type Position = "BTN" | "SB" | "BB" | "UTG" | "MP" | "CO" | string;

export interface Card {
  value: string;
  suit: Suit;
}

export interface Player {
  name: string;
  position?: Position;
  chips?: number;
  cardCount?: number;
  active?: boolean;
  folded?: boolean;
  bet?: number;
}

export interface ChatMessage {
  id: string;
  from: string;
  message: string;
  timestamp: number;
  system?: boolean;
}

export type ConnectionState = "idle" | "connecting" | "connected" | "disconnected" | "error";

export interface DebugEvent {
  id: string;
  direction: "in" | "out";
  type: string;
  payload: unknown;
  timestamp: number;
}

// Outgoing
export type OutgoingMessage =
  | { type: "JOIN"; name: string }
  | { type: "START"; start: boolean }
  | { type: "ACTION"; action: "CALL" | "FOLD" }
  | { type: "ACTION"; action: "RAISE"; amount: number }
  | { type: "CHAT"; message: string }
  | { type: "NEXT_ROUND" }
  | { type: "KICK_INACTIVE"; inactiveSeconds: number }
  | { type: "TRANSFER"; target: string; amount: number };

// Incoming
export interface IncomingMessage {
  type: string;
  [k: string]: unknown;
}
