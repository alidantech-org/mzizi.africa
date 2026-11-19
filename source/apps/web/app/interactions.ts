"use server";

/**
 * Likes and views of the web, through the generated client. The visitor is a random device identifier kept in a cookie the
 * server sets on the first like; the API stores only a salted hash of it. A view is sent with the visitor's address and
 * browser, which the API hashes with a daily salt and discards. The web has no other write.
 */
import { cookies, headers } from "next/headers";

import { getEngagement } from "@mzizi/api-client/actions/interactions/get-engagement.actions.ts";
import { like } from "@mzizi/api-client/actions/interactions/like.actions.ts";
import { recordView } from "@mzizi/api-client/actions/interactions/record-view.actions.ts";
import { unlike } from "@mzizi/api-client/actions/interactions/unlike.actions.ts";

const COOKIE = "mz_device";
const YEAR = 60 * 60 * 24 * 365;

export type Engagement = import("@mzizi/api-client/types/interactions/engagement.ts").InteractionsEngagement;
const NONE: Engagement = { likes: 0, liked: false };

async function device(create: boolean): Promise<string | undefined> {
  const jar = await cookies();
  const known = jar.get(COOKIE)?.value;
  if (known || !create) return known;
  const fresh = `${crypto.randomUUID()}${crypto.randomUUID()}`.replaceAll("-", "");
  jar.set(COOKIE, fresh, { httpOnly: true, sameSite: "lax", path: "/", maxAge: YEAR });
  return fresh;
}

export async function readEngagement(subjectTable: string, subjectRef: string): Promise<Engagement> {
  const deviceId = await device(false);
  const result = await getEngagement({ query: { subjectTable, subjectRef, ...(deviceId ? { deviceId } : {}) } });
  return result.success && result.body ? result.body : NONE;
}

export async function setLike(subjectTable: string, subjectRef: string, on: boolean): Promise<Engagement> {
  const deviceId = await device(on);
  if (!deviceId) return readEngagement(subjectTable, subjectRef);
  const result = await (on ? like : unlike)({ body: { subjectTable, subjectRef, deviceId } });
  return result.success && result.body ? result.body : NONE;
}

export async function noteView(subjectTable: string, subjectRef: string): Promise<void> {
  const sent = await headers();
  const address = sent.get("x-forwarded-for")?.split(",")[0]?.trim() ?? sent.get("x-real-ip") ?? "unknown";
  const visitor = `${address}|${sent.get("user-agent") ?? ""}`.slice(0, 600);
  await recordView({ body: { subjectTable, subjectRef, visitor } });
}
