import type { Player } from "@/types/poker";

export const API_BASE = "http://sink-microphone-jan-downloaded.trycloudflare.com";
export const WS_BASE = "ws://sink-microphone-jan-downloaded.trycloudflare.com/ws";

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
