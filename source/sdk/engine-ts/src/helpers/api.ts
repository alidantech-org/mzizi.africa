import "server-only";
import { createNextApiBridge } from "next-api-bridge";

/**
 * Server engine client: a next-api-bridge client for server-only actions and loaders. The engine service key stays on the
 * server. Configure it with ENGINE_URL and ENGINE_SERVICE_TOKEN (sent in the `x-service-key` header, which the engine accepts for its service key).
 */
export const api = createNextApiBridge({
  baseUrl: process.env.ENGINE_URL ?? "http://127.0.0.1:8800",
  apiKey: process.env.ENGINE_SERVICE_TOKEN,
  apiKeyHeader: "x-service-key",
  verbose: process.env.ENABLE_VERBOSE_LOGGING,
});
