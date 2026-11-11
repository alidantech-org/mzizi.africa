/** Narrow transport to named internal database-service operations. */
export async function databaseOperation<T>(path: string, body?: unknown, method = "POST"): Promise<T> {
  const base = process.env.DATABASE_SERVICE_URL;
  const token = process.env.DATABASE_SERVICE_TOKEN;
  if (!base || !token) throw new Error("DATABASE_SERVICE_URL and DATABASE_SERVICE_TOKEN are required");
  const response = await fetch(new URL(`/internal/v1/pipelines/${path.replace(/^\//, "")}`, base), {
    method,
    headers: { authorization: `Bearer ${token}`, ...(body === undefined ? {} : { "content-type": "application/json" }) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Database operation failed (${response.status}): ${await response.text()}`);
  return await response.json() as T;
}
