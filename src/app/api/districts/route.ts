import { handle, json } from "@/server/http";
import { districts } from "@/server/points";
export const dynamic = "force-dynamic";
export const GET = handle(async () => json(await districts(), { headers: { "Cache-Control": "no-store" } }));
