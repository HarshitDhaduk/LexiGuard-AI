/**
 * Sliding-Window IP Rate Limiter
 * Protects backend GenAI endpoints against abuse, DoS, and automated scraping.
 */

interface RateLimitRecord {
  timestamps: number[];
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTimeMs: number;
  retryAfterSeconds?: number;
}

class SlidingWindowRateLimiter {
  private requests = new Map<string, RateLimitRecord>();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs = 60 * 1000, maxRequests = 40) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Periodic cleanup of stale IPs every 5 minutes to prevent memory leaks
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.cleanup(), 5 * 60 * 1000).unref?.();
    }
  }

  public check(identifier: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let record = this.requests.get(identifier);
    if (!record) {
      record = { timestamps: [] };
      this.requests.set(identifier, record);
    }

    // Filter out timestamps outside the sliding window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= this.maxRequests) {
      const oldestTimestamp = record.timestamps[0];
      const resetTimeMs = oldestTimestamp + this.windowMs;
      const retryAfterSeconds = Math.max(1, Math.ceil((resetTimeMs - now) / 1000));

      return {
        allowed: false,
        limit: this.maxRequests,
        remaining: 0,
        resetTimeMs,
        retryAfterSeconds,
      };
    }

    // Register current request timestamp
    record.timestamps.push(now);

    return {
      allowed: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - record.timestamps.length,
      resetTimeMs: now + this.windowMs,
    };
  }

  private cleanup(): void {
    const windowStart = Date.now() - this.windowMs;
    this.requests.forEach((record, key) => {
      record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
      if (record.timestamps.length === 0) {
        this.requests.delete(key);
      }
    });
  }

  public reset(): void {
    this.requests.clear();
  }
}

// Global rate limiter singleton
export const apiRateLimiter = new SlidingWindowRateLimiter(60 * 1000, 45);
