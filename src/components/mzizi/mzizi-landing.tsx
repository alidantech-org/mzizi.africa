import Script from "next/script";
import { mziziLandingMarkup } from "@/content/mzizi-landing";

/**
 * Pixel-parity landing page port of the supplied Mzizi HTML prototype.
 *
 * The prototype markup and runtime are intentionally isolated here while the
 * surrounding application uses a standard Next.js + Tailwind + shadcn setup.
 * This keeps the original visual/interaction contract intact and makes future
 * product pages easy to build as normal React components.
 */
export function MziziLanding() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: mziziLandingMarkup }} />
      <Script src="/mzizi-runtime.js" strategy="afterInteractive" />
    </>
  );
}
