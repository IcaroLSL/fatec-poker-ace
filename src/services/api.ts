import type { Player } from "@/types/poker";

export const API_BASE = "http://localhost:8080";
export const WS_BASE = "ws://localhost:8080/ws";

export async function fetchPlayers(roomId: string): Promise<Player[]> {
  const res = await fetch(`${API_BASE}/ws/players/${roomId}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchPlayer(
  roomId: string,
  name: string,
): Promise<Player> {
  const res = await fetch(`${API_BASE}/ws/player/${roomId}/${name}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
