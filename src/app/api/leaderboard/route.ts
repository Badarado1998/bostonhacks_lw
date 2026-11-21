import { handle, json } from "@/server/http";
import { leaderboard } from "@/server/points";
export const dynamic = "force-dynamic";
export const GET = handle(async () => json(await leaderboard(), { headers: { "Cache-Control": "no-store" } }));
