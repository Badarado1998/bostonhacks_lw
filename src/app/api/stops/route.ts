// GET /api/stops?routeId=Red  (team id or MBTA route id; owner: A, T02)
import type { NextRequest } from "next/server";
import { HttpError, handle, json } from "@/server/http";
import { expandRouteIds, getStops } from "@/server/mbta/stops";

export const GET = handle(async (req: NextRequest) => {
  const routeId = req.nextUrl.searchParams.get("routeId");
  if (!routeId) throw new HttpError(400, "missing_route", "routeId is required, e.g. ?routeId=Red");
  if (expandRouteIds(routeId).length === 0) throw new HttpError(400, "bad_route", `Unknown routeId: ${routeId}`);
  const stops = await getStops(routeId).catch((err) => {
    console.error("[api/stops]", err);
    throw new HttpError(502, "mbta_unavailable", "Stop data is temporarily unavailable.");
  });
  return json(stops, { headers: { "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
});
