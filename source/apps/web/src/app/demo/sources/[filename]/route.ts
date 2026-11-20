import { demoAsset } from "#demo/_lib/server/demo-assets";
export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  return demoAsset("sources", (await params).filename);
}
