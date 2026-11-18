/**
 * Server-side layer between the portal and the engine. The engine service key stays here (`ENGINE_SERVICE_TOKEN`) and
 * never reaches a browser; the browser calls `/api/engine/<engine path>` and this route forwards allowed paths.
 * Scaffolded by the project, not Dryv.
 */
import type { NextRequest } from "next/server";

/** The engine paths the portal may reach. Everything else is refused. */
const ALLOWED = [
  "capabilities",
  "health",
  "ready",
  "v1/jobs",
  "v1/runs",
  "v1/catalog",
  "v1/events",
  "v1/explore",
];

async function forward(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  const { path } = await context.params;
  const joined = path.join("/");
  if (!ALLOWED.some((prefix) => joined === prefix || joined.startsWith(`${prefix}/`))) {
    return Response.json({ message: `The portal does not forward ${joined}.` }, { status: 403 });
  }
  const base = process.env.ENGINE_URL ?? "http://127.0.0.1:8800";
  const token = process.env.ENGINE_SERVICE_TOKEN;
  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  try {
    const response = await fetch(`${base}/${joined}${request.nextUrl.search}`, {
      method: request.method,
      headers: {
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(hasBody ? { "content-type": "application/json" } : {}),
      },
      body: hasBody ? await request.text() : undefined,
      cache: "no-store",
    });
    return new Response(await response.arrayBuffer(), {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch (error) {
    return Response.json(
      {
        message: `The engine is not reachable at ${base}: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 502 },
    );
  }
}

export { forward as GET, forward as POST, forward as PUT };
