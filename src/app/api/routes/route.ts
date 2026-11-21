// GET /api/routes  (owner: A, T02)
import { handle, json } from "@/server/http";
import { getRoutes } from "@/server/mbta/routes";

export const GET = handle(async () =>
  json(getRoutes(), { headers: { "cache-control": "public, s-maxage=86400" } }),
);
