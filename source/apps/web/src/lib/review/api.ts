import 'server-only';

import { mintToken } from '@/lib/review/auth';

const API = process.env.REVIEW_API_URL ?? 'http://127.0.0.1:3000';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Calls the NestJS API as the signed-in reviewer. Only used from server components and actions. */
export async function api<T>(path: string, init: { method?: 'GET' | 'POST'; query?: Record<string, string | number | undefined>; body?: unknown } = {}): Promise<T> {
  const token = await mintToken();
  const url = new URL(`/v1${path}`, API);
  for (const [key, value] of Object.entries(init.query ?? {})) if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  let response: Response;
  try {
    response = await fetch(url, {
      method: init.method ?? 'GET',
      headers: { authorization: `Bearer ${token}`, ...(init.body ? { 'content-type': 'application/json' } : {}) },
      body: init.body ? JSON.stringify(init.body) : undefined,
      cache: 'no-store',
    });
  } catch {
    throw new ApiError(0, `The API is not reachable at ${API}. Start it with bun run dev in source/backend/api.`);
  }
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new ApiError(response.status, detail.message ?? `${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface Candidate {
  id: string;
  runId: string;
  targetKind: string;
  status: string;
  method: string;
  confidence: number | null;
  issueCount: number;
  createdAt: string;
}
export interface CandidateDetail {
  candidate: Candidate;
  payload: string;
  locator: string | null;
  segmentKey: string | null;
  extractionResultId: string;
  captureId: string | null;
  issues: { rule: string; severity: string; message: string }[];
  current: string | null;
}
