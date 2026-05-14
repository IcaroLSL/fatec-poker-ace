import { cn } from "@/lib/utils";
import { usePokerStore } from "@/store/pokerStore";

export function ConnectionStatus() {
  const status = usePokerStore((s) => s.connection);
  const colors: Record<string, string> = {
    idle: "bg-gray-500",
    connecting: "bg-yellow-500 animate-pulse",
    connected: "bg-green-500",
    disconnected: "bg-orange-500",
    error: "bg-red-500",
  };
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/10">
      <span className={cn("w-2 h-2 rounded-full", colors[status])} />
      <span className="text-xs uppercase tracking-wider text-white/80">{status}</span>
    </div>
  );
}
