/**
 * Client-Side Dual-Tier Persistent Cache
 * Memoizes analysis results directly in browser memory and sessionStorage
 * Prevents unnecessary network requests on preset switching and repeat audits.
 */

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  ttlMs: number;
}

class ClientStorageCache {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private maxMemoryEntries = 50;

  /**
   * Generates a deterministic client cache key
   */
  public generateKey(prefix: string, ...parts: string[]): string {
    const raw = `${prefix}:${parts.join("::")}`;
    // Simple deterministic string hash for client keys
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `lexiguard_${prefix}_${Math.abs(hash)}`;
  }

  /**
   * Retrieves data from client memory or sessionStorage
   */
  public get<T>(key: string): T | null {
    const now = Date.now();

    // 1. Check in-memory Map
    const memEntry = this.memoryCache.get(key);
    if (memEntry) {
      if (now - memEntry.cachedAt < memEntry.ttlMs) {
        return memEntry.data as T;
      }
      this.memoryCache.delete(key);
    }

    // 2. Check sessionStorage if available in browser
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        const item = window.sessionStorage.getItem(key);
        if (item) {
          const entry: CacheEntry<T> = JSON.parse(item);
          if (now - entry.cachedAt < entry.ttlMs) {
            // Restore to memory cache
            this.memoryCache.set(key, entry);
            return entry.data;
          }
          window.sessionStorage.removeItem(key);
        }
      } catch (e) {
        // Ignore sessionStorage quota or access errors
      }
    }

    return null;
  }

  /**
   * Persists data to client memory and sessionStorage
   */
  public set<T>(key: string, data: T, ttlMs = 1800000): void {
    const entry: CacheEntry<T> = {
      data,
      cachedAt: Date.now(),
      ttlMs,
    };

    // Trim memory cache if full
    if (this.memoryCache.size >= this.maxMemoryEntries) {
      const oldestKey = this.memoryCache.keys().next().value;
      if (oldestKey) {
        this.memoryCache.delete(oldestKey);
      }
    }

    this.memoryCache.set(key, entry);

    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        window.sessionStorage.setItem(key, JSON.stringify(entry));
      } catch (e) {
        // Quota exceeded or private browsing
      }
    }
  }

  /**
   * Clears client cache
   */
  public clear(): void {
    this.memoryCache.clear();
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.sessionStorage.length; i++) {
          const k = window.sessionStorage.key(i);
          if (k && k.startsWith("lexiguard_")) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => window.sessionStorage.removeItem(k));
      } catch (e) {}
    }
  }
}

export const clientCache = new ClientStorageCache();
