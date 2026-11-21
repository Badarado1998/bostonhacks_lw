// Tiny per-instance TTL cache with in-flight dedupe and stale-on-error.

interface Entry<T> {
  value?: T;
  fetchedAt: number;
  inflight?: Promise<T>;
}

const store = new Map<string, Entry<unknown>>();

/**
 * Return a cached value younger than ttlMs, else refresh with `load`.
 * Concurrent callers share one in-flight request. If the refresh fails and a value
 * younger than maxStaleMs exists, the stale value is returned instead of throwing.
 */
export async function cached<T>(
  key: string,
  ttlMs: number,
  load: () => Promise<T>,
  maxStaleMs = 5 * 60_000,
): Promise<T> {
  const now = Date.now();
  const entry = (store.get(key) as Entry<T> | undefined) ?? { fetchedAt: 0 };
  if (entry.value !== undefined && now - entry.fetchedAt < ttlMs) return entry.value;
  if (entry.inflight) return entry.inflight;

  const p = load()
    .then((value) => {
      store.set(key, { value, fetchedAt: Date.now() });
      return value;
    })
    .catch((err) => {
      const stale = store.get(key) as Entry<T> | undefined;
      if (stale) stale.inflight = undefined;
      if (stale?.value !== undefined && Date.now() - stale.fetchedAt < maxStaleMs) {
        console.warn(`[mbta] refresh failed for ${key}, serving stale`, String(err));
        return stale.value;
      }
      throw err;
    });
  store.set(key, { ...entry, inflight: p });
  return p;
}

/** When the cached value for `key` was fetched (ms epoch), or null. */
export function cachedAt(key: string): number | null {
  const e = store.get(key);
  return e && e.value !== undefined ? e.fetchedAt : null;
}
