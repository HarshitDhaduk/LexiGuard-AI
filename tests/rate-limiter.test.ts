import { describe, it, expect, beforeEach } from "vitest";
import { apiRateLimiter } from "../src/lib/rate-limiter";

describe("Sliding-Window IP Rate Limiter", () => {
  beforeEach(() => {
    apiRateLimiter.reset();
  });

  it("permits initial requests and tracks remaining capacity", () => {
    const ip = "192.168.1.100";
    const res1 = apiRateLimiter.check(ip);

    expect(res1.allowed).toBe(true);
    expect(res1.limit).toBe(45);
    expect(res1.remaining).toBe(44);

    const res2 = apiRateLimiter.check(ip);
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBe(43);
  });

  it("enforces boundary limit and blocks excess requests", () => {
    const ip = "10.0.0.5";

    // Exhaust 45 requests
    for (let i = 0; i < 45; i++) {
      const res = apiRateLimiter.check(ip);
      expect(res.allowed).toBe(true);
    }

    // 46th request must be blocked
    const blockedRes = apiRateLimiter.check(ip);
    expect(blockedRes.allowed).toBe(false);
    expect(blockedRes.remaining).toBe(0);
    expect(blockedRes.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("maintains strict quota isolation between distinct client IPs", () => {
    const clientA = "172.16.0.1";
    const clientB = "172.16.0.2";

    // Exhaust client A
    for (let i = 0; i < 45; i++) {
      apiRateLimiter.check(clientA);
    }

    expect(apiRateLimiter.check(clientA).allowed).toBe(false);

    // Client B must still have full quota
    const resB = apiRateLimiter.check(clientB);
    expect(resB.allowed).toBe(true);
    expect(resB.remaining).toBe(44);
  });

  it("resets limits when explicitly requested", () => {
    const ip = "127.0.0.1";
    for (let i = 0; i < 45; i++) {
      apiRateLimiter.check(ip);
    }
    expect(apiRateLimiter.check(ip).allowed).toBe(false);

    apiRateLimiter.reset();

    const freshRes = apiRateLimiter.check(ip);
    expect(freshRes.allowed).toBe(true);
    expect(freshRes.remaining).toBe(44);
  });
});
