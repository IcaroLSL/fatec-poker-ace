import { createFileRoute } from "@tanstack/react-router";
import { PokerRoom } from "@/pages/PokerRoom";

export const Route = createFileRoute("/")({
  component: PokerRoom,
  head: () => ({
    meta: [
      { title: "Poker Fatec — Texas Hold'em Online" },
      {
        name: "description",
        content:
          "Mesa de poker online em tempo real. Entre na sala, jogue Texas Hold'em e converse com outros jogadores.",
      },
    ],
  }),
});
