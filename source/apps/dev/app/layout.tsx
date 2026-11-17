/** Root layout. Scaffolded by Dryv once; this file belongs to the app. Change the shell freely. */
import Link from "next/link";
import type { ReactNode } from "react";

import "#/app/globals.css";
import { navigation } from "#/lib/dryv/routes.ts";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ display: "flex", gap: "1rem", padding: "0.75rem 1rem" }}>
          <Link href="/">Home</Link>
          {navigation.map((entry) => (
            <Link key={entry.name} href={entry.href}>
              {entry.label}
            </Link>
          ))}
        </nav>
        {children}
      </body>
    </html>
  );
}
