/** Demo-scoped install manifest. Nested metadata is served explicitly so it cannot become a real-app manifest. */
import manifest from "#demo/_lib/pwa/manifest";
export function GET() {
  return Response.json(manifest(), { headers: { "Content-Type": "application/manifest+json" } });
}
