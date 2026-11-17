/**
 * The operation.client calling convention: a client function takes { params, query, body } and
 * resolves to this response. clients/next-api-bridge's ApiBridgeResponse has the same shape.
 */
export type ClientResponse<T> = {
  success: boolean;
  message: string;
  body: T | null;
  status: number;
};

/** The names of a paged operation's window inputs and the largest page it serves. */
export type PageNames = { limit: string; offset: string; maxLimit: number };

export type ClientInput = {
  params?: Record<string, string>;
  query?: Record<string, unknown>;
  body?: unknown;
};

/**
 * Sends one request to the application's HTTP API. Set NEXT_PUBLIC_API_URL to its base URL, or to a path on this
 * site (such as `/api/engine`) when a server-side layer forwards the call and holds any secret.
 */
export async function send<T>(
  method: string,
  path: string,
  input: ClientInput,
): Promise<ClientResponse<T>> {
  const base = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(input.query ?? {})) {
    if (value !== undefined && value !== null) query.set(key, String(value));
  }
  const search = query.size === 0 ? "" : `?${query.toString()}`;
  try {
    const response = await fetch(`${base}${path}${search}`, {
      method,
      headers: input.body === undefined ? undefined : { "content-type": "application/json" },
      body: input.body === undefined ? undefined : JSON.stringify(input.body),
    });
    const text = await response.text();
    const body = text === "" ? null : (JSON.parse(text) as T);
    return { success: response.ok, message: response.statusText, body, status: response.status };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
      body: null,
      status: 0,
    };
  }
}

/** Field metadata generated for each schema, used by DryvForm and DryvResult. */
export type FieldMeta = {
  name: string;
  label: string;
  kind: "string" | "number" | "boolean" | "enum" | "date" | "other";
  required: boolean;
  options?: readonly string[];
};
