/** Serve only files inside the demo's private static payload directory. */
import "server-only";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { connection } from "next/server";

export type DemoAssetGroup = "flags" | "sources" | "shell";
const contentTypes: { [extension: string]: string } = {
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".csv": "text/csv; charset=utf-8",
  ".json": "application/json",
  ".geojson": "application/geo+json",
  ".js": "text/javascript; charset=utf-8",
  ".html": "text/html; charset=utf-8",
};

export async function demoAsset(group: DemoAssetGroup, filename: string): Promise<Response> {
  await connection();
  if (!filename || filename.startsWith(".") || filename.includes("/") || filename.includes("\\") || filename.includes("\0"))
    return new Response("Demo asset not found", { status: 404 });
  const root = join(process.cwd(), "src/app/demo/_assets");
  const directory = group === "shell" ? root : join(root, group);
  try {
    const bytes = await readFile(join(directory, filename));
    const worker = group === "shell" && filename === "sw.js";
    return new Response(Uint8Array.from(bytes), {
      headers: {
        "Content-Type": contentTypes[extname(filename)] ?? "application/octet-stream",
        "Content-Length": String(bytes.byteLength),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": worker ? "no-store" : "public, max-age=300",
        ...(worker ? { "Service-Worker-Allowed": "/demo" } : {}),
      },
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error.code === "ENOENT" || error.code === "EISDIR"))
      return new Response("Demo asset not found", { status: 404 });
    throw error;
  }
}
