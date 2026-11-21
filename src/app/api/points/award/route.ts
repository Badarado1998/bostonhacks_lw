import { timingSafeEqual } from "node:crypto";
import type { AwardPointsInput } from "@/contracts";
import { apiError, handle, json, readJson } from "@/server/http";
import { awardPoints } from "@/server/points";
import { ScoringError } from "@/server/points/rules";
export const POST = handle(async (req: Request) => {
  const secret = process.env.GAME_INTERNAL_SECRET;
  if (!secret) return apiError(503, "internal_awards_disabled", "Use the server-side awardPoints integration.");
  const received = Buffer.from(req.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return apiError(401, "unauthorized", "Internal authorization required.");
  try { return json(await awardPoints(await readJson<AwardPointsInput>(req))); }
  catch (error) { if (error instanceof ScoringError) return apiError(error.status, error.code, error.message); throw error; }
});
