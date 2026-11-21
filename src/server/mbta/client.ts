// MBTA V3 API client (server only; the key never reaches the browser).

const BASE = "https://api-v3.mbta.com";

export interface JsonApiResource<A = Record<string, unknown>> {
  id: string;
  type: string;
  attributes: A;
  relationships?: Record<string, { data: { id: string; type: string } | { id: string; type: string }[] | null }>;
}

export interface JsonApiDoc<A = Record<string, unknown>> {
  data: JsonApiResource<A>[];
  included?: JsonApiResource[];
}

export class MbtaError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

// If the configured key is rejected, stop sending it for a while and go keyless.
let keyRejectedUntil = 0;

export function hasWorkingKey(): boolean {
  return Boolean(process.env.MBTA_API_KEY) && Date.now() > keyRejectedUntil;
}

/** Cache TTL multiplier: keyless requests are limited to 20/min per IP, so cache longer. */
export function ttl(baseMs: number): number {
  return hasWorkingKey() ? baseMs : baseMs * 2;
}

export async function mbtaGet<A = Record<string, unknown>>(
  path: string,
  params: Record<string, string> = {},
): Promise<JsonApiDoc<A>> {
  const url = new URL(path, BASE);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const send = async (withKey: boolean) => {
    const headers: Record<string, string> = { accept: "application/vnd.api+json" };
    if (withKey && process.env.MBTA_API_KEY) headers["x-api-key"] = process.env.MBTA_API_KEY;
    return fetch(url, { headers, cache: "no-store", signal: AbortSignal.timeout(8000) });
  };

  const useKey = hasWorkingKey();
  let res = await send(useKey);
  if (useKey && (res.status === 401 || res.status === 403)) {
    console.error("[mbta] API key rejected; falling back to keyless for 10 minutes");
    keyRejectedUntil = Date.now() + 10 * 60_000;
    res = await send(false);
  }
  if (!res.ok) throw new MbtaError(res.status, `MBTA ${url.pathname} -> HTTP ${res.status}`);
  return (await res.json()) as JsonApiDoc<A>;
}

export function relId(r: JsonApiResource, name: string): string | null {
  const d = r.relationships?.[name]?.data;
  return d && !Array.isArray(d) ? d.id : null;
}
