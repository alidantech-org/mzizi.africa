import { expect, test } from "bun:test";
import { RedisClient } from "bun";
import { randomUUID } from "node:crypto";
import { RedisCache } from "#runtime/redis-cache";
const url = process.env.DRYV_REDIS_TEST_URL;
(url ? test : test.skip)("Redis TTL and generation namespaces", async () => {
  const redis = new RedisClient(url!);
  try {
    const cache = new RedisCache(
      {
        async command(args) {
          const command = args[0];
          if (!command) throw new Error("Missing command");
          const result: unknown = await redis.send(command, args.slice(1));
          return result;
        },
      },
      "dryv-proof:" + randomUUID(),
    );
    expect(await cache.get("absent")).toBeNull();
    expect(await cache.version("read")).toBe("0");
    await cache.set("key", "value", 30);
    expect(await cache.get("key")).toBe("value");
    await cache.invalidate("read");
    expect(await cache.version("read")).toBe("1");
  } finally {
    redis.close();
  }
});
