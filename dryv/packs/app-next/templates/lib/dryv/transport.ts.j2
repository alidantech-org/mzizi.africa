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

export type ClientInput = {
  params?: Record<string, string>;
  query?: Record<string, unknown>;
  body?: unknown;
};

/** Sends one request to the application's HTTP API. Set NEXT_PUBLIC_API_URL to its base URL. */
export async function send<T>(method: string, path: string, input: ClientInput): Promise<ClientResponse<T>> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  const url = new URL(path, base === "" ? "http://localhost" : base);
  for (const [key, value] of Object.entries(input.query ?? {})) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  }
  try {
    const response = await fetch(base === "" ? `${url.pathname}${url.search}` : url, {
      method,
      headers: input.body === undefined ? undefined : { "content-type": "application/json" },
      body: input.body === undefined ? undefined : JSON.stringify(input.body),
    });
    const text = await response.text();
    const body = text === "" ? null : (JSON.parse(text) as T);
    return { success: response.ok, message: response.statusText, body, status: response.status };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : String(error), body: null, status: 0 };
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
