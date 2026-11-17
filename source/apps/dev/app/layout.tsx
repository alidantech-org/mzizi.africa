/** Root layout. Scaffolded by Dryv once; this file belongs to the app: the shell (sidebar, top bar) is hand-built. */
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "#/app/globals.css";
import { PortalShell } from "#/components/portal/shell.tsx";

export const metadata: Metadata = { title: "Mzizi developer portal" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PortalShell>{children}</PortalShell>
      </body>
    </html>
  );
}
