import { createHash } from "node:crypto";
import type { CacheStore } from "./persistence.types";
/** Adapt the application's Redis client at its I/O boundary; this pack owns no sockets. */
export interface RedisCommands {
  command(args: string[]): Promise<unknown>;
}
export class RedisCache implements CacheStore {
  constructor(
    private readonly redis: RedisCommands,
    private readonly prefix: string,
  ) {
    if (!prefix)
      throw new Error("An explicit project/store cache prefix is required");
  }
  private key(value: string): string {
    return `${this.prefix}:${createHash("sha256").update(value).digest("hex")}`;
  }
  async get(key: string): Promise<string | null> {
    const result = await this.redis.command(["GET", this.key(key)]);
    if (result === null || typeof result === "string") return result;
    throw new Error("Unexpected Redis GET response");
  }
  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    if (!Number.isSafeInteger(ttlSeconds) || ttlSeconds <= 0)
      throw new Error("Invalid cache TTL");
    const result = await this.redis.command([
      "SET",
      this.key(key),
      value,
      "EX",
      String(ttlSeconds),
    ]);
    if (result !== "OK") throw new Error("Redis SET failed");
  }
  async version(operation: string): Promise<string> {
    const result = await this.redis.command([
      "GET",
      this.key(`version:${operation}`),
    ]);
    if (result === null) return "0";
    if (typeof result === "string" && /^\d+$/.test(result)) return result;
    throw new Error("Invalid cache generation");
  }
  async invalidate(operation: string): Promise<void> {
    const result = await this.redis.command([
      "INCR",
      this.key(`version:${operation}`),
    ]);
    if (typeof result !== "number" && typeof result !== "string")
      throw new Error("Redis invalidation failed");
  }
}
