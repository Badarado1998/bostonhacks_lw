import type { RouteInfo } from "@/contracts";
import { MBTA_ROUTES, TEAMS } from "@/contracts";
import { cached } from "./cache";
import { mbtaGet } from "./client";

/** Static route list in contract shape (colors and districts are ours, not MBTA's). */
export function getRoutes(): RouteInfo[] {
  return MBTA_ROUTES.map((r) => ({
    id: r.id,
    teamRouteId: r.teamRouteId,
    name: r.name,
    color: TEAMS[r.teamRouteId].color,
    districtName: TEAMS[r.teamRouteId].districtName,
  }));
}

/** routeId -> [destination for direction 0, destination for direction 1], e.g. Red -> ["Ashmont/Braintree", "Alewife"]. */
export async function getDirectionDestinations(): Promise<Map<string, [string, string]>> {
  return cached(
    "routes:destinations",
    24 * 60 * 60_000,
    async () => {
      const doc = await mbtaGet<{ direction_destinations: [string, string] }>("/routes", {
        "filter[id]": MBTA_ROUTES.map((r) => r.id).join(","),
        "fields[route]": "direction_destinations",
      });
      return new Map(doc.data.map((r) => [r.id, r.attributes.direction_destinations]));
    },
    7 * 24 * 60 * 60_000,
  );
}

export async function destinationFor(routeId: string, directionId: 0 | 1): Promise<string | null> {
  try {
    return (await getDirectionDestinations()).get(routeId)?.[directionId] ?? null;
  } catch {
    return null;
  }
}
