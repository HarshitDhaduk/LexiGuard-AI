import { describe, it, expect, beforeEach } from "vitest";
import { globalContractCache } from "../src/lib/cache";

describe("High-Performance In-Memory LRU Cache", () => {
  beforeEach(() => {
    globalContractCache.clear();
  });

  it("generates deterministic SHA-256 keys for identical inputs", () => {
    const key1 = globalContractCache.generateKey("test", "Hello World", "Part 2");
    const key2 = globalContractCache.generateKey("test", "Hello World", "Part 2");
    const key3 = globalContractCache.generateKey("test", "Hello World", "Part 3");

    expect(key1).toBe(key2);
    expect(key1).not.toBe(key3);
    expect(key1).toMatch(/^test:[a-f0-9]{64}$/);
  });

  it("stores and retrieves items accurately with latency savings", () => {
    const key = globalContractCache.generateKey("sample", "Contract Content");
    const payload = { title: "Sample MSA", score: 85 };

    globalContractCache.set(key, payload);
    const retrieved = globalContractCache.get<{ title: string; score: number }>(key);

    expect(retrieved).not.toBeNull();
    expect(retrieved?.data).toEqual(payload);
    expect(retrieved?.latencySavedMs).toBeGreaterThan(0);
  });

  it("tracks cache telemetry, hit ratios, and token savings accurately", () => {
    const key1 = "telemetry-test-1";
    const key2 = "telemetry-test-2";

    globalContractCache.set(key1, { test: 1 });

    // 1 Hit
    globalContractCache.get(key1);
    // 1 Miss
    globalContractCache.get(key2);

    const telemetry = globalContractCache.getTelemetry();
    expect(telemetry.hits).toBe(1);
    expect(telemetry.misses).toBe(1);
    expect(telemetry.hitRatioPercentage).toBe(50);
    expect(telemetry.estimatedTokensSaved).toBeGreaterThan(0);
  });

  it("handles cache misses gracefully", () => {
    const result = globalContractCache.get("non-existent-key");
    expect(result).toBeNull();
  });

  it("clears all entries and resets telemetry counters", () => {
    globalContractCache.set("key-1", "value-1");
    globalContractCache.clear();

    expect(globalContractCache.get("key-1")).toBeNull();
    const telemetry = globalContractCache.getTelemetry();
    expect(telemetry.totalEntries).toBe(0);
    expect(telemetry.hits).toBe(0);
  });
});
