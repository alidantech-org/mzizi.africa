import { HttpException, ServiceUnavailableException } from "@nestjs/common";

type Operation = "comments" | "evidence" | "decisions";
type OperationTransport = <T>(operation: Operation, payload: Record<string, unknown>) => Promise<T>;
let testTransport: OperationTransport | undefined;

/** Test-only adapter seam. Production requests always use the configured database service URL. */
export function setDatabaseOperationTransportForTesting(transport?: OperationTransport): void {
  testTransport = transport;
}

/** Calls a named operation on the sole database write owner. */
export async function writeDatabase<T>(operation: Operation, payload: Record<string, unknown>): Promise<T> {
  if (testTransport) return testTransport<T>(operation, payload);
  const base = process.env.DATABASE_SERVICE_URL;
  const token = process.env.DATABASE_SERVICE_TOKEN;
  if (!base || !token) throw new ServiceUnavailableException("database operations are not configured");
  let response: Response;
  try {
    response = await fetch(new URL(`/internal/v1/audit/${operation}`, base), {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new ServiceUnavailableException("database service is unavailable");
  }
  if (!response.ok) {
    if (response.status >= 500) throw new ServiceUnavailableException("database operation failed");
    throw new HttpException("database operation was rejected", response.status);
  }
  return await response.json() as T;
}
