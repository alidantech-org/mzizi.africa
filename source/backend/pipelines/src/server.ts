/** Internal pipeline submission/status API. The NestJS API remains the public authentication boundary. */
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { timingSafeEqual } from "node:crypto";
import { databaseOperation } from "./database-client.js";

function authorized(request: IncomingMessage): boolean {
  const expected = process.env.PIPELINES_API_TOKEN;
  if (!expected) return false;
  const left = Buffer.from(request.headers.authorization ?? "");
  const right = Buffer.from(`Bearer ${expected}`);
  return left.length === right.length && timingSafeEqual(left, right);
}

async function readBody(request: IncomingMessage): Promise<Record<string, unknown>> {
  let raw = "";
  for await (const part of request) {
    raw += part.toString();
    if (raw.length > 1_000_000) throw Object.assign(new Error("request body is too large"), { status: 413 });
  }
  const value: unknown = JSON.parse(raw || "{}");
  if (!value || typeof value !== "object" || Array.isArray(value)) throw Object.assign(new Error("request body must be an object"), { status: 400 });
  return value as Record<string, unknown>;
}

function send(response: ServerResponse, status: number, value: unknown): void {
  response.writeHead(status, { "content-type": "application/json", "cache-control": "no-store" });
  response.end(JSON.stringify(value));
}

export function startPipelineHttpServer(): Promise<{ close(): Promise<void> }> {
  if (!process.env.PIPELINES_API_TOKEN) throw new Error("PIPELINES_API_TOKEN is required");
  const server = createServer(async (request, response) => {
    try {
      if (!authorized(request)) return send(response, 401, { error: "unauthorized" });
      const url = new URL(request.url ?? "/", "http://localhost");
      const path = url.pathname.split("/").filter(Boolean);
      if (request.method === "POST" && path.join("/") === "v1/runs") {
        const body = await readBody(request);
        if (!/^[a-z][a-z0-9._-]{1,99}$/.test(String(body.manifestId ?? "")) || !Number.isInteger(body.manifestVersion) ||
          !/^[a-f0-9]{64}$/i.test(String(body.manifestHash ?? "")) || !/^[a-zA-Z0-9._:-]{8,200}$/.test(String(body.idempotencyKey ?? "")) ||
          !/^[0-9a-f-]{36}$/i.test(String(body.requestedBy ?? "")) || !body.input || typeof body.input !== "object") {
          return send(response, 400, { error: "run command is invalid" });
        }
        const result = await databaseOperation<{ runId: string; created: boolean }>("runs", body);
        return send(response, result.created ? 202 : 200, result);
      }
      const runId = path[2];
      if (path[0] === "v1" && path[1] === "runs" && runId && request.method === "GET" && path.length === 3) {
        return send(response, 200, await databaseOperation(`runs/${runId}`, undefined, "GET"));
      }
      if (path[0] === "v1" && path[1] === "runs" && runId && path.length === 4 && path[3] === "events" && request.method === "GET") {
        const cursor = url.searchParams.get("after") ?? "0";
        return send(response, 200, await databaseOperation(`runs/${runId}/events?after=${encodeURIComponent(cursor)}`, undefined, "GET"));
      }
      if (path[0] === "v1" && path[1] === "runs" && runId && path.length === 4 && request.method === "POST") {
        const body = await readBody(request);
        if (path[3] === "cancel") return send(response, 202, await databaseOperation(`runs/${runId}/cancel`, body));
        if (path[3] === "review") return send(response, 202, await databaseOperation(`runs/${runId}/review`, body));
      }
      return send(response, 404, { error: "not found" });
    } catch (error) {
      const status = Number((error as { status?: number }).status) || 503;
      send(response, status, { error: error instanceof Error ? error.message : "pipeline request failed" });
    }
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(Number(process.env.PIPELINES_PORT ?? 3302), process.env.PIPELINES_HOST ?? "127.0.0.1", () => {
      server.removeListener("error", reject);
      resolve({ close: () => new Promise<void>((done, fail) => server.close((error) => error ? fail(error) : done())) });
    });
  });
}
