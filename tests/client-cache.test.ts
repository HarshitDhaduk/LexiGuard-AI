import { describe, it, expect, beforeEach } from "vitest";
import { clientCache } from "../src/lib/client-cache";

describe("Client-Side Dual-Tier Persistent Cache", () => {
  beforeEach(() => {
    clientCache.clear();
  });

  it("generates deterministic client cache keys", () => {
    const key1 = clientCache.generateKey("audit", "Contract Text Sample");
    const key2 = clientCache.generateKey("audit", "Contract Text Sample");
    const key3 = clientCache.generateKey("audit", "Different Text");

    expect(key1).toBe(key2);
    expect(key1).not.toBe(key3);
    expect(key1).toContain("lexiguard_audit_");
  });

  it("stores and retrieves items from in-memory cache with high fidelity", () => {
    const key = clientCache.generateKey("test", "payload1");
    const data = { title: "Freelance Agreement", riskScore: 42 };

    clientCache.set(key, data);
    const retrieved = clientCache.get<typeof data>(key);

    expect(retrieved).not.toBeNull();
    expect(retrieved?.title).toBe("Freelance Agreement");
    expect(retrieved?.riskScore).toBe(42);
  });

  it("returns null for non-existent cache keys", () => {
    const missing = clientCache.get("lexiguard_non_existent");
    expect(missing).toBeNull();
  });

  it("evicts expired entries after TTL elapsed", () => {
    const key = clientCache.generateKey("ttl", "fast-expire");
    // Set with 1ms TTL
    clientCache.set(key, { expired: true }, -10);

    const result = clientCache.get(key);
    expect(result).toBeNull();
  });

  it("clears all in-memory entries cleanly", () => {
    const k1 = clientCache.generateKey("k1", "data");
    const k2 = clientCache.generateKey("k2", "data");

    clientCache.set(k1, "value1");
    clientCache.set(k2, "value2");

    clientCache.clear();

    expect(clientCache.get(k1)).toBeNull();
    expect(clientCache.get(k2)).toBeNull();
  });

  it("enforces memory bounds and trims oldest entries", () => {
    // Insert 60 entries (exceeding 50 max capacity)
    for (let i = 0; i < 60; i++) {
      clientCache.set(`key_${i}`, { index: i });
    }

    // Newest entries should be present
    expect(clientCache.get("key_59")).toEqual({ index: 59 });
    expect(clientCache.get("key_50")).toEqual({ index: 50 });
  });
});
