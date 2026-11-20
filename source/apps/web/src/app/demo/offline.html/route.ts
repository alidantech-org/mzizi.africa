import { demoAsset } from "#demo/_lib/server/demo-assets";
export async function GET() {
  return demoAsset("shell", "offline.html");
}
