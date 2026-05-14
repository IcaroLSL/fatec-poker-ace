import { WS_BASE } from "@/services/api";
import { usePokerStore } from "@/store/pokerStore";
import type {
  Card,
  ChatMessage,
  IncomingMessage,
  OutgoingMessage,
  Player,
} from "@/types/poker";

type Handler = (msg: IncomingMessage) => void;

export class PokerSocket {
  private ws: WebSocket | null = null;
  private roomId: string;
  private name: string;
  private handlers: Record<string, Handler> = {};
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeat: ReturnType<typeof setInterval> | null = null;
  private shouldReconnect = true;
  private joinSent = false;

  constructor(roomId: string, name: string) {
    this.roomId = roomId;
    this.name = name;
    this.registerDefaultHandlers();
  }

  on(type: string, handler: Handler) {
    this.handlers[type] = handler;
  }

  connect() {
    const store = usePokerStore.getState();
    store.setConnection("connecting");
    try {
      this.ws = new WebSocket(`${WS_BASE}/${this.roomId}`);
    } catch (err) {
      store.setConnection("error");
      store.setError(String(err));
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      usePokerStore.getState().setConnection("connected");
      usePokerStore.getState().setError(null);
      this.joinSent = false;
      this.send({ type: "JOIN", name: this.name });
      this.joinSent = true;
      this.startHeartbeat();
    };

    this.ws.onmessage = (ev) => {
      let parsed: IncomingMessage;
      try {
        parsed = JSON.parse(ev.data);
      } catch {
        return;
      }
      usePokerStore.getState().pushDebug({
        id: crypto.randomUUID(),
        direction: "in",
        type: parsed.type ?? "UNKNOWN",
        payload: parsed,
        timestamp: Date.now(),
      });
      const handler = this.handlers[parsed.type];
      if (handler) handler(parsed);
    };

    this.ws.onerror = () => {
      usePokerStore.getState().setConnection("error");
    };

    this.ws.onclose = () => {
      usePokerStore.getState().setConnection("disconnected");
      this.stopHeartbeat();
      if (this.shouldReconnect) this.scheduleReconnect();
    };
  }

  send(msg: OutgoingMessage) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify(msg));
    usePokerStore.getState().pushDebug({
      id: crypto.randomUUID(),
      direction: "out",
      type: msg.type,
      payload: msg,
      timestamp: Date.now(),
    });
  }

  disconnect() {
    this.shouldReconnect = false;
    this.stopHeartbeat();
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeat = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify({ type: "PING" }));
        } catch {
          /* ignore */
        }
      }
    }, 25000);
  }

  private stopHeartbeat() {
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
      this.heartbeat = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.shouldReconnect) this.connect();
    }, 2000);
  }

  private registerDefaultHandlers() {
    const s = () => usePokerStore.getState();
    const asCards = (raw: unknown): Card[] => {
      if (!Array.isArray(raw)) return [];
      return raw
        .map((c) => {
          if (typeof c === "string") {
            // try parse "A-espada" or "A espada"
            const parts = c.split(/[-\s]+/);
            if (parts.length >= 2) {
              return { value: parts[0], suit: parts[1] as Card["suit"] };
            }
            return null;
          }
          if (c && typeof c === "object") {
            const obj = c as Record<string, unknown>;
            const value = (obj.value ?? obj.rank ?? obj.v) as string;
            const suit = (obj.suit ?? obj.naipe ?? obj.s) as Card["suit"];
            if (value && suit) return { value: String(value), suit };
          }
          return null;
        })
        .filter((c): c is Card => c !== null);
    };

    this.on("PLAYER_JOINED", (m) => {
      const name = (m.name ?? m.player) as string | undefined;
      if (name) s().upsertPlayer({ name });
      const players = m.players as Player[] | undefined;
      if (Array.isArray(players)) s().setPlayers(players);
    });

    this.on("PLAYERS_REMOVED", (m) => {
      const names = (m.removed ?? m.players) as string[] | undefined;
      if (Array.isArray(names)) s().removePlayers(names);
    });

    this.on("POSITIONS_UPDATED", (m) => {
      const players = m.players as Player[] | undefined;
      if (Array.isArray(players)) s().setPlayers(players);
    });

    this.on("CHAT_HISTORY", (m) => {
      const msgs = (m.messages ?? m.history) as
        | Array<{ from?: string; name?: string; message: string; timestamp?: number }>
        | undefined;
      if (Array.isArray(msgs)) {
        s().setChatHistory(
          msgs.map((x, i) => ({
            id: `${i}-${x.timestamp ?? Date.now()}`,
            from: x.from ?? x.name ?? "system",
            message: x.message,
            timestamp: x.timestamp ?? Date.now(),
          })),
        );
      }
    });

    this.on("CHAT", (m) => {
      const from = (m.from ?? m.name ?? "system") as string;
      const message = (m.message ?? "") as string;
      s().addChat({
        id: crypto.randomUUID(),
        from,
        message,
        timestamp: Date.now(),
      } as ChatMessage);
    });

    this.on("GAME_STARTED", (m) => {
      s().setGameStarted(true);
      s().setRound("PRE-FLOP");
      const players = m.players as Player[] | undefined;
      if (Array.isArray(players)) s().setPlayers(players);
      s().setCommunityCards([]);
    });

    this.on("PRIVATE_HAND", (m) => {
      const cards = asCards(m.cards ?? m.hand);
      s().setPrivateHand(cards);
    });

    this.on("TURN", (m) => {
      const name = (m.player ?? m.name ?? m.current) as string | undefined;
      if (name) s().setTurn(name);
    });

    this.on("PLAYER_ACTION", (m) => {
      const name = (m.player ?? m.name) as string | undefined;
      const action = (m.action ?? "") as string;
      const amount = (m.amount ?? 0) as number;
      s().addChat({
        id: crypto.randomUUID(),
        from: "system",
        message: `${name ?? "?"} fez ${action}${amount ? ` ${amount}` : ""}`,
        timestamp: Date.now(),
        system: true,
      });
      if (typeof m.pot === "number") s().setPot(m.pot);
    });

    this.on("ROUND_ADVANCED", (m) => {
      const round = (m.round ?? m.stage) as string | undefined;
      if (round) s().setRound(round);
      const community = asCards(m.community ?? m.communityCards ?? m.board);
      if (community.length) s().setCommunityCards(community);
      if (typeof m.pot === "number") s().setPot(m.pot);
    });

    this.on("HAND_FINISHED", (m) => {
      const winner = (m.winner ?? m.winners) as string | undefined;
      s().addChat({
        id: crypto.randomUUID(),
        from: "system",
        message: `Mão finalizada${winner ? ` — vencedor: ${winner}` : ""}`,
        timestamp: Date.now(),
        system: true,
      });
      s().setRound("FIM");
    });

    this.on("CHIPS_TRANSFERRED", (m) => {
      s().addChat({
        id: crypto.randomUUID(),
        from: "system",
        message: `Transferência: ${m.from} → ${m.to} (${m.amount})`,
        timestamp: Date.now(),
        system: true,
      });
    });
  }
}

let socketInstance: PokerSocket | null = null;

export function getSocket(roomId?: string, name?: string): PokerSocket | null {
  if (!socketInstance && roomId && name) {
    socketInstance = new PokerSocket(roomId, name);
    socketInstance.connect();
  }
  return socketInstance;
}

export function destroySocket() {
  socketInstance?.disconnect();
  socketInstance = null;
}
