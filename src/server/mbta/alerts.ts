import type { TeamRouteId } from "@/contracts";
import { MBTA_ROUTES, toTeamRouteId } from "@/contracts";
import { cached } from "./cache";
import { mbtaGet, ttl } from "./client";

type AlertAttrs = {
  effect: string;
  header: string;
  severity: number;
  lifecycle: string;
  active_period: { start: string; end: string | null }[];
  informed_entity: { route?: string; stop?: string; direction_id?: number; activities?: string[] }[];
};

export interface ServiceAlert {
  id: string;
  effect: string;
  header: string;
  severity: number;
  lifecycle: string;
  startedAt: string | null;
  routeIds: string[];
  teamRouteIds: TeamRouteId[];
  stopIds: string[];
}

/** Currently-active alerts touching our tracked routes. Cached ~30 s. */
export async function getAlerts(): Promise<ServiceAlert[]> {
  return cached("alerts:active", ttl(30_000), async () => {
    const doc = await mbtaGet<AlertAttrs>("/alerts", {
      "filter[route]": MBTA_ROUTES.map((r) => r.id).join(","),
      "filter[datetime]": "NOW",
      "fields[alert]": "effect,header,severity,lifecycle,active_period,informed_entity",
    });
    return doc.data.map((a) => {
      const ents = a.attributes.informed_entity ?? [];
      const routeIds = [...new Set(ents.map((e) => e.route).filter((r): r is string => Boolean(r)))];
      const teamRouteIds = [
        ...new Set(routeIds.map(toTeamRouteId).filter((t): t is TeamRouteId => t !== null)),
      ];
      const now = Date.now();
      const current = a.attributes.active_period?.find(
        (p) => Date.parse(p.start) <= now && (!p.end || Date.parse(p.end) >= now),
      );
      return {
        id: a.id,
        effect: a.attributes.effect,
        header: a.attributes.header,
        severity: a.attributes.severity,
        lifecycle: a.attributes.lifecycle,
        startedAt: current ? new Date(current.start).toISOString() : null,
        routeIds,
        teamRouteIds,
        stopIds: [...new Set(ents.map((e) => e.stop).filter((s): s is string => Boolean(s)))],
      };
    });
  });
}
